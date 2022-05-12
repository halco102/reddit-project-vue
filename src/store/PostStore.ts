import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy, useUserStore as user } from "./UserStore";
import { CommentDto } from './CommentStore'
import { useToast } from 'vue-toastification';

let ws = {} as WebSocket;



// Base url on localhost and ws
const BASE_URL = 'http://localhost:8082/api/v1/post'
const wsUrl = 'ws://127.0.0.1:80/ws/post'

//when deployed
/*
const ngrok = 'http://2434-2a02-810d-4b3f-cfe8-4bc5-7cfc-593-172d.ngrok.io';
const BASE_URL = ngrok +  '/api/v1/post'
const wsUrl = 'ws://b6b4-2a02-810d-4b3f-cfe8-4bc5-7cfc-593-172d.jp.ngrok.io/ws/post'
*/

const toast = useToast();

export interface UserPosts {
   id: number,
   title: string,
   text: string,
   imageUrl: string,
   postLikeOrDislikeDtos: PostLikeOrDislike[]
}

export interface postLikeOrDislikeRequest {
   postId: number,
   likeOrDislike: boolean
}

export interface PostLikeOrDislike {
   likeOrDislike: boolean;
}

export interface FrontPagePost {
   id: number;
   title: string;
   text: string,
   imageUrl: string;
   postedBy: PostedBy;
   allowComments: boolean
   commentsDto: CommentDto[]
   postLikeOrDislikeDtos: PostLikeOrDislike[]
}

export interface PostRequest {
   title: string,
   text: string,
   imageUrl: string,
   allowComments: boolean,
}

export interface PostInterface {
   posts: FrontPagePost[],
   post: FrontPagePost,
   request: PostRequest,
   isLoading: boolean,
   isDeleted: boolean
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
            commentsDto: [],
            postLikeOrDislikeDtos: []
         },
         request: {
            title: '',
            text: '',
            imageUrl: '',
            allowComments: true,
         },
         isLoading: false,
         isDeleted: false
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
      },
      getIsLoading(state): boolean {
         return state.isLoading;
      },
      getIsDeleted(state): boolean {
         return state.isDeleted;
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
         }).catch(function (ex) {
            if (ex.response.state === 500) {
               toast.error("Something went wrong");
            }
         })

      },

      async savePost(request: PostRequest, location: string) {

         const json = JSON.stringify(request);
         const temp = new FormData();
         temp.append('file', location);
         temp.append('requestDto', json);

         await axios.post(BASE_URL + '/', temp, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
               'Content-Type': 'multipart/form-data',

            },
            onUploadProgress: (() => { this.isLoading = true })
         }).then(response => {
            //this.request = response.data;
            //this.posts.push(response.data);
            toast.success("Successfuly posted");
            this.sendEvent('ADD_POST');
         }).catch(function (ex) {
            console.log("ex", ex.response);
            if (ex.response.status === 400) {
               toast.error("Bad request");
               return;
            } else if (ex.response.status === 401) {
               toast.error("Unathorized to post");
               return;
            } else {
               toast.error("Something went wrong while saving post");
               return;
            }
         }).finally(() => {
            this.isLoading = false;
         })
      },

      async postLikeOrDislikeForPost(request: postLikeOrDislikeRequest) {
         const json = JSON.stringify(request);

         console.log("LIkepost", json)

         await axios.post(BASE_URL + '/like-dislike', json, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
               'Content-Type': 'application/json'
            }
         }).then(response => {

            /*
            this.post = response.data;
            const temp = this.$state.posts.map((i) => i.id).indexOf(this.post.id);
            this.$state.posts[temp] = this.post;*/

            this.$patch((state) => {
               this.post = response.data;
               const temp = state.posts.map((i) => i.id).indexOf(this.post.id);
               state.posts[temp] = this.post;
            })

            this.post = response.data;
            this.sendEvent('LIKE_DISLIKE_POST');
         }).catch(function (ex) {
            if (ex.response.status === 400) {
               toast.error("Bad request");
            } else if (ex.response.status === 401) {
               toast.error("Unathorized");
            } else {
               toast.error("Something went wrong while saving post");
            }
         });
      },

      getNumberOfLikes: function (post: FrontPagePost): number {
         let likes = 0;
         if (post.postLikeOrDislikeDtos.length !== 0) {
            post.postLikeOrDislikeDtos.filter((x) => x.likeOrDislike === true).map(() => likes++);
         }
         return likes;
      },

      getNumberOfDislikes: function (post: FrontPagePost): number {
         let dislikes = 0;
         if (post.postLikeOrDislikeDtos.length !== 0) {
            post.postLikeOrDislikeDtos.filter((x) => x.likeOrDislike === false).map(() => dislikes++);
         }
         return dislikes;
      },

      deletePostById: async function (id: number) {
         console.log("Delete action", id)

         await axios.delete(BASE_URL + '/' + id, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
            }
         }).then(() => {
            const index = this.posts.findIndex(object => {
               return object.id === id;
            })
            this.posts.splice(index);
            console.log("After delte", this.posts)
            toast.success("Post deleted");
            this.isDeleted = true;
         }).catch(function (ex) {
            if (ex.response.status === 404) {
               toast.error(ex.response.statusText);
            } else if (ex.response.status === 401) {
               toast.error("Unathorized");
            } else {
               toast.error("Something went wrong while saving post");
            }
         })
      },
      openWebsocket: function () : void{

         console.log("WS", ws.readyState);
         
         if (ws.readyState === undefined){
            console.log("Open connection");
            ws = new WebSocket(wsUrl);
         }

         if (ws.readyState === 3) {
            console.log("Connection was closed, create new connection!");
            ws = new WebSocket(wsUrl);
         }
      
      },
      sendEvent: function (message: string) {
         ws.send(message);
      },
      getEvent: function (): void {
         ws.onmessage = event => {
            console.log("event triggered", event.data);
            if (event.data === 'ADD_POST') {
               console.log("Add post event");
               this.fetchAllPostToShow();
            }
            if (event.data === 'LIKE_DISLIKE_POST') {
               console.log("Like or dislike post event");
               // get new state ? 
               
            }

            

         }
      },
      closeWebSocket: function () {
         console.log("Close post websocket");
         ws.close();
      }
   },
})