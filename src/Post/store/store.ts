//pinia
import { defineStore } from "pinia";
import { useAuthenticationStore } from "@/User/store/authentication_store";

//axios
import axios from "axios";

//types
import * as PostType from "@/Post/types";

//toast
import { useToast } from 'vue-toastification';
import CustomWebSocket from "@/service/CustomWebsocket";
import { LikeDislikePostNotification } from "@/service/WebSocketTypes";



const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/post';
const toast = useToast();

const ws = CustomWebSocket.getInstance();



export const usePostStore = defineStore('postStore', {
   state: (): PostType.PostInterface => {
      return {
         posts: [],
         post: {
            id: 0,
            title: '',
            description: '',
            imageUrl: '',
            allowComment: true,
            postedBy: {
               id: 0,
               email: '',
               username: '',
               imageUrl: ''
            },
            categoryDtos: [],
            postLikedDislike: [],
            numberOfComments: null,
            commentsDtos: null
            //editedAt: null
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
      getPostById(state): PostType.PostDto {
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
      getPost(state): PostType.PostDto {
         return state.post;
      },
   },
   actions: {


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
         axios.get(BASE_URL + '/' + id).then(response => {
            this.post = response.data;
         }).catch(function (ex) {
            if (ex.response.state === 500) {
               toast.error("Something went wrong");
            }
         })

      },

      async savePost(request: PostType.PostRequest, location: File | null) {

         const json = JSON.stringify(request);

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
            //this.sendMessage(this.$state.posts, '');

         }).catch(function (ex) {

            if (ex.response.status === 400) {
               toast.error("Bad request");
            } else if (ex.response.status === 401) {
               toast.error("Unathorized to post");
            } else {
               toast.error("Something went wrong while saving post");
            }
         }).finally(() => {
            this.isLoading = false;
         })
      },


      /*
      This method is used for submiting like or dislike to the backend
      User is get from jwt (only logged users can like posts)
      */
      async postLikeOrDislikeForPost(postId: number, like: boolean) {


         await axios.post(BASE_URL + '/like-dislike/' + postId, {},
            {
               headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                  'Content-Type': 'application/json'
               },
               params: {
                  isLike: like
               }
            }).then(response => {

               const authStore = useAuthenticationStore();

               this.$patch((state) => {
                  this.post = response.data;
                  const temp = state.posts.map((i) => i.id).indexOf(this.post.id);
                  state.posts[temp] = this.post;

                  //get user state from jwt and patch user state
                  authStore.$patch((state) => {

                     const findIndex = state.userProfile.postLikeOrDislikeDtos.findIndex((f) => {
                        return f.postId === postId;
                     });

                     //means its there is no recorded like/dislike in list, than add it
                     if (findIndex === -1) {
                        console.log("Add like/dislike", findIndex)
                        state.userProfile.postLikeOrDislikeDtos.push();
                     }

                     // if its the same delete from array
                     else if (state.userProfile.postLikeOrDislikeDtos[findIndex].likeOrDislike === like) {
                        console.log("Delete")
                        state.userProfile.postLikeOrDislikeDtos.splice(findIndex, 1);
                     } else {
                        console.log("Change")
                        state.userProfile.postLikeOrDislikeDtos[findIndex] = response.data;
                     }
                  })
               })

               //this.post = response.data;
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

      getNumberOfLikes: function (post: PostType.PostDto): number {
         let likes = 0;
         if (post.postLikedDislike.length !== 0) {
            post.postLikedDislike.filter((x) => x.likeOrDislike === true).map(() => likes++);
         }
         return likes;
      },

      getNumberOfDislikes: function (post: PostType.PostDto): number {
         let dislikes = 0;
         if (post.postLikedDislike.length !== 0) {
            post.postLikedDislike.filter((x) => x.likeOrDislike === false).map(() => dislikes++);
         }
         return dislikes;
      },

      deletePostById: async function (id: number) {


         console.log("Delete")

         await axios.delete(BASE_URL + '/' + id, {
            headers: {
               'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
            }
         }).then(() => {

            console.log("Delete post with id", id);

            this.$state.posts.forEach((element, index) => {
               if (element.id === id) {
                  console.log("Element in state", element, 'index', index);
                  this.$state.posts.splice(index, 1);
               }
            })
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

      sumLikesOrDislikesOnPost: function (post: PostType.PostDto): number {

         let result = 0;

         if (post.postLikedDislike.length !== 0) {
            post.postLikedDislike
               .map((l) => {
                  if (l.likeOrDislike) {
                     result++;
                  } else {
                     result--;
                  }
               })
         }
         return result;
      },

      searchPostByName: async function (name: string) {
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
      },



      //websocket

      subscribeToTopic: function (topic: string) {


         console.log(topic, " sub on topic");

         if (ws.getClient().connected === undefined || ws.getClient().connected === false) {
            ws.getClient().onConnect = () => {
               this.__subscribeToWsMethod(topic);
            }

         } else {
            this.__subscribeToWsMethod(topic);
         }
      },

      __subscribeToWsMethod: function (topic: string): void {
         ws.getClient().subscribe("/topic/" + topic, (msg) => {
            const toJson: PostType.PostDto | LikeDislikePostNotification = JSON.parse(msg.body);
            if ('eventName' in toJson) {
               if (toJson.eventName === 'LIKE_OR_DISLIKE_POST') {
                  const post = this.$state.posts.findIndex(post => post.id === toJson.postDto.id);
                  this.$state.posts[post] = toJson.postDto;
               } else {
                  alert("No such event");
               }
            } else {
               if (this.$state.posts[0].id !== toJson.id) {
                  this.$state.posts.unshift(toJson);
               } else {
                  msg.ack();
               }
            }
         })
      }
   },
})