//pinia
import { defineStore } from "pinia";

//axios
import axios from "axios";

//types
import * as UserType from "@/User/types";
import { FrontPagePost, UserPosts } from "@/Post/types";

import CustomWebSocket from "@/service/CustomWebsocket";

//Base url localhost
const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/user';
const ws = process.env.VUE_APP_WEBSOCKET;
const wsConnection = CustomWebSocket.getInstance();




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
                posts: [] as UserPosts[],
                commentsPosts: [],
                likedOrDislikedComments: [],
                postLikeOrDislikeDtos: [],
                followersDtos: [] as UserType.Follow[],
                followingDtos: [] as UserType.Follow[]
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
        getUserFollowers(state): UserType.Follow[] {
            return state.userProfile.followersDtos;
        },
        getUserFollowing(state): UserType.Follow[] {
            return state.userProfile.followingDtos;
        }
    },
    actions: {


        getUserByIdOrUsername: async function (id: number | null, username: string | null) {

            if (id !== null) {
                // fetch by id
                await axios.get(BASE_URL + '/', { params: { id: id } }).then((res) => {
                    this.userProfile = res.data;
                }).catch(function (ex) {
                    if (ex.status != 200) {
                        alert(ex.statusText);
                    }
                });

            } else {
                //fetch by username
                const fetchByUsername = await axios.get(BASE_URL + '/', { params: { username: username } });
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
        subscribeToTopic: function (topic: string): void {
            wsConnection.getClient().subscribe('/topic/' + topic, (msg) => {
                console.log("Message from user topic", msg.body);
            })
        }

    }
})