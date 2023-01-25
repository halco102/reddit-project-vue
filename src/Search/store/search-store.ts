import axios from "axios";
import { defineStore } from "pinia";
import { Search, SearchTypes } from "../type";
import { PostDto } from "@/Post/types";
import { UserProfile } from "@/User/types";


const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/search';



export const useSearchStore = defineStore('searchStore', {
    state: (): Search => {
        return {
            posts: [],
            users: []
        }
    },
    getters: {
        getAllPosts: function (state): PostDto[] {
            return state.posts;
        },
        getAllUsers: function (state): UserProfile[] {
            return state.users;
        }
    },
    actions: {

        searchPostsOrUsersByName: async function (name: string, searchType: SearchTypes) {

            await axios.get(BASE_URL, {
                params: {
                    content: name,
                    searchType: searchType
                }
            }).then(response => {

                if (searchType === SearchTypes.Search_Posts)
                    this.$state.posts = response.data;
                else
                    this.$state.users = response.data
            })
        },

    }
})