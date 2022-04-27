import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";
import { useToast } from 'vue-toastification';
import { useRoute } from "vue-router";
import { useUserStore as user } from "./UserStore";


const BASE_URL = 'http://localhost:8080/api/v1/comment'
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
                //this.postComment = response.data;
                this.commentsDto.push(response.data);

                //this.commentsDto.push(response.data);
                //this.fetchAllCommentsFromPostById(postAComment.postId);
                toast.success("Comment posted");
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
                console.log("Before patch", this.$state.commentsDto)
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
        }

    }
})

