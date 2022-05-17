import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";
import { useToast } from 'vue-toastification';
import { useUserStore as user } from "./UserStore";
import * as Stomp from 'webstomp-client';
import { Client } from "@stomp/stompjs";




// base url when using localhost
//const BASE_URL = 'http://localhost:8082/api/v1/comment'
//const ws = 'ws://127.0.0.1/ws'

//base url when deployed
const BASE_URL = 'http://9ca3-2a02-810d-4b3f-cfe8-b2cb-c585-b205-5836.jp.ngrok.io' +  '/api/v1/comment'
const ws = 'ws://220d-2a02-810d-4b3f-cfe8-b2cb-c585-b205-5836.ngrok.io/ws'


let customWebsocket : Client;

const toast = useToast();

export interface LikesDislikesComment {
    likedOrDisliked: boolean;
}

export interface CommentDto {
    id: number;
    text: string;
    parentId: number;
    userInfo: PostedBy
    likedOrDislikedComments: LikesDislikesComment[]
}


export interface PostComment {
    text: string,
    postId: number,
    userId: number
    parentId: number | null
}

export interface Comment {
    postLikeOrDislike: PostLikeOrDislikeResponse[],
    commentsDto: CommentDto[],
    commentDto: CommentDto;
}

export interface PostLikeOrDislikeRequest {
    commentId: number,
    likeOrDislike: boolean
}

export interface PostLikeOrDislikeResponse {
    commentDto: CommentDto,
    likeOrDislike: boolean,
}

export const useCommentStore = defineStore('comments', {
    state: (): Comment => {
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
            }
        }
    },
    getters: {
        getPostLikeOrDislike(state): PostLikeOrDislikeResponse[] {
            return state.postLikeOrDislike;
        },
        getAllCommentsByPostId(state): CommentDto[] {
            console.log("get state");
            return state.commentsDto;
        },

    },
    actions: {
        getJwtFromUser: function (): string {
            return user().$state.userLoginResponse.jwt;
        },

        async postCommentAction(postAComment: PostComment) {
            const json = JSON.stringify(postAComment);

            console.log("Start comment action")
            console.log("Log", json)

            await axios.post(BASE_URL, json, {
                headers: {
                    'Authorization': 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                console.log("Post comment", this.commentsDto, 'Current comment posted', response.data);
                this.commentsDto.push(response.data);
                toast.success("Comment posted");

                this.sendMessage(this.commentsDto, '');
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
        postLikeOrDislike: async function (request: PostLikeOrDislikeRequest) {
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

        fetchAllCommentsFromPostById: async function (id: number) {
            await axios.get(BASE_URL + '/post/' + id).then(response => {
                console.log("All comments from post", response.data)
                this.commentsDto = response.data;
            }).catch(function () {
                toast.warning("Something went wrong");
            })
        },

        deleteCommentById: async function(id : number) {
            console.log("Delete comment by id");
            await axios.delete(BASE_URL + '/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                console.log("Send event to everyone");
                this.$state.commentsDto.forEach((element, index) => {
                    if (element.id === id) {
                        this.$state.commentsDto.splice(index, 1);
                    }
                })
                this.sendMessage('COMMENT_DELETED', '', this.$state.commentsDto)
            })
        },
        resetState: function () {
            this.$reset();
        },

        patchComments: function (comments: CommentDto[]) {
            this.commentsDto = comments;
        },

        getNumberOfLikes: function (comment: CommentDto): number {
            let number = 0;
            comment.likedOrDislikedComments.filter((x) => x.likedOrDisliked === true).map(() => number++);
            return number;
        },
        getNumberOfDislikes: function (comment: CommentDto): number {
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
                    reconnectDelay: 5000,
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
        sendMessage: function (object: CommentDto[] | string, path: string, commentsState? : CommentDto[]) {

            let msgEvent: string;

         
            if (typeof object === 'string') {
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
        }

    }
})

