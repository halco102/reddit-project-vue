//pinia
import { defineStore } from "pinia";

//types
import * as CategoryTypes from '@/Post/category-types';

//axios
import axios from "axios";

// Base url on localhost and ws
const BASE_URL = 'https://' + process.env.VUE_APP_BASE_URL + '/api/v1/category';

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