<template>
    <!--
    Find comment by id, so that router can link the post
    -->
    <div class="grid justify-center">

        <!-- Route to post -->
        <router-link v-for="temp in getUserProfile.commentsPosts" :key="temp.id"
            :to="{ name: 'SinglePage', params: { id: temp.postDto.id } }">
            <div>

                <div class="grid border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-[690px] h-[100px]">

                    <div class="flex gap-1">
                        <sm>{{ temp.userDto.username }}</sm>
                        <sm>{{ sumCommentLikeDislike() }}</sm>
                    </div>


                </div>

                <!--Main comment
                <div class="grid border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-[690px] h-[100px]">
                    <p class="font-serif"> {{ temp.comment }} </p>
                </div>

                <!~~Replies~~>
                <div v-if="temp.replies.length !== 0">
                    <div class="grid border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-[690px] h-[100px]"
                        v-for="rep in temp.replies" :key="rep.id">
                        <p class="font-serif">
                            {{ rep.comment }}
                        </p>
                    </div>
                </div>
            -->

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
        sumCommentLikeDislike: function (): number {
            let result = 0;

            this.getUserProfile.likedOrDislikedComments.forEach(element => {
                if (element.likeOrDislike)
                    result++;
                else
                    result--;
            })

            return result;
        }
    },
    computed: {
        ...mapState(usePostStore, ['getPost', 'getAllPosts']),
        ...mapState(useCommentStore, ['getAllCommentsFromUser']),
        ...mapState(useUserStore, ['getUserProfile'])
    },
    data() {
        return {
            allComments: new Map()
        }
    },
    mounted() {
        // add all comments into a list
        if (this.getUserProfile.commentsPosts.length !== 0) {
            this.allComments = new Map<number, CommentDto[]>();
            console.log("Idemo")
            this.getUserProfile.commentsPosts.forEach(item => this.allComments.set(item.postDto.id, item));
        }

        console.log(this.allComments, 'All com');
    }
});
</script>
