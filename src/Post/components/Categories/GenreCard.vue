<template>
    <!--Categories-->
    <div class="flex flex-wrap max-w-[600px]">
        <div class="px-6 pt-4 pb-2 w-1/3" v-for="category in categories" :key="category.id">
            <span
                class="inline-block bg-gray-200 hover:bg-gray-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }"
                    class="btn btn-ligh " @click.prevent="getPostsByCategoryName(category.name)">#{{
                    category.name
                    }}</router-link>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { SingleCategory } from '@/Post/category-types';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';
import { usePostStore } from '@/Post/store/store';


export default defineComponent({
    name: 'GenreCard',
    props: {
        categories: Object as () => SingleCategory[],
    },
    methods: {
        ...mapActions(usePostStore, ['getPostsByCategoryName'])
    }

})
</script>