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
        <TextBoxVue :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id" />
      </div>


      <div v-for="com in getAllCommentsByPostId" :key="com.id" :class="com.parentId === null ?
      'sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden   mx-auto my-6'
      : 'sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden  mx-auto my-6  pl-10'">

        <CommentSectionVue :commentObject="com" :postId="post.id" />

        <div v-if="(selectedItem !== 0 && selectedItem === com.id)">
          <hr class="border-1 border-gray-500">
          <TextBoxVue :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id" :parentId="com.id" />
        </div>


        <hr class="border-1 border-gray-500">
      </div>
    </div>

    <!--Comments are not allowed-->
    <div v-if="!post?.allowComments" class="mt-6">
      <h3 class="font-bold">Comments are disabled</h3>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useToast } from "vue-toastification";

//components

//pinia
import { useCommentStore } from "@/Comment/store/store";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "@/User/store/store";
import { useAuthenticationStore } from '@/User/store/authentication_store'

//types
import { FrontPagePost } from "@/Post/types";
import { CommentDto } from '@/Comment/types';

import TextBoxVue from "./TextBox.vue";
import CommentSectionVue from "./CommentSection.vue";

export default defineComponent({
  name: "CommentSection",
  components: {
    TextBoxVue,
    CommentSectionVue
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

