<template>
    <!--
    Find comment by id, so that router can link the post
    -->
    <div>
        <router-link v-for="temp in user.commentsPosts" :key="temp.postId"
            :to="{ name: 'SinglePage', params: { id: temp.postId } }" v-show="isClicked">

            <div>
                <div class="content card-body-shaddow" v-for="com in temp.commentDto" :key="com.id">
                    <div class="card" style="width: 35rem">
                        <div class="card-body">
                            <p class="card-text" style="color: black">
                                {{ com.text }}
                            </p>
                        </div>
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
import { FrontPagePost } from "@/Post/types";


export default defineComponent({
    name: "UserProfileComments",
    props: {
        isCurrentUser: Boolean,
        isClicked: Boolean,
        user: {
            type: Object as () => UserProfile,
            required: true
        },
    },
    methods: {

        ...mapActions(usePostStore, ['findPostByCommentId']),
        ...mapActions(useCommentStore, ['fetchUserComments']),

        findPostByCommentId: function (commentId: number): void {
            console.log("find post by comment Id");
            this.findPostByCommentId(commentId);
        },

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

<style scoped>
.card-body-shaddow {
    box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
    margin-bottom: 1vh;
}
</style>