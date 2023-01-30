//pinia
import { defineStore } from "pinia";

//axios
import axios from "axios";

//toast
import { useToast } from "vue-toastification";

//types
import * as UserType from "@/User/types";
import * as authenticationTypes from "../authenticationTypes";
import CustomWebSocket from "@/service/CustomWebsocket";
const ws = CustomWebSocket.getInstance();



const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/user';

const toast = useToast();

export const useAuthenticationStore = defineStore('authenticationStore', {

    state: (): authenticationTypes.Authentication => {
        return {
            userLoginResponse: {
                jwt: ''
            },
            userProfile: { // this is for the currently logged user
                id: 0,
                username: '',
                imageUrl: '',
                email: '',
                createdAt: new Date(),
                posts: [],
                commentsPosts: [],
                likedOrDislikedComments: [],
                postLikeOrDislikeDtos: [],
                following: [] as UserType.Follow[],
                followers: [] as UserType.Follow[]
            },
            isSignupLoading: false,
            isLoginLoading: false,
            successfullSignup: false,
            succesfullLogin: false,
            isJwtValid: false,
            signutUser: false,
            notifications: [],
            isNewNotification: false
        }
    },
    getters: {
        getIsSignupLoading(state): boolean {
            return state.isSignupLoading;
        },
        getIsLoginLoading(state): boolean {
            return state.isLoginLoading;
        },
        getSuccessfullSignup(state): boolean {
            return state.successfullSignup;
        },
        getSuccessfullLogin(state): boolean {
            return state.succesfullLogin;
        },
        getCurrentlyLoggedUserProfile(state): UserType.UserProfile {
            return state.userProfile;
        },
        getIsJwtValid(state): boolean {
            return state.isJwtValid;
        },
        getAllNotifications(state): UserType.Notification[] {
            return state.notifications;
        },
        getIsNewNotification(state): boolean {
            return state.isNewNotification;
        }

    },
    actions: {

        loginUser: async function (signInRequest: UserType.SignInRequest) {
            const json = JSON.stringify(signInRequest);

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
                sessionStorage.setItem('jwt', response.data.jwt);
                this.succesfullLogin = true;

                //after user is logged in fetch his profile 
                this.fetchCurrentlyLoggedUserProfile();

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

        signupUser: async function (signupRequest: UserType.SignupRequest) {
            const json = JSON.stringify(signupRequest);

            await axios.post(BASE_URL, json, {
                headers: {
                    'Content-Type': 'application/json'
                },
                onUploadProgress: (() => { this.isSignupLoading = true; })
            }).then(response => {

                if (response.data != null) {
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
                this.isSignupLoading = false;
            })

        },


        fetchCurrentlyLoggedUserProfile: async function () {
            await axios.get(BASE_URL + '/profile', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }).then(response => {
                this.$state.userProfile = response.data;
            });
        },

        logout: function (): void {
            sessionStorage.clear();
        },

        /*
            This method is used for checking the validation of jwt
            This method will return the state isJwtValid as True or False
            If its false then the user will be logged out and the sessionStorage will be cleared
            If its true then it will fetch the data of currently logged user with the stored jwt
        */
        checkIfJwtIsValid: async function () {


            const storageJwt: string | null = sessionStorage.getItem('jwt');


            if (storageJwt === null) {
                this.isUserLoggedIn(this.isJwtValid);
            } else {

                //if there is jwt in storage, check with bckd if its valid
                await axios.get(BASE_URL + '/jwt/valid', {
                    params: {
                        jwt: storageJwt
                    }
                }).then(respones => {
                    this.isJwtValid = respones.data;
                    this.isUserLoggedIn(this.isJwtValid);
                })

            }

        },

        /*
            This method is used for fetching user profile if the jwt is valid 
            else removes the jwt from storage
        */
        isUserLoggedIn: function (isValid: boolean): void {


            if (isValid) {
                this.fetchCurrentlyLoggedUserProfile();
            } else {
                this.logout();
            }

        },

        subscribeToTopic: function () {

            ws.getClient().subscribe('/users/' + this.$state.userProfile.username + '/queue/notification', (msg) => {
                console.log("Get notification", JSON.parse(msg.body));
                //this.notifications.unshift(JSON.parse(msg.body));
                this.notifications.unshift(JSON.parse(msg.body));
                this.isNewNotification = true;
            })

        },

        checkedNewNotification: function (): void {
            this.isNewNotification = false;
        },

        fetchAllNotifications: async function () {
            await axios.get(process.env.VUE_APP_BASE_URL + '/api/v1/notification',
                {
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }
            ).then(response => {
                console.log("Fetch notification", response.data);
                this.$state.notifications = response.data;
            })
        },

        followUser: async function (userId: number) {
            await axios.post(BASE_URL + '/follow/' + userId, '', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                }
            }).then(response => {
                this.userProfile = response.data;
            })
        },
        unfollowUser: async function name(userId: number) {
            await axios.post(BASE_URL + '/unfollow/' + userId, '', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                }
            }).then(reponse => {
                this.userProfile = reponse.data;
            })
        }

    },


})

