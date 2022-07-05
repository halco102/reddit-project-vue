<template>
    <!--
    Find comment by id, so that router can link the post
-->
    <router-link v-for="comment in getAllCommentsFromUser" :key="comment.id" :to="{ name: 'SinglePage', params: { id: getPost.id } }" v-show="isClicked" >
        <div class="content">
            <div class="card" style="width: 35rem">
                <div class="card-body">
                    <p class="card-text" style="color: black">
                        {{ comment.text }}
                    </p>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script lang="ts">
import { CommentDto } from "@/Comment/types";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { usePostStore } from "@/Post/store/store";
import { useCommentStore } from "@/Comment/store/store";


export default defineComponent({
    name: "UserProfileComments",
    props: {
        isCurrentUser: Boolean,
        userId: Number,
        isClicked : Boolean
    },
    created() {
        console.log("Created userprofilecomments", this.userId);
        this.fetchUserComments(this.userId!)
    },
    methods: {

        ...mapActions(usePostStore, ['findPostByCommentId']),
        ...mapActions(useCommentStore, ['fetchUserComments']),

        findPostByCommentId: function (commentId: number): void {
            console.log("find post by comment Id");
            this.findPostByCommentId(commentId);
        }
    },
    computed : {
        ...mapState(usePostStore, ['getPost']),
        ...mapState(useCommentStore, ['getAllCommentsFromUser'])
    }
});
</script>