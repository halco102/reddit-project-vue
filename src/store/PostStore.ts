import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy, UserState, useUserStore as user, useUserStore } from "./UserStore";
import { CommentDto } from './CommentStore'
import { useToast } from 'vue-toastification';
import { Client } from "@stomp/stompjs";



// Base url on localhost and ws
const BASE_URL = 'http://127.0.0.1:8082/api/v1/post'
const ws = 'ws://127.0.0.1:8082/ws'
let customWebsocket : Client; 


//when deployed
//const BASE_URL = 'https://demo-reddit-project.herokuapp.com' + '/api/v1/post'
//const ws = 'wss://demo-reddit-project.herokuapp.com/ws'

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
   likeOrDislike: boolean | null;
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
   isDeleted: boolean,
   isSameLikeOrDislikeButton: boolean
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
         isDeleted: false,
         isSameLikeOrDislikeButton: false
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
            this.posts = response.data;
         }).catch(function (ex) {
            if (ex.response.status === 500) {
               toast.warning("Something went wrong");
            }
         })
      },

      async fetchPostById(id: number) {
         await axios.get(BASE_URL + '/' + id).then(response => {
            console.log(response.data, " response")
            this.post = response.data;
         }).catch(function (ex) {
            if (ex.response.state === 500) {
               toast.error("Something went wrong");
            }
         })

      },

      async savePost(request: PostRequest, location: File | null) {

         const json = JSON.stringify(request);
         const temp = new FormData();
         if ( location != null) {
         temp.append('file', location);
      }
         temp.append('requestDto', json);

         await axios.post(BASE_URL + '/', temp, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
               'Content-Type': 'multipart/form-data',

            },
            onUploadProgress: (() => { this.isLoading = true })
         }).then(response => {
            
            this.$state.posts.unshift(response.data);
            this.sendMessage(this.$state.posts, '');
            
         }).catch(function (ex) {

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
         }).finally(()=> {
            console.log("Before isLoading", this.isLoading);
            this.isLoading = false;

            console.log("Check if this executes before time");
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


         
         await axios.delete(BASE_URL + '/' + id, {
            headers: {
               'Authorization': 'Bearer ' + this.getJwtFromUser(),
            }
         }).then(() => {
         
            this.$state.posts.forEach((element, index) => {
               if (element.id === id) {
                  this.$state.posts.splice(index, 1);
               }
            })


            //this.sendMessage('POST_DELETED', '/delete');
            this.isDeleted = true;
            

         }).catch(function (ex) {
            console.log("EXCEPTION ON DELETE")
            if (ex.response.status === 404) {
               toast.error('2');
            } else if (ex.response.status === 401) {
               toast.error("Unathorized");
            } else {
               toast.error("Something went wrong while deleting post");
            }
         }).finally(() => {
            this.isDeleted = false;
         })
      },
      sortPostsByNumberOfLikesOrDislikes: async function(condition : boolean){
         let url = '';
         if (condition) {
            url = 'likes';
         }else{
            url = 'dislikes';
         }

         await axios.get(BASE_URL + '/sort/' + url)
         .then(response => {
            this.posts = response.data;
            console.log("Sorted", url, response.data);
            
         }).catch(function(ex) {
            if (ex.response.status === 404) {
               toast.error("Whoops not found");
            }else {
               toast.error(ex.statusText);
            }
         })

      },
      openWebsocket: function (): void {

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
                    console.log("Subscribe when connected");
                    customWebsocket.subscribe('/topic/post', (msg) => {
                        console.log("Message body ", JSON.parse(msg.body));
                        this.$state.posts = JSON.parse(msg.body);
                    })
                },
            
                
        });
        
        customWebsocket.activate();

      },
      //stomp
      sendMessage: function (object: FrontPagePost[] | string, path: string): void {
         let msgEvent: string;

         
         if (typeof object === 'string') {
            console.log("String");
            msgEvent = object;
            console.log("msgEvent", msgEvent)
            customWebsocket.publish({
               destination:'/app/post/delete',
               body: "POST_DELETED"
            });
            return;
         }

         console.log("Send object");
         customWebsocket.publish({
            destination : '/app/post' + path,
            body: JSON.stringify(object)
         });
      },
      disconnectFromWs: function (): void {
         console.log("Disconnecting post ws");
         customWebsocket.deactivate();
      },

   },
})