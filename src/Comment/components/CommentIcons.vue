<template>

    <!-- 4 basic icons, like dislike, reply, thrash icon-->
    <!-- Like/dislike and reply button, in some case bin for deleting comments-->
    <div class="flex my-3">

        <!--Like and Dislike-->
        <div class="mr-4 flex">

            <!--Like button with number of likes-->
            <div class="mr-4">
                <VButtonIcon :disabled=false :label="getNumberOfLikes(comment)" @onClick="postLikeOrDislike({
                  commentId: comment.id,
                  likeOrDislike: true,
                })">
                    <template #icon>
                        <BIconHandThumbsUp />
                    </template>
                </VButtonIcon>
            </div>

            <!--Dislike button with number of dislikes-->
            <div class=" mr-4">
                <VButtonIcon :disabled=false :label="getNumberOfDislikes(comment)" @onClick="postLikeOrDislike({
                  commentId: comment.id,
                  likeOrDislike: false,
                })">
                    <template #icon>
                        <BIconHandThumbsDown />
                    </template>
                </VButtonIcon>
            </div>
        </div>

        <VButtonIcon :class="activeElement !== 0 ? 'bg-blue-300' : ''" :disabled="false"
            @onClick="activateToggle(comment.id)">
            <template #icon>
                <BIconReply />
            </template>
        </VButtonIcon>

        <!-- Trash icon for owner of the comment-->
        <div class="flex-1 relative" v-if="getCurrentlyLoggedUserProfile.id !== 0">
            <VButtonIcon class="absolute bottom-0 right-0 hover:bg-gray-500" :disabled="false"
                @click="deleteCommentById(comment.id)">
                <template #icon>
                    <BIconTrash />
                </template>
            </VButtonIcon>

        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useCommentStore } from "@/Comment/store/store";
import { mapActions, mapState } from "pinia";
import { useAuthenticationStore } from '@/User/store/authentication_store'
import VButtonIcon from '@/components/VButtonIcon.vue'

//components
import {
    BIconHandThumbsUp,
    BIconHandThumbsDown,
    BIconReply,
    BIconTrash,

} from "bootstrap-icons-vue";
import { CommentDto } from '../types';

export default defineComponent({
    name: 'CommentIcons',
    components: {
        BIconHandThumbsUp,
        BIconHandThumbsDown,
        BIconReply,
        BIconTrash,
        VButtonIcon

    },
    computed: {
        ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile'])
    },
    props: {
        comment: {
            type: Object as () => CommentDto,
            required: true
        },
    },
    methods: {
        ...mapActions(useCommentStore, [
            "postLikeOrDislike",
            "getNumberOfLikes",
            "getNumberOfDislikes",
        ]),
        activateToggle: function (commentId: number): void {
            if (this.activeElement !== 0) {
                this.activeElement = 0;
            } else {
                this.activeElement = commentId;
            }
            this.$emit('toggle', commentId);
        }
    },
    data() {
        return {
            activeElement: 0 as number
        }
    }

})
</script>