<template>
    <!--
    Find comment by id, so that router can link the post
    -->
    <div class="grid justify-center">
        <router-link v-for="temp in getUserProfile.commentsPosts" :key="temp.postId"
            :to="{ name: 'SinglePage', params: { id: temp.postId } }">
            <div>
                <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg"
                    v-for="com in temp.commentDto" :key="com.id">
                    <div class="min-w-full">
                        <p class="font-serif">
                            {{ com.text }}
                        </p>
                    </div>
                </div>
            </div>
        </router-link>
    </div>

</template>

<script lang="ts">
import { CommentDto } from "@/Comment/types";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { usePostStore } from "@/Post/store/store";
import { useCommentStore } from "@/Comment/store/store";
import { useUserStore } from "../store/store";

export default defineComponent({
    name: "UserProfileComments",
    methods: {

        ...mapActions(useCommentStore, ['fetchUserComments']),


        findAllPostsThatUserLeftAComment: function (): Map<number, CommentDto[]> | null {
            let map = new Map<number, CommentDto[]>();


            if (this.getUserProfile === null) {
                console.log("User is null");
                return null;
            }

            this.getUserProfile.commentsPosts.map((p) => map.set(p.postId, p.commentDto));

            return map;
        }
    },
    computed: {
        ...mapState(usePostStore, ['getPost', 'getAllPosts']),
        ...mapState(useCommentStore, ['getAllCommentsFromUser']),
        ...mapState(useUserStore, ['getUserProfile'])
    }
});
</script>
