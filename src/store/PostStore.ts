import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy, useUserStore as user } from "./UserStore";
import { CommentDto } from './CommentStore'
import { useToast } from 'vue-toastification';


const BASE_URL = 'http://localhost:8080/api/v1/post'
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const toast = useToast();

export interface UserPosts {
   id: number,
   title: string,
   text: string,
   imageUrl: string
}

export interface FrontPagePost {
   id: number;
   title: string;
   text: string,
   imageUrl: string;
   postedBy: PostedBy;
   allowComments: boolean
   commentsDto: CommentDto[]
}

export interface PostRequest {
   title: string,
   text: string,
   imageUrl: string,
   allowComments: boolean
}

export interface PostInterface {
   posts: FrontPagePost[],
   post: FrontPagePost | null,
   request: PostRequest
}

export const usePostStore = defineStore('postStore', {
   state: (): PostInterface => {
      return {
         posts: [],
         post: {
            id: 0,
            title: '',
            text: '',
            imageUrl: '',
            postedBy: {
               id: 0,
               username: '',
               imageUrl: ''
            },
            allowComments: true,
            commentsDto: []
         },
         request: {
            title: '',
            text: '',
            imageUrl: '',
            allowComments: true
         }
      }
   },
   getters: {
      getAllPosts(state) {
         return state.posts
      },
      getPostById(state): FrontPagePost | null {
         return state.post;
      },
      getPostRequest(state): PostRequest {
         return state.request;
      }
   },
   actions: {

      getJwtFromUser(): string {
         return user().$state.userLoginResponse.jwt;
      },

      async fetchAllPostToShow() {
         await axios.get(BASE_URL).then(response => {
            console.log("Fetch data", response.data)
            this.posts = response.data;
         }).catch(function (ex) {
            if (ex.response.status === 500) {
               toast.warning("Something went wrong");
            }
         })
      },

      async fetchPostById(id: number) {
         await axios.get(BASE_URL + '/' + id).then(response => {
            console.log("Single data fetch ", response.data)
            this.post = response.data;
         }).catch(function (ex){
            if(ex.response.state === 500) {
               toast.error("Something went wrong");
            }
         })

      },

      async savePost(request: PostRequest) {
         const json = JSON.stringify(request);
         console.log("Start save post ", json);

         await axios.post(BASE_URL + '/', json, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
               'Content-Type': 'application/json'
            }
         }).then(response => {
            this.request = response.data;
         }).catch(function (ex){
            console.log("ex", ex.response);
            if (ex.response.status === 400) {
               toast.error("Bad request");
            } else if (ex.response.status === 401) {
               toast.error("Unathorized to post");
            } else {
               toast.error("Something went wrong while saving post");
            }
         })
      },
      
   }
})