<template>
    <!--
    Find comment by id, so that router can link the post
    -->
    <div>
        <router-link v-for="temp in user.commentsPosts" :key="temp.postId"
            :to="{ name: 'SinglePage', params: { id: temp.postId } }">
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

<style scoped>
.card-body-shaddow {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 25px 20px -20px;
    margin-bottom: 2vh;
}
</style>