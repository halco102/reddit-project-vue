import { defineStore } from "pinia";
import axios from "axios";


const BASE_URL = 'http://localhost:8080/api/v1/comment'


export interface PostComment{
    text: string,
    postId: number,
    userId: number
    parentId: number | null
}

export interface Comment{
    postComment: PostComment
}

export const useCommentStore = defineStore('comments',{
    state: () => {
        return{
            postComment: {
                text: '',
                postId: 0,
                userId: 0,
                parentId: null as number | null
            } 
        } as Comment
    },
    getters: {
        getPostedComment(state) : PostComment{
            return state.postComment;
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
            
        }
    }
})