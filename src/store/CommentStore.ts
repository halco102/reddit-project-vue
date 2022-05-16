import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";
import { useToast } from 'vue-toastification';
import { useUserStore as user } from "./UserStore";
import * as Stomp from 'webstomp-client';




// base url when using localhost
//const BASE_URL = 'http://localhost:8082/api/v1/comment'
//const customWebsocket = Stomp.over(new WebSocket('ws://127.0.0.1:80/ws'));

//base url when deployed
//const ngrok = 'http://9559-2a02-810d-4b3f-cfe8-4ef6-295d-3f06-9ad0.eu.ngrok.io';
const BASE_URL = 'http://c739-2a02-810d-4b3f-cfe8-15a7-c810-4e3a-50d2.eu.ngrok.io' +  '/api/v1/comment'

const customWebsocket = Stomp.over(new WebSocket('ws://9e12-2a02-810d-4b3f-cfe8-15a7-c810-4e3a-50d2.ngrok.io/ws'));


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


            if (!customWebsocket.connected) {
                customWebsocket.connect({}, (frame) => {
                    // subscribe
                    customWebsocket.subscribe('/topic/comment', (msg) => {
                        console.log("Subscribed to comments", JSON.parse(msg.body));
                        this.$state.commentsDto = JSON.parse(msg.body);
                    })
                })
            }
        },
        sendMessage: function (object: CommentDto[] | string, path: string) {
            customWebsocket.send('/app/comment' + path, JSON.stringify(object));
        },
        disconnectFromWs: function () {
            console.log("Disconnect from ws");
            customWebsocket.disconnect();
        }

    }
})

