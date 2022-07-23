//pinia
import { defineStore } from "pinia";
import { useAuthenticationStore } from "@/User/store/authentication_store";

//axios
import axios from "axios";

//types
import * as PostType from "@/Post/types";

//toast
import { useToast } from 'vue-toastification';

//stomp
import { Client } from "@stomp/stompjs";

const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/post';
const ws = process.env.VUE_APP_WEBSOCKET;


let customWebsocket: Client;
const toast = useToast();


export const usePostStore = defineStore('postStore', {
   state: (): PostType.PostInterface => {
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
            postLikeOrDislikeDtos: [],
            categories: []
         },
         request: {
            title: '',
            text: '',
            imageUrl: '',
            allowComments: true,
            categories: []
         },
         isLoading: false,
         isDeleted: false,
         isSameLikeOrDislikeButton: false,
         updatePost: {
            title: '',
            text: '',
            allowComments: false,
            categories: []
         }
      }
   },
   getters: {
      getAllPosts(state) {
         return state.posts
      },
      getPostById(state): PostType.FrontPagePost | null {
         return state.post;
      },
      getPostRequest(state): PostType.PostRequest {
         return state.request;
      },
      getIsLoading(state): boolean {
         return state.isLoading;
      },
      getIsDeleted(state): boolean {
         return state.isDeleted;
      },
      getPost(state): PostType.FrontPagePost {
         return state.post;
      },
   },
   actions: {


      async fetchAllPostToShow() {

         console.log("Check URL", BASE_URL);
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
            
            this.post = response.data;
         }).catch(function (ex) {
            if (ex.response.state === 500) {
               toast.error("Something went wrong");
            }
         })

      },

      async savePost(request: PostType.PostRequest, location: File | null) {

         const json = JSON.stringify(request);

         console.log("Json", json);
         const temp = new FormData();
         if (location != null) {
            temp.append('file', location);
         }
         temp.append('requestDto', json);

         await axios.post(BASE_URL + '/', temp, {
            headers: {
               'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
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
         }).finally(() => {
            this.isLoading = false;

         })
      },


      /*
      This method is used for submiting like or dislike to the backend
      User is get from jwt (only logged users can like posts)
      */
      async postLikeOrDislikeForPost(request: PostType.LikeOrDislikeRequest) {

         const json = JSON.stringify(request);

         await axios.post(BASE_URL + '/like-dislike', json, {
            headers: {
               'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
               'Content-Type': 'application/json'
            }
         }).then(response => {

            const authStore = useAuthenticationStore();

            this.$patch((state) => {
               this.post = response.data;
               const temp = state.posts.map((i) => i.id).indexOf(this.post.id);
               state.posts[temp] = this.post;
            })


            //get user state from jwt and patch user state
            authStore.$patch((state) => {

               const findIndex = state.userProfile.postLikeOrDislikeDtos.findIndex((f) => {
                  return f.postId === request.postId;
               });


               //means its there is no recorded like/dislike in list, than add it
               if (findIndex === -1) {
                  state.userProfile.postLikeOrDislikeDtos.push(request);
               }

               // if its the same delete from array
               else if (state.userProfile.postLikeOrDislikeDtos[findIndex].likeOrDislike === request.likeOrDislike) {
                  state.userProfile.postLikeOrDislikeDtos.splice(findIndex, 1);
               } else {
                  state.userProfile.postLikeOrDislikeDtos[findIndex] = request;
               }



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

      getNumberOfLikes: function (post: PostType.FrontPagePost): number {
         let likes = 0;
         if (post.postLikeOrDislikeDtos.length !== 0) {
            post.postLikeOrDislikeDtos.filter((x) => x.likeOrDislike === true).map(() => likes++);
         }
         return likes;
      },

      getNumberOfDislikes: function (post: PostType.FrontPagePost): number {
         let dislikes = 0;
         if (post.postLikeOrDislikeDtos.length !== 0) {
            post.postLikeOrDislikeDtos.filter((x) => x.likeOrDislike === false).map(() => dislikes++);
         }
         return dislikes;
      },

      deletePostById: async function (id: number) {



         await axios.delete(BASE_URL + '/' + id, {
            headers: {
               'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
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
      sortPostsByNumberOfLikesOrDislikes: async function (condition: boolean) {
         let url = '';
         if (condition) {
            url = 'likes';
         } else {
            url = 'dislikes';
         }

         await axios.get(BASE_URL + '/sort/' + url)
            .then(response => {
               this.posts = response.data;

            }).catch(function (ex) {
               if (ex.response.status === 404) {
                  toast.error("Whoops not found");
               } else {
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
      sendMessage: function (object: PostType.FrontPagePost[] | string, path: string): void {
         let msgEvent: string;


         if (typeof object === 'string') {
            msgEvent = object;
            console.log("msgEvent", msgEvent)
            customWebsocket.publish({
               destination: '/app/post/delete',
               body: "POST_DELETED"
            });
            return;
         }

         customWebsocket.publish({
            destination: '/app/post' + path,
            body: JSON.stringify(object)
         });
      },
      disconnectFromWs: function (): void {
         console.log("Disconnecting post ws");
         customWebsocket.deactivate();
      },

      sumLikesOrDislikesOnPost: function (post: PostType.FrontPagePost): number{


         let result = 0;

         post.postLikeOrDislikeDtos
            .map((l) => {

               if (l.likeOrDislike) {
                  result++;
               } else {
                  result--;
               }
            })

         return result;
      },

      searchPostByName: async function (name: string) {
         console.log("Search", name);
         await axios.get(BASE_URL + "/search", {
            params: {
               name: name
            }
         })
            .then(response => {
               this.posts = response.data;
            }).catch(function (ex) {
               if (ex.response.status === 404) {
                  toast.error("Whoops noting came up");
               } else if (ex.response.status === 400) {
                  toast.error("Bad request");
               } else {
                  toast.error("Error happened :(");
               }
            })
      },

      getPostsByCategoryName: async function (category: string) {
         await axios.get(BASE_URL + "/category/" + category)
            .then(response => {
               this.$state.posts = response.data;
            }).catch(function (ex) {
               toast.error("Error happened :(")
            })
      },

      updatePostById: async function (postId: number, update: PostType.UpdatePost) {

         const json = JSON.stringify(update);

         await axios.put(BASE_URL + '/update/' + postId, json, {
            headers: {
               'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
               'Content-Type': 'application/json'
            }
         }).then(response => {
            console.log("Response on update", response.data);
         })
      }

   },
})