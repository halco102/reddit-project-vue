import axios from "axios";
import { defineStore } from "pinia";
import { PostLikeOrDislikeResponse } from "./CommentStore";
import { UserPosts } from './PostStore'

const BASE_URL = 'http://localhost:8080/api/v1/user'

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
    posts: UserPosts[],
}



export interface UserState {
    user: User,
    userProfile: UserProfile,
    userLoginResponse: UserLoginResponse
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
            }
        }
    },
    getters: {
        getFullUserInfo(state): User {
            return state.user;
        },
        getUserProfile(state): UserProfile {
            return state.userProfile;
        },
        getUserLogin(state) : UserLoginResponse {
            return state.userLoginResponse;
        }
    },
    actions: {

        signupUser: async function (signupRequest: signupRequest) {
            const json = JSON.stringify(signupRequest);
            console.log("Start signupRequest", json);
            const signupResponse = await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log("Signup user", signupResponse.data)
            if (signupResponse.status === 200) {
                alert("User succesfully created a account");
            } else {
                throw Error("Signup error");
            }
        },

        loginUser: async function (signInRequest: signInRequest) {
            const json = JSON.stringify(signInRequest);
            console.log("Start signin", json);

            const signInResponse = await axios.post(BASE_URL + '/login', json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Sign in response", signInResponse.data);
            if (signInResponse.status === 200) {
                alert("Logged in");
                this.userLoginResponse = signInResponse.data;
            } else {
                alert("ERROR")
            }
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
        }

    }
})