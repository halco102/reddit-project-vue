import axios, { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { UserPosts } from './PostStore'

const BASE_URL = 'http://localhost:8080/api/v1/user'

export interface signupRequest{
    username: string,
    email: string,
    password: string,
}

export interface signInRequest{
    email: '',
    password: ''
}

export interface PostedBy{
    id: number;
    username: string;
    imageUrl: string
}

export interface User{
    id: number,
    username: string,
    imageUrl: string,
    email: string,
    createdAt: Date,
    posts: UserPosts[]
}

export interface UserProfile{
    id: number,
    username: string,
    imageUrl: string
}

export interface UserState{
    user : User,
    userProfile: UserProfile
}

export const useUserStore = defineStore('userStore',{
    state: () : UserState => {
        return{
            user: {
                id: 0,
                username: '',
                imageUrl: '',
                email: '',
                createdAt: new Date(),
                posts: []
            },
            userProfile: {
                id: 0,
                username: '',
                imageUrl: ''
            }
        }
    },
    getters:{
        getFullUserInfo() : User{
            return this.user;
        },
        getUserProfile() : UserProfile{
            return this.userProfile;
        }
    },
    actions:{

        async signupUser(signupRequest: signupRequest){
            const json = JSON.stringify(signupRequest);
            console.log("Start signupRequest", json);
            const signupResponse = await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            })
            console.log("Signup user", signupResponse.data)
            this.user = signupResponse.data;
        },

         loginUser: async function(signInRequest : signInRequest) {
            const json = JSON.stringify(signInRequest);
            console.log("Start signin", json);

            const signInResponse = await axios.post(BASE_URL + '/login', json, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });

            console.log("Sign in response", signInResponse.data);
            this.user = signInResponse.data;
        }

    }
})