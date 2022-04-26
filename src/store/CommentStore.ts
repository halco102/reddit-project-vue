import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";
import { FrontPagePost } from "./PostStore";


const BASE_URL = 'http://localhost:8080/api/v1/comment'

export interface CommentDto{
    id: number;
    text: string;
    parentId: number;
}

export interface CommentResponse{
    commentsDto: CommentDto;
    userInfo: PostedBy;
}

export interface PostComment{
    text: string,
    postId: number,
    userId: number
    parentId: number | null
}

export interface Comment{
    postComment: PostComment,
    postLikeOrDislike: PostLikeOrDislikeResponse,
    commentResponse: CommentResponse[]
}

export interface PostLikeOrDislikeRequest{
    userId: number,
    commentId: number,
    likeOrDislike: boolean | null
}

export interface PostLikeOrDislikeResponse{
    commentDto: CommentDto,
    likeOrDislike: boolean | null
}

export const useCommentStore = defineStore('comments',{
    state: () : Comment => {
        return{
            postComment: {
                text: '',
                postId: 0,
                userId: 0,
                parentId: null as number | null
            } ,
            postLikeOrDislike: {
                commentDto:{
                    id: 0,
                    text: '',
                    parentId: 0
                },
                likeOrDislike: null
            },
            commentResponse: [
                    {
                        commentsDto:{
                            id: 0,
                            text:'',
                            parentId:0
                        },
                        userInfo:{
                            id: 0,
                            username: '',
                            imageUrl: ''
                        }
                    }
            ]
        }
    },
    getters: {
        getPostedComment(state) : PostComment{
            return state.postComment;
        },
        getPostLikeOrDislike(state) : PostLikeOrDislikeResponse{
            return state.postLikeOrDislike;
        },
        getAllCommentsFromPost(state) : CommentResponse[] {
            return state.commentResponse;
        }
    },
    actions: {
        
        async postCommentAction(postAComment : PostComment) {
            const json = JSON.stringify(postAComment);

            console.log("Start comment action")
            console.log("Log", json)

            const postData = await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });
            
            console.log(postData)
            this.$state.postComment = postData.data;
            this.$state.commentResponse.push(postData.data);
            
        },
        postLikeOrDislike: async function(request: PostLikeOrDislikeRequest) {
            const json = JSON.stringify(request);
            console.log("Post like or dislike", json);

            const postLikeOrDislikeRequest = await axios.post(BASE_URL + '/like-dislike', json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(postLikeOrDislikeRequest.status === 200) {
                console.log("Successful post for like and dislike")
                this.$state.postLikeOrDislike = postLikeOrDislikeRequest.data;
            }else{
                alert("Something went wrong with post like or dislike")
            }
        },

        getAllCommentsFromPostById: async function(id: number){
            const commenst = await axios.get(BASE_URL + '/post/' + id);
            if (commenst.status === 200) {
                console.log("All comments from post", commenst.data)
                this.commentResponse = commenst.data;
            }
        },

        resetState: function() {
           this.$reset();
        },
        updateState: function(post: FrontPagePost){
            this.$state.commentResponse = post.commentsDto;
        }

    }
})