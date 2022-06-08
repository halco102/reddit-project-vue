//pinia
import { defineStore } from "pinia";
import { useUserStore as user } from "@/User/store/store";

//axios
import axios from "axios";

//types
import * as CommentType from '@/Comment/types'

//toast
import { useToast } from 'vue-toastification';

//stomp
import { Client } from "@stomp/stompjs";


// base url when using localhost
const BASE_URL = 'http://127.0.0.1:8082/api/v1/comment'
const ws = 'ws://127.0.0.1:8082/ws'

//base url when deployed
//const BASE_URL = 'https://demo-reddit-project.herokuapp.com' +  '/api/v1/comment'
//const ws = 'wss://demo-reddit-project.herokuapp.com/ws'


let customWebsocket : Client;

const toast = useToast();


export const useCommentStore = defineStore('comments', {
    state: (): CommentType.Comment => {
        return {
            postLikeOrDislike: [],
            commentsDto: [],
            commentDto: {
                id: 0,
                text: '',
                parentId: 0,
                userInfo: {
                    id: 0,
                    username: '',
                    imageUrl: ''
                },
                likedOrDislikedComments: []
            },
            isPostingComment: false
        }
    },
    getters: {
        getPostLikeOrDislike(state): CommentType.PostLikeOrDislikeResponse[] {
            return state.postLikeOrDislike;
        },
        getAllCommentsByPostId(state): CommentType.CommentDto[] {
            return state.commentsDto;
        },
        getIsPostingComment(state) : boolean {
            return state.isPostingComment;
        }

    },
    actions: {
        getJwtFromUser: function (): string {
            return user().$state.userLoginResponse.jwt;
        },

        async postCommentAction(postAComment: CommentType.PostComment) {
            const json = JSON.stringify(postAComment);

            console.log("Start comment action")
            console.log("Log", json)

            await axios.post(BASE_URL, json, {
                headers: {
                    'Authorization': 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => {this.isPostingComment = true})
            }).then(response => {
                this.commentsDto.push(response.data);
                this.sendMessage(this.commentsDto, '');
                this.isPostingComment = false;
            }).catch(function (ex) {
                if (ex.response.status === 401) {
                    toast.warning("Unaothorized")
                } else if (ex.response.status === 400) {
                    toast.warning("Bad request");
                } else {
                    toast.warning("Something went wrong");
                }
            })

        },

        fetchAllCommentsByPostId: async function (postId : number) {
            
            await axios.get(BASE_URL + '/post/' + postId)
            .then(response => {
                this.commentsDto = response.data;
                console.log("Get com from post by post id", response.data);
            })

        },

        postLikeOrDislike: async function (request: CommentType.PostLikeOrDislikeRequest) {
            const json = JSON.stringify(request);
            console.log("Post like or dislike", json);

            await axios.post(BASE_URL + '/like-dislike', json, {
                headers: {
                    'Authorization': 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log("Response", response);
                //this.$patch((state) => {
                this.commentDto = response.data;
                const temp = this.$state.commentsDto.map(i => i.id).indexOf(this.commentDto.id);
                this.$state.commentsDto[temp] = this.commentDto;
                //})

            }).catch(function (ex) {
                if (ex.response.status === 401) {
                    toast.warning("You have to login to like or dislike a comment");
                } else {
                    toast.warning("Something went wrong");
                }
            })
        },

        deleteCommentById: async function(id : number, postId? : number) {
            console.log("Delete comment by id");
            await axios.delete(BASE_URL + '/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                console.log("Send event to everyone", this.$state.commentsDto);
                this.$state.commentsDto.forEach((element, index) => {
                    console.log('Element', element, ' posalni id', id);
                    if (element.id === id) {
                        console.log("Izbrisi ", element.id)
                        this.$state.commentsDto.splice(index, 1);
                    }

                    if (element.parentId === id) {
                        console.log("Child izbrisi", element.parentId)
                        this.$state.commentsDto.splice(index, 1);
                    }
                })
                this.sendMessage('COMMENT_DELETED', '', postId)
            })
        },
        resetState: function () {
            this.$reset();
        },

        patchComments: function (comments: CommentType.CommentDto[]) {
            this.commentsDto = comments;
        },

        getNumberOfLikes: function (comment: CommentType.CommentDto): number {
            let number = 0;
            comment.likedOrDislikedComments.filter((x) => x.likedOrDisliked === true).map(() => number++);
            return number;
        },
        getNumberOfDislikes: function (comment: CommentType.CommentDto): number {
            let number = 0;
            comment.likedOrDislikedComments.filter((x) => x.likedOrDisliked === false).map(() => number++);
            return number;
        },
        openWebsocketConnection: function () {

            customWebsocket = new Client({
                brokerURL: ws,
                    connectHeaders: {},
                    debug: function (str) {
                        console.log(str)
                    },
                    reconnectDelay: 30000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        console.log("Subscribe to comment when connected");
                        customWebsocket.subscribe('/topic/comment', (msg) => {
                            console.log("Message body ", JSON.parse(msg.body));
                            this.$state.commentsDto = JSON.parse(msg.body);
                        })
                    },
                
                    
            });
            
            customWebsocket.activate();

        },
        sendMessage: function (object: CommentType.CommentDto[] | string, path: string, commentsState? : CommentType.CommentDto[] | number) {

            let msgEvent: string;

         
            if (typeof object === 'string') {
                console.log("SEIGJAEIOGJAEGIOJAEOGIJAEGIO")
               console.log("String");
               msgEvent = object;
               console.log("msgEvent", msgEvent)
               customWebsocket.publish({
                  destination:'/app/comment/delete',
                  body: JSON.stringify(commentsState)
               });
               return;
            }

            customWebsocket.publish({
                destination: '/app/comment' + path,
                body: JSON.stringify(object)
            })

        },
        disconnectFromWs: function () {
            console.log("Disconnect from ws");
            customWebsocket.forceDisconnect();
        },

        setCommentsFromPost : function(comments : CommentType.CommentDto[]) : void {
            this.$state.commentsDto = comments;
        }

    }
})

