import { defineStore } from "pinia";
import axios from "axios";
import { PostedBy } from "./UserStore";

const BASE_URL = 'http://localhost:8080/api/v1/post'



export interface Comments{
   id: number,
   text: string,
   userInfo: PostedBy,
   parentId: number
}

export interface UserPosts{
   id: number,
   title: string,
   text: string,
   imageUrl: string
}

export interface FrontPagePost{
   id: number;
   title: string;
   text: string,
   imageUrl: string;
   postedBy: PostedBy;
   allowComments: boolean
   commentsDto: Comments[]
}

export interface FrontPageListPosts{
   posts : FrontPagePost[],
   post: FrontPagePost | null
}

export const usePostStore = defineStore('postStore', {
   state: () : FrontPageListPosts => {
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
            commentsDto: [
               {
                  id: 0,
                  text: '',
                  userInfo: {
                     id: 0,
                     username: '',
                     imageUrl: ''
                  },
                  parentId: 0
               }
            ]
         }
      } 
   },
   getters: {
      getAllPosts(state){
         return state.posts
      },
      getPostById(state) : FrontPagePost | null {
         return state.post;
      },
   },
   actions: {
     async fetchAllPostToShow(){
         const fetchDataFromApi = await axios.get(BASE_URL);
         console.log("Fetch data", fetchDataFromApi)
         this.posts = fetchDataFromApi.data;
      
      },
      async fetchPostById(id : number) {
         const fetchDataById = await axios.get(BASE_URL + '/' + id)
         console.log("Single data fetch " , fetchDataById)
         this.post = fetchDataById.data;
      }
   }
})