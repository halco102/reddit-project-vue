<template>
    <div class="pr-1">
        <!--Like and dislike buttons-->
        <div class="grid items-center">
            <!--Like button-->
            <div class="">
                <button @click.prevent="
                  postLikeOrDislikeForPost({
                    postId: post.id,
                    likeOrDislike: true,
                  })
                " class="btn btn-ligh hover:bg-gray-500">
                    <BIconArrowUp
                        :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserUpvoted(post.id) : 'text-gray-600'" />
                </button>
            </div>

            <!--Number of likes or dislikes-->
            <div>
                <span
                    :class="sum === 0 ? 'grid justify-center' : sum > 0 ? 'grid justify-center text-blue-500' : 'grid justify-center text-red-500'">{{sum}}</span>
            </div>

            <!--Dislike button-->
            <div>
                <button @click.prevent="
                  postLikeOrDislikeForPost({
                    postId: post.id,
                    likeOrDislike: false,
                  })
                " class="btn btn-light hover:bg-gray-500">
                    <BIconArrowDown
                        :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserDownVoted(post.id) : 'text-gray-600'" />

                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { usePostStore } from '../store/store';
import { FrontPagePost, LikeOrDislikeRequest } from '../types';
import { UserProfile } from '@/User/types';

import {
    BIconArrowUp,
    BIconArrowDown
} from "bootstrap-icons-vue";

export default defineComponent({
    name: 'LikeDislikeSideBar',
    components: {
        BIconArrowUp,
        BIconArrowDown,
    },
    methods: {
        ...mapActions(usePostStore, ['postLikeOrDislikeForPost']),


        sumPostLikeOrDislike: function (post: FrontPagePost): void {
            let result = 0;
            if (post.postLikeOrDislikeDtos.length !== 0) {
                post.postLikeOrDislikeDtos.map((m) => {
                    if (m.likeOrDislike)
                        result++;
                    else
                        result--;
                })
            }

            this.sum = result;
        },
        findLikeOrDislikedPost: function (postId: number): boolean | undefined {

            let result = this.getCurrentlyLoggedUserProfile.postLikeOrDislikeDtos.find((find: LikeOrDislikeRequest) => find.postId === postId);

            if (result === undefined) {
                return undefined;
            }

            return result.likeOrDislike;

        },
        checkIfUserUpvoted: function (postId: number): string {

            let find = this.findLikeOrDislikedPost(postId);

            if (find !== undefined && this.getCurrentlyLoggedUserProfile.id) {
                if (find)
                    return 'text-blue-500';
            }

            return 'text-gray-600, text-center';

        },
        checkIfUserDownVoted: function (postId: number): string {
            let find = this.findLikeOrDislikedPost(postId);

            if (find !== undefined && this.getCurrentlyLoggedUserProfile.id !== 0) {
                if (find === false)
                    return 'text-red-500';
            }
            return 'text-gray-600, text-center';

        },
    },
    props: {
        post: {
            type: Object as () => FrontPagePost,
            required: true
        },
        getCurrentlyLoggedUserProfile: {
            type: Object as () => UserProfile,
            required: true
        }
    },
    data() {
        return {
            sum: 0
        }
    },
    updated() {
        this.sumPostLikeOrDislike(this.post);
    },
    mounted() {
        this.sumPostLikeOrDislike(this.post);
    }
})

</script>