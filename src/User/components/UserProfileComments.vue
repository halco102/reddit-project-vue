<template>
    <!--
    Find comment by id, so that router can link the post
    -->
    <div>
        <router-link v-for="temp in user.commentsPosts" :key="temp.postId"
            :to="{ name: 'SinglePage', params: { id: temp.postId } }">
            <div>
                <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg" v-for="com in temp.commentDto" :key="com.id">
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
import { UserProfile } from "../types";


export default defineComponent({
    name: "UserProfileComments",
    props: {
        isCurrentUser: Boolean,
        user: {
            type: Object as () => UserProfile,
            required: true
        },
    },
    methods: {

        ...mapActions(useCommentStore, ['fetchUserComments']),


        findAllPostsThatUserLeftAComment: function (): Map<number, CommentDto[]> | null {
            let map = new Map<number, CommentDto[]>();


            if (this.user === null) {
                console.log("User is null");
                return null;
            }

            this.user.commentsPosts.map((p) => map.set(p.postId, p.commentDto));

            console.log("MAPPA", map);
            return map;
        }
    },
    computed: {
        ...mapState(usePostStore, ['getPost', 'getAllPosts']),
        ...mapState(useCommentStore, ['getAllCommentsFromUser'])
    }
});
</script>
