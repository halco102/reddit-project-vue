import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";
import { useToast } from 'vue-toastification';
import { useUserStore as user } from "./UserStore";



let ws = {} as WebSocket;
const BASE_URL = 'http://localhost:8082/api/v1/comment'

//const ngrok = ' https://d2c0-2a02-810d-4b3f-cfe8-8fab-81-8bad-594e.ngrok.io';
//const BASE_URL = ngrok +  '/api/v1/comment'

const toast = useToast();

export interface LikesDislikesComment{
    likedOrDisliked : boolean;
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
    likeOrDislike: boolean | null
}

export interface PostLikeOrDislikeResponse {
    commentDto: CommentDto,
    likeOrDislike: boolean | null,
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
        getJwtFromUser : function() : string{
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
                this.sendEvent('ADD_COMMENT', postAComment.postId);
                
            }).catch(function (ex) {
                if(ex.response.status === 401) {
                    toast.warning("Unaothorized")
                }else if (ex.response.status === 400) {
                    toast.warning("Bad request");
                }else{
                    toast.warning("Something went wrong");
                }
            })



        },
        postLikeOrDislike: async function (request: PostLikeOrDislikeRequest) {
            const json = JSON.stringify(request);
            console.log("Post like or dislike", json);
            console.log("JWT", this.getJwtFromUser())

            await axios.post(BASE_URL + '/like-dislike', json, {
                headers: {
                    'Authorization' : 'Bearer ' + this.getJwtFromUser(),
                    'Content-Type': 'application/json'
                }
            }).then(response => {

                //this.$patch((state) => {
                    this.commentDto = response.data;
                    const temp = this.$state.commentsDto.map(i => i.id).indexOf(this.commentDto.id);
                    this.$state.commentsDto[temp] = this.commentDto;
                //})
            }).catch(function (ex) {
                if (ex.response.status === 401) {
                    toast.warning("You have to login to like or dislike a comment");
                }else{
                    toast.warning("Something went wrong");
                }
            })
        },

        fetchAllCommentsFromPostById: async function (id: number) {
            await axios.get(BASE_URL + '/post/' + id).then(response => {
                console.log("All comments from post", response.data)
                this.commentsDto = response.data;
            }).catch(function (){
                toast.warning("Something went wrong");
            })
        },


        resetState: function () {
            this.$reset();
        },

        patchComments: function(comments: CommentDto[]) {
            this.commentsDto = comments;
        },

        getNumberOfLikes: function(comment: CommentDto) : number{
            let number = 0;
            comment.likedOrDislikedComments.filter((x) => x.likedOrDisliked === true).map(() => number++);
            return number;
        },
        getNumberOfDislikes: function(comment : CommentDto) : number{
            let number = 0;
            comment.likedOrDislikedComments.filter((x) => x.likedOrDisliked === false).map(() => number++);
            return number;
        },
        openWebsocket: function(){

            console.log("WS", ws.readyState);
         
            if (ws.readyState === undefined){
               console.log("Open connection");
               ws = new WebSocket('ws://127.0.0.1:80/ws/comment');
            }
   
            if (ws.readyState === 3) {
               console.log("Connection was closed, create new connection!");
               ws = new WebSocket('ws://127.0.0.1:80/ws/comment');
            }

        },
         sendEvent: function(message : string, postId: number) {
            ws.send(message + ' ' + postId);
         },
         getEvent: function(): void{
            ws.onmessage = event => {
               console.log("event triggered in comments", event.data);
               console.log('SKrati', event.data.substring(11, event.data.length));
               this.fetchAllCommentsFromPostById(event.data.substring(11, event.data.length));
            }
         },
         closeWebSocket: function() {
            ws.close();
         }

    }
})

