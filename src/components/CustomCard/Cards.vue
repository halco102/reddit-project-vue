<template>
    <!--Glavni dio card-->
    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg">

        <!--Like and dislike -->
        <div v-if="hasLikeAndDislike">
            <LikeDislikeComponent :post="post" />
        </div>

        <div class="sm:max-w-sm xl:max-w-xl lg:max-w-lg">

            <!--Image-->
            <div @click="pushSinglePageRouter(post.id)" v-if="hasImage">
                <slot name=image></slot>
            </div>

            <!--Categories-->
            <div v-if="hasCategories">
                <hr class=" border border-black w-full" />
                <slot name="categories"></slot>
            </div>

            <!--Title and description-->
            <div v-if="hasCardText" @click="pushSinglePageRouter(post.id)" v-bind="$attrs">
                <hr class=" border border-black w-full" />
                <slot name="cardText"></slot>
            </div>

            <!--User profile and other icons if necessary-->
            <div v-if="hasCardIcons">
                <hr class=" border border-black w-full" />
                <slot name="cardIcons"></slot>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';

import { PostDto } from '@/Post/types';
import LikeDislikeComponent from '@/Post/components/LikeDislike/IconAndNumber.vue'


export default defineComponent({
    name: 'CustomCard',
    props: {
        hasLikeAndDislike: {
            type: Boolean,
            required: true
        },
        post: {
            type: Object as () => PostDto,
            required: true
        },
        hasCategories: {
            type: Boolean || undefined,
            required: false
        }
    },
    components: {
        LikeDislikeComponent
    },
    setup() {
        const slots = useSlots();

        return { slots }
    },
    computed: {
        hasCardText: function (): boolean {
            return !!this.slots.cardText;
        },
        hasCardIcons: function (): boolean {
            return !!this.slots.cardIcons;
        },
        hasImage: function (): boolean {
            return !!this.slots.image;
        }
    },
    methods: {
        pushSinglePageRouter: function (postId: number): void {
            this.$router.push({ name: 'SinglePage', params: { id: postId } });
        },
    }
})
</script>