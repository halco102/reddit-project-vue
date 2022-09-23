<template>
    <!--Glavni dio card-->
    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg">

        <!--Like and dislike -->
        <div v-if="hasLikeAndDislike">
            <LikeDislikeComponent :post="post" :getCurrentlyLoggedUserProfile="currentlyLoggedUser!" />
        </div>

        <div class="sm:max-w-sm xl:max-w-xl lg:max-w-lg" v-bind="$attrs">

            <!--Image-->
            <div v-bind="$attrs">
                <img  class="xl:max-w-xl lg:max-w-lg sm:sm:max-w-sm mb-6 p-6" :src="post.imageUrl" :alt="post.title">
            </div>

            <!--Categories-->
            <div v-if="hasCategories">
                <hr class=" border border-black w-full" />
                <slot name="categories"></slot>
            </div>

            <!--Title and description-->
            <div v-if="hasCardText">
                <hr class=" border border-black w-full" />
                <div class="grid justify-center">
                    <slot name="cardText"></slot>
                </div>
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

import LikeDislikeComponent from '@/Post/components/LikeDislikeComponent.vue';
import { FrontPagePost } from '@/Post/types';
import { UserProfile } from '@/User/types';

export default defineComponent({
    name: 'CustomCard',
    props: {
        hasLikeAndDislike: {
            type: Boolean,
            required: true
        },
        post: {
            type: Object as () => FrontPagePost,
            required: true
        },
        currentlyLoggedUser: {
            type: Object as () => UserProfile | null,
            required: true
        },
        hasCategories: {
            type: Boolean || undefined,
            required: false
        }
    },
    components: {
        LikeDislikeComponent,
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
        }
    }
})
</script>