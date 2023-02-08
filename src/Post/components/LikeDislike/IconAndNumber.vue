<template>

    <div class="flex flex-col gap-1">

        <VButtonIcon class="hover:bg-gray-500" @onClick="postLikeOrDislikeForPost(post!.id,
        true)">
            <template #icon>
                <BIconArrowUp
                    :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserUpvoted(post!.id) : 'text-gray-600'" />
            </template>
        </VButtonIcon>


        <!-- number of likes and dislikes-->
        <span class="text-center" :class="sum === 0 ? 'text-gray-500' : sum > 0 ? 'text-blue-500' : 'text-red-500'">
            {{ sum }}
        </span>

        <VButtonIcon class="hover:bg-gray-500" @onClick="postLikeOrDislikeForPost(post!.id,
        false)">
            <template #icon>
                <BIconArrowDown
                    :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserDownVoted(post!.id) : 'text-gray-600'" />
            </template>
        </VButtonIcon>

    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VButtonIcon from '@/components/VButtonIcon.vue';
import {
    BIconArrowUp,
    BIconArrowDown
} from "bootstrap-icons-vue";
import { useAuthenticationStore } from '@/User/store/authentication_store';
import { mapState, mapActions } from 'pinia';
import { PostDto, LikeOrDislikeRequest } from '@/Post/types';
import { usePostStore } from '@/Post/store/store';

export default defineComponent({
    name: 'IconAndNumber',
    components: {
        VButtonIcon,
        BIconArrowUp,
        BIconArrowDown
    },
    computed: {
        ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile'])
    },
    methods: {
        ...mapActions(usePostStore, ['postLikeOrDislikeForPost']),
        checkIfUserUpvoted: function (postId: number): string {


            let find = this.findLikeOrDislikedPost(postId);

            if (find !== undefined && this.getCurrentlyLoggedUserProfile.id) {
                if (find)
                    return 'text-blue-500';
            }

            return 'text-gray-600, text-center';

        },
        findLikeOrDislikedPost: function (postId: number): boolean | undefined {

            let result = this.getCurrentlyLoggedUserProfile.postLikeOrDislikeDtos.find((find: LikeOrDislikeRequest) => find.postId === postId);

            if (result === undefined) {
                return undefined;
            }

            return result.likeOrDislike;

        },
        checkIfUserDownVoted: function (postId: number): string {


            let find = this.findLikeOrDislikedPost(postId);

            if (find !== undefined && this.getCurrentlyLoggedUserProfile.id !== 0) {
                if (find === false)
                    return 'text-red-500';
            }
            return 'text-gray-600, text-center';

        },
        sumPostLikeOrDislike: function (post: PostDto): void {

            let result = 0;
            if (post.postLikedDislike.length !== 0) {
                post.postLikedDislike.map((m) => {
                    if (m.likeOrDislike)
                        result++;
                    else
                        result--;
                })
            }
            this.sum = result;
        },
    },
    data() {
        return {
            sum: 0 as number
        }
    },
    props: {
        post: Object as () => PostDto
    },
    updated() {
        if (this.post !== undefined)
            this.sumPostLikeOrDislike(this.post);
    },
    mounted() {
        if (this.post !== undefined)
            this.sumPostLikeOrDislike(this.post);
    }
})
</script>