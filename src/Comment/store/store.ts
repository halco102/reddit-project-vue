//pinia
import { defineStore } from "pinia";
//axios
import axios from "axios";

//types
import * as CommentType from '@/Comment/types'

//toast
import { useToast } from 'vue-toastification';

//stomp
import { IMessage } from "@stomp/stompjs";

import CustomWebSocket from '@/service/CustomWebsocket';
import { LikeDislikeCommentsNotification } from "@/service/WebSocketTypes";


const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/comment';
const ws = process.env.VUE_APP_WEBSOCKET;


const toast = useToast();
const wsConnection = CustomWebSocket.getInstance();

/*
    id: string,
    commentPostDto: CommentPostDto,
    userDto: PostedBy,
    comment: string,
    createdAt: Date
*/


export const useCommentStore = defineStore('comments', {
    state: (): CommentType.Comment => {
        return {
            postLikeOrDislike: [],
            commentsDto: [],
            commentDto: {
                id: '',
                postDto: {
                    id: 0,
                    title: ''
                },
                userDto: {
                    id: 0,
                    username: '',
                    imageUrl: ''
                },
                comment: '',
                createdAt: new Date(),
                likeDislikeComments: [],
                replies: []
            },
            isPostingComment: false
        }
    },
    getters: {
        getPostLikeOrDislike(state): CommentType.CommentLikeOrDislikeResponse[] {
            return state.postLikeOrDislike;
        },
        getAllCommentsByPostId(state): CommentType.CommentDto[] {
            return state.commentsDto;
        },
        getIsPostingComment(state): boolean {
            return state.isPostingComment;
        },
        getAllCommentsFromUser(state): CommentType.CommentDto[] {
            return state.commentsDto;
        }

    },
    actions: {

        async postCommentAction(postAComment: CommentType.PostComment) {
            const json = JSON.stringify(postAComment);

            await axios.post(BASE_URL, json, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => { this.isPostingComment = true })
            }).then(response => {
                this.commentsDto.push(response.data);
                //this.sendMessage(this.commentsDto, '');
                this.isPostingComment = false;
            }).catch(function (ex) {
                console.log("Catch exception on postComment", ex)
                if (ex.response.status === 401) {
                    toast.warning("Unaothorized")
                } else if (ex.response.status === 400) {
                    toast.warning("Bad request");
                } else {
                    toast.warning("Something went wrong");
                }
            })

        },

        fetchAllCommentsByPostId: async function (postId: number) {

            await axios.get(BASE_URL + '/post/' + postId)
                .then(response => {
                    this.commentsDto = response.data;
                    console.log("Get com from post by post id", response.data);
                })

        },

        postLikeOrDislike: async function (request: CommentType.PostLikeOrDislikeRequest) {
            const json = JSON.stringify(request);

            console.log("JSON", json);

            await axios.post(BASE_URL + '/like-dislike', json, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
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

        deleteCommentById: async function (id: number | string, postId?: number) {
            console.log("Delete comment by id");
            await axios.delete(BASE_URL + '/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                console.log("Send event to everyone", this.$state.commentsDto);
                let deleteFoundIndex = -1;
                this.$state.commentsDto.findIndex((element, index) => {
                    if (element.id === id) {
                        deleteFoundIndex = index;
                        return;
                    }

                    if (element.replies.length !== 0) {
                        element.replies.findIndex((inner, index) => {
                            if (inner.id === id) {
                                element.replies.splice(index, 1);
                                return;
                            }
                        })
                    }
                });

                if (deleteFoundIndex != -1)
                    this.$state.commentsDto.splice(deleteFoundIndex, 1);
            })
        },

        getNumberOfLikes: function (comment: CommentType.CommentDto): number {
            let number = 0;
            comment.likeDislikeComments.filter((x) =>
                x.likeOrDislike === true
            ).map(() => number++);
            return number;
        },
        getNumberOfDislikes: function (comment: CommentType.CommentDto): number {
            let number = 0;
            comment.likeDislikeComments.filter((x) =>
                x.likeOrDislike === false
            ).map(() => number++)

            return number;
        },
        subscribeToTopic: function (topic: string) {
            wsConnection.getClient().subscribe("/topic/" + topic, (msg: IMessage) => {
                if (msg.body === 'COMMENT_DELETED') {
                    const num: number = +topic.split('comment/')[1];
                    this.fetchAllCommentsByPostId(num);
                } else {
                    const toJson: CommentType.CommentDto | LikeDislikeCommentsNotification = JSON.parse(msg.body);
                    if ('eventName' in toJson) {
                        console.log("Update comment value");
                        const comment = this.$state.commentsDto.findIndex(item => item.id === toJson.commentDto.id);
                        this.$state.commentsDto[comment] = toJson.commentDto;
                    } else {
                        console.log("Dodaj", toJson, "vidi ", this.$state.commentsDto);
                        if (this.$state.commentsDto[0] == undefined || this.$state.commentsDto[0]?.id != toJson.id) {
                            this.$state.commentsDto.unshift(toJson);
                        }
                        else
                            msg.ack();
                    }
                }

            })
        },
        setCommentsFromPost: function (comments: CommentType.CommentDto[]): void {
            this.$state.commentsDto = comments;
        },

        fetchUserComments: async function (userId: number) {
            await axios.get(BASE_URL + "/user/comment/" + userId)
                .then(response => {
                    console.log("Fetch user comments by id", response.data);
                    this.$state.commentsDto = response.data;
                }).catch(function (ex) {
                    if (ex.response.status === 401) {
                        toast.warning("You have to login to like or dislike a comment");
                    } else {
                        toast.warning("Something went wrong");
                    }
                })


        }

    }
})

