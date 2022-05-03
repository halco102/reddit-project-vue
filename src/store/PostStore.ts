import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy, useUserStore as user } from "./UserStore";
import { CommentDto } from './CommentStore'
import { useToast } from 'vue-toastification';




const BASE_URL = 'http://localhost:8082/api/v1/post'
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const toast = useToast();

export interface UserPosts {
   id: number,
   title: string,
   text: string,
   imageUrl: string
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
   isLoading: boolean
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
         isLoading: false
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
      getIsLoading(state) : boolean {
         return state.isLoading;
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
            onUploadProgress: (() => {this.isLoading = true})
         }).then(response => {
            this.request = response.data;
            
         }).catch(function (ex) {
            console.log("ex", ex.response);
            if (ex.response.status === 400) {
               toast.error("Bad request");
            } else if (ex.response.status === 401) {
               toast.error("Unathorized to post");
            } else {
               toast.error("Something went wrong while saving post");
            }
         }).finally(() => {
            toast.success("Successfuly posted");
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
               console.log(state);
            })

            this.$subscribe((mut, state) => {
               console.log("mut", mut);
            })

         }).catch(function (ex) {
            if (ex.response.status === 400) {
               toast.error("Bad request");
            } else if (ex.response.status === 401) {
               toast.error("Unathorized");
            } else {
               toast.error("Something went wrong while saving post");
            }
         })
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

      testUploadImage: async function (image: FormData) {


         await axios.post('http://localhost:8082/api/v1/cloudinary/', image, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         })

      }

   }
})