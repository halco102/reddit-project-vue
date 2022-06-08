//pinia
import { defineStore } from "pinia";

//axios
import axios from "axios";

//types
import * as UserType from "@/User/types";
import { FrontPagePost } from "@/Post/types";

//toast
import { useToast } from "vue-toastification";

//stomp
import { Client } from "@stomp/stompjs";


//Base url localhost
const BASE_URL = 'http://127.0.0.1:8082/api/v1/user'
const ws = 'ws://127.0.0.1:8082/ws'

// Deployed url
//const BASE_URL = 'https://demo-reddit-project.herokuapp.com' + '/api/v1/user'
//const ws = 'wss://demo-reddit-project.herokuapp.com/ws';

let customWebsocket: Client;

const toast = useToast();



export const useUserStore = defineStore('userStore', {
    state: (): UserType.UserState => {
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
            successfullSignup: false,
            succesfullLogin: false
        }
    },
    getters: {
        getFullUserInfo(state): UserType.User {
            return state.user;
        },
        getUserProfile(state): UserType.UserProfile {
            return state.userProfile;
        },
        getUserLogin(state): UserType.UserLoginResponse {
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
        },
        getSuccessfullSignup(state) : boolean {
            return state.successfullSignup;
        },
        getSuccessfullLogin(state) : boolean {
            return state.succesfullLogin;
        }
    },
    actions: {

        signupUser: async function (signupRequest: UserType.SignupRequest) {
            const json = JSON.stringify(signupRequest);
            console.log("Start signupRequest", json);
            await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => { this.isSignupLoading = true; })
            }).then(response => {

                console.log("Signup user", response.data);
                if (response.data != null) {
                    console.log("Succ signup", response.data);
                    this.successfullSignup = true;
                }
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

        loginUser: async function (signInRequest: UserType.SignInRequest) {
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
                this.succesfullLogin = true;


                //save to localstorage
                localStorage.setItem('userJwt', response.data.jwt);
                

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
                        customWebsocket.subscribe('/topic/user', (msg) => {
                            console.log("Message body ", JSON.parse(msg.body));
                            this.$state.userProfile = JSON.parse(msg.body);
                        })
                    },
                
                    
            });
            
            customWebsocket.activate();
        },
        //stomp
        sendUserMessage: function (object: UserType.UserProfile | string, path: string): void {
            let msgEvent: string;

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