<template v-if="getAllCommentsByPostId.length != 0">


  <!--Main-->
  <div>

    <!-- Number of comments-->
    <div v-if="post!.allowComments">
      <p>
        Number of comments : {{ getNumberOfComments(getAllCommentsByPostId) }}
      </p>
    </div>

    <!-- Show comments-->
    <div v-if="post?.allowComments">

      <!-- Main textbox for comments-->
      <div class="m-auto">
        <TextBoxVue :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id"/>
      </div>


      <div v-for="com in getAllCommentsByPostId" :key="com.id" :class="com.parentId === null ?
      'sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden   mx-auto my-6'
      : 'sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden  mx-auto my-6  pl-10'">
        <!-- Chat -->
        <div class="grid">
          <div class="flex">

            <!-- Users image-->
            <div>
              <img :src="com.userInfo.imageUrl" class="rounded-full w-10 h-10 mr-3 mb-3">
            </div>

            <!-- Users username and chat text-->
            <div class="grid flex-1 text-start pl-2">
              <!--Username-->
              <div class="font-semibold">
                {{ com.userInfo.username }}
              </div>
              <!--Chat text-->
              <div>
                {{ com.text }}
              </div>
              <!-- Like/dislike and reply button, in some case bin for deleting comments-->
              <div class="flex my-3">

                <!--Like and Dislike-->
                <div class="mr-4 flex">

                  <!--Like button with number of likes-->
                  <div class="mr-4">
                    <button class="pr-2 hover:bg-gray-500 rounded-sm p-1" @click="postLikeOrDislike({
                      commentId: com.id,
                      likeOrDislike: true,
                    })">
                      <BIconHandThumbsUpFill />
                    </button>
                    <span>{{ getNumberOfLikes(com) }}</span>
                  </div>

                  <!--Dislike button with number of dislikes-->
                  <div class=" mr-4">
                    <button class="pr-2 hover:bg-gray-500 rounded-sm p-1" @click="postLikeOrDislike({
                      commentId: com.id,
                      likeOrDislike: false,
                    })">
                      <BIconHandThumbsDownFill />
                    </button>
                    <span>{{ getNumberOfDislikes(com) }}</span>
                  </div>
                </div>

                <button class="hover:bg-gray-500 rounded-sm p-1" @click="toggle(com.id)">
                  <BIconReply />
                </button>

                <!-- Trash icon for owner of the comment-->
                <div class="flex-1 relative" v-if="getCurrentlyLoggedUserProfile.id !== 0">
                  <button @click="deleteCommentById(com.id)">
                    <BIconTrash class="absolute bottom-0 right-0" />
                  </button>
                </div>

              </div>

            </div>

          </div>

          <!--Show reply text area when button reply is clicked-->
          <div v-if="(selectedItem !== 0 && selectedItem === com.id)">
            <hr>
            <TextBoxVue :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id" :parentId="com.id"/>
          </div>

        </div>


        <hr>
      </div>
    </div>

    <!--Comments are not allowed-->
    <div v-else class="mt-6">
      <h3 class="font-bold">Comments are disabled</h3>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useToast } from "vue-toastification";

//components
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconReply,
  BIconTrash,
} from "bootstrap-icons-vue";

//pinia
import { useCommentStore } from "@/Comment/store/store";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/User/store/store";
import { useAuthenticationStore } from '@/User/store/authentication_store'

//types
import { FrontPagePost } from "@/Post/types";
import { CommentDto } from '@/Comment/types';

import TextBoxVue from "./TextBox.vue";

export default defineComponent({
  name: "CommentSection",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconReply,
    BIconTrash,
    TextBoxVue
  },
  props: {
    post: Object as PropType<FrontPagePost>,
  },
  computed: {
    ...mapState(useUserStore, ["userProfile"]),
    ...mapState(useCommentStore, ["getAllCommentsByPostId", 'getIsPostingComment']),
    ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile'])
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    closeWhenOutOfFocus: function (): void {
      console.log("Focus")
      this.expandEmojiClick = false;
    },
    ...mapActions(useCommentStore, [
      "postLikeOrDislike",
      "resetState",
      "patchComments",
      "getNumberOfLikes",
      "getNumberOfDislikes",
      "openWebsocketConnection",
      "deleteCommentById",
      'fetchAllCommentsByPostId',
      'setCommentsFromPost'
    ]),
    getNumberOfComments: function (comments: CommentDto[]): number {
      return comments.length;
    },
    toggle: function (item: number): void {

      if (this.selectedItem === item) {
        this.selectedItem = 0;
        return;
      }

      this.selectedItem = item;
    },
    checkIfUserIsLogged: function (): boolean {
      console.log(this.getCurrentlyLoggedUserProfile);
      if (this.getCurrentlyLoggedUserProfile.id != 0) {
        return true;
      }
      return false;
    },
  }, watch: {
    post: function () {
      console.log("post", this.post!)
      this.setCommentsFromPost(this.post!.commentsDto);
    },
    getIsPostingComment: function (val: boolean) {
      if (val === false) {
        console.log("VALUE", val);
        this.fetchAllCommentsByPostId(this.post!.id);
      }
    },
  },
  data() {
    return {
      open: false as boolean,
      selectedItem: 0 as number,
      currentCommentId: 0 as number,
      isReplyComment: false as boolean,
      expandEmojiClick: false as boolean,
      closeReplyTextArea: false as boolean,
    };
  },
});
</script>

<style scoped>
</style>