import axios from "axios";
import { defineStore } from "pinia";
import {usePostStore} from '@/Post/store/store';


const BASE_URL = process.env.VUE_APP_BASE_URL + '/api/v1/search';

enum searchTypes {
    Search_Posts = "SEARCH_CONTENT",
    Search_Users = "SEARCH_USER"
}

export const useSearchStore = defineStore('searchStore', {
    getters: {

    },
    actions: {

        searchPostsByName: async function(name : string) {
 
            const postStore = usePostStore();

            await axios.get(BASE_URL, {
                params: {
                    content: name,
                    searchType: searchTypes.Search_Posts
                }
            }).then(response => {
                //update posts
                console.log("Seach results", response.data);
                postStore.$state.posts = response.data;
            })
        }

    }
})