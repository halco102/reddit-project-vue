//pinia
import { defineStore } from "pinia";

//axios
import axios from "axios";

//types
import * as UserType from "@/User/types";
import { FrontPagePost } from "@/Post/types";

//stomp
import { Client } from "@stomp/stompjs";


//Base url localhost
const BASE_URL = 'https://' + process.env.VUE_APP_BASE_URL + '/api/v1/user';
const ws = 'wss://' + process.env.VUE_APP_BASE_URL + '/ws';

let customWebsocket: Client;


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
                email: '',
                createdAt: new Date(),
                posts: [],
                commentsPosts: [],
                likedOrDislikedComments: [],
                postLikeOrDislikeDtos: []
            },
            postForLikeDislike: [],
        }
    },
    getters: {
        getFullUserInfo(state): UserType.User {
            return state.user;
        },
        getUserProfile(state): UserType.UserProfile {
            return state.userProfile;
        },
        getLikesDislikesFromPost(state): FrontPagePost[] {
            return state.postForLikeDislike;
        },
    },
    actions: {


        getUserByIdOrUsername: async function (id: number | null, username: string | null) {

            console.log("ENV VAR", BASE_URL)

            if (id !== null) {
                // fetch by id
                const fetchById = await axios.get(BASE_URL + '/', { params: { id: id } });

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
        sendUserMessage: function (object: UserType.UserProfile | string): void {

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