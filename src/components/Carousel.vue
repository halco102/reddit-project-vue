<template>
    <!--Carousel-->
    <Carousel :items-to-show="2.5" :wrap-around="true" v-model="count">
        <Slide v-for="category in categories" :key="category.id">
            <div class="carousel__item">
                <div v-if="category.id === count + 1">
                    <div class="grid justify-center border-none rounded-sm hover:bg-gray-500 mt-2">
                        <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }">
                            <span class="mb-2">{{category.name}}</span>
                            <img :src="category.iconUrl" class="w-14 h-14 rounded-lg" />
                        </router-link>
                    </div>
                    <div class="grid justify-center my-2 py-2">
                        <span class="block w-3 h-3 bg-orange-400 rounded-full"></span>
                    </div>
                </div>
                <div v-else>
                    <div class="grid justify-center">
                        <span class="mb-2">{{category.name}}</span>
                        <img :src="category.iconUrl" class="w-14 h-14 rounded-lg" />
                    </div>
                </div>
            </div>
        </Slide>

        <template #addons>
            <Navigation />
        </template>

    </Carousel>

</template>

<script lang="ts">
import { SingleCategory } from '@/Post/category-types';
import { defineComponent } from 'vue';

import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css';


export default defineComponent({
    name: 'CarouselVue',
    components: {
        Carousel,
        Slide,
        Navigation
    },
    props: {
        categories: {
            type: Object as () => SingleCategory[],
            required: true
        }
    },
    data() {
        return {
            count: 0 as number
        }
    },
})

</script>
