//pinia
import { defineStore } from "pinia";

//types
import * as CategoryTypes from '@/Post/category-types';

//axios
import axios from "axios";

// Base url on localhost and ws
const BASE_URL = 'http://127.0.0.1:8082/api/v1/category'

//deployed base url
//const BASE_URL = "https://demo-reddit-project.herokuapp.com/api/v1/category"

export const useCategoryStore = defineStore('categoryStore', {

    state: (): CategoryTypes.Category => {
        return {
            category: {
                id: 0,
                name: '',
                iconUrl: ''
            },
            categories: []
        }
    },
    getters: {
        getAllCategories(state): CategoryTypes.SingleCategory[] {
            return state.categories;
        }
    },
    actions: {
        fetchAllCategories: async function () {
            await axios.get(BASE_URL)
                .then(response => {
                    this.$state.categories = response.data;
                })
        }
    }
})