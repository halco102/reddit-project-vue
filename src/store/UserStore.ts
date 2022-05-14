import axios from "axios";
import { defineStore } from "pinia";
import { PostLikeOrDislikeResponse } from "./CommentStore";
import { UserPosts, FrontPagePost } from './PostStore'
import { useToast } from "vue-toastification";

//Base url localhost
const BASE_URL = 'http://localhost:8082/api/v1/user'

// Deployed url
/*
const ngrok = 'http://2434-2a02-810d-4b3f-cfe8-4bc5-7cfc-593-172d.ngrok.io';
const BASE_URL = ngrok +  '/api/v1/user'
*/

const toast = useToast();

export interface signupRequest {
    username: string,
    email: string,
    password: string,
}

export interface signInRequest {
    email: '',
    password: ''
}

export interface PostedBy {
    id: number;
    username: string;
    imageUrl: string
}

export interface User {
    id: number,
    username: string,
    email: string,
    imageUrl: string,
    createdAt: Date,
    posts: UserPosts[],
    likedOrDislikedComments: PostLikeOrDislikeResponse[]
}

export interface UserLoginResponse {
    jwt: string,
    userProfileDto: User
}

export interface UserProfile {
    id: number,
    username: string,
    imageUrl: string,
    emai?: string,
    createdAt: Date,
    posts: UserPosts[],
}





export interface UserState {
    user: User,
    userProfile: UserProfile,
    userLoginResponse: UserLoginResponse,
    postForLikeDislike: FrontPagePost[],
    isSignupLoading: boolean,
    isLoginLoading: boolean,
}


export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        return {
            user: {
                id: 0,
                username: '',
                imageUrl: '',
                email: '',
                createdAt: new Date(),
                posts: [],
                likedOrDislikedComments: []
            },
            userProfile: {
                id: 0,
                username: '',
                imageUrl: '',
                emai: '',
                createdAt: new Date(),
                posts: []
            },
            userLoginResponse: {
                jwt: '',
                userProfileDto: {
                    id: 0,
                    username: '',
                    email: '',
                    imageUrl: '',
                    createdAt: new Date(),
                    posts: [],
                    likedOrDislikedComments: []
                }
            },
            postForLikeDislike: [],
            isSignupLoading: false,
            isLoginLoading: false,
        }
    },
    getters: {
        getFullUserInfo(state): User {
            return state.user;
        },
        getUserProfile(state): UserProfile {
            return state.userProfile;
        },
        getUserLogin(state): UserLoginResponse {
            return state.userLoginResponse;
        },
        getLikesDislikesFromPost(state): FrontPagePost[] {
            return state.postForLikeDislike;
        },
        getIsSignupLoading(state): boolean {
            return state.isSignupLoading;
        },
        getIsLoginLoading(state): boolean {
            return state.isLoginLoading;
        },
    },
    actions: {

        signupUser: async function (signupRequest: signupRequest) {
            const json = JSON.stringify(signupRequest);
            console.log("Start signupRequest", json);
            await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => { this.isSignupLoading = true; })
            }).then(response => {

                console.log("Signup user", response.data);
                toast.success("User signed up");
            }).catch(function (ex) {
                if (ex.response.status === 409) {
                    toast.error('Email already taken');
                } else {
                    toast.error("Error on signup");
                }
            }).finally(() => {
                console.log("Signut loading")
                this.isSignupLoading = false;
            })

        },

        loginUser: async function (signInRequest: signInRequest) {
            const json = JSON.stringify(signInRequest);
            console.log("Start signin", json);

            await axios.post(BASE_URL + '/login', json, {
                headers: {
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => { this.isLoginLoading = true })
            }).then(response => {
                
                this.userLoginResponse = response.data;
                toast.success("Logged in");
            }).catch(function (ex) {
                if (ex.response.status === 404) {
                    toast.error("Wrong email or/and password");
                } else {
                    toast.error(ex.response.data.message);
                }
            }).finally(() => {
                this.isLoginLoading = false;
            })

        },

        stopLoadingAnimation: function (val: boolean): boolean {
            return val;
        },

        getUserByIdOrUsername: async function (id: number | null, username: string | null) {

            if (id !== null) {
                // fetch by id
                const fetchById = await axios.get(BASE_URL + '/', { params: { id: id } });
                console.log("Fetch user profile by id", fetchById);
                if (fetchById.status === 200) {
                    this.userProfile = fetchById.data;
                } else {
                    alert("Error on fetch by id");
                }
            } else {
                //fetch by username
                const fetchByUsername = await axios.get(BASE_URL + '/', { params: { username: username } });
                console.log("Fetch by username");
                if (fetchByUsername.status === 200) {
                    this.userProfile = fetchByUsername.data;
                } else {
                    alert("Error on fetch by username");
                }
            }
        },
        getAllPostsFromUserByUserId: async function (userId: number) {

            await axios.get(BASE_URL + '/' + 'user/' + userId + '/post')
                .then(response => {
                    console.log("Response of get", response.data);
                    this.postForLikeDislike = response.data;
                })
        }

    }
})