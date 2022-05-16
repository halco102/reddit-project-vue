import axios from "axios";
import { defineStore } from "pinia";
import { PostLikeOrDislikeResponse } from "./CommentStore";
import { UserPosts, FrontPagePost } from './PostStore'
import { useToast } from "vue-toastification";
//import * as Stomp from 'webstomp-client';
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";


//Base url localhost
//const BASE_URL = 'http://localhost:8082/api/v1/user'
//const customWebsocket = Stomp.over(new WebSocket('ws://127.0.0.1:80/ws'));

// Deployed url

const BASE_URL = 'http://172.18.0.4:8082' + '/api/v1/user'

//const customWebsocket = Stomp.over(new WebSocket('ws://9e12-2a02-810d-4b3f-cfe8-15a7-c810-4e3a-50d2.ngrok.io/ws'));
let customWebsocket: Client;




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
        getUserId(state): number {
            return state.userLoginResponse.userProfileDto.id;
        }
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

            await axios.get(BASE_URL + '/' + userId + '/posts')
                .then(response => {
                    console.log("Response of get", response.data);
                    this.postForLikeDislike = response.data;

                })
        },
        openUserWebsocket: function (): void {
            
            customWebsocket = new Client({
                brokerURL: 'ws://172.18.0.4/ws',
                    connectHeaders: {},
                    debug: function (str) {
                        console.log(str)
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    onConnect: () => {
                        console.log("Subscribe when connected");
                        customWebsocket.subscribe('/topic/user', (msg) => {
                            console.log("Message body ", JSON.parse(msg.body));
                            this.$state.userProfile = JSON.parse(msg.body);
                        })
                    },
                
                    
            });
            
            customWebsocket.activate();
            /*
            if (!customWebsocket.connected) {
                customWebsocket.connect({}, () => {
                    console.log("On connect subscribe to User endpoint");
                    customWebsocket.subscribe('/topic/user', (msg) => {
                        console.log("Message body ", JSON.parse(msg.body));
                        this.$state.userProfile = JSON.parse(msg.body);
                    })
                })
            }*/

        },
        //stomp
        sendUserMessage: function (object: UserProfile | string, path: string): void {
            let msgEvent: string;

            if (typeof object === 'string') {
                console.log("String");
                msgEvent = object;
                //customWebsocket.send('/app/user/update' + path, [], msgEvent);
                return;
            }

            console.log("Send object");
            customWebsocket.publish({
                destination: '/app/user/update',
                body: JSON.stringify(object)
            });
        },
        disconnectFromWs: function (): void {
            console.log("Disconnecting post ws");
            //customWebsocket.disconnect(() => { console.log("Disconnected") });
        },

    }
})