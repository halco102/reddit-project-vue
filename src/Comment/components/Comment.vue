<template>

  <!--Main-->
  <div class="relative">

    <!-- Number of comments-->
    <div v-if="post.allowComment">
      <p>
        Number of comments : {{ post.commentsDtos!.length }}
      </p>
    </div>

    <!-- Show comments-->
    <div v-if="post.allowComment" class="absolute w-full">

      <!-- Main textbox for comments-->
      <div class="m-auto">
        <TextBoxVue :actionType="'Comment'" :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id" />
      </div>

      <div v-for="com in post.commentsDtos" :key="com.id"
        class="sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden  mx-auto my-6">

        <CommentSectionVue :commentObject="com" :postId="post.id" />

        <!--Replies-->
        <div v-if="com.replies.length !== 0">
          <div v-for="rep in com.replies" :key="rep.id"
            class="sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden mx-auto my-6 pl-10">
            <CommentSectionVue :commentObject="rep" :postId="post.id" />
          </div>
        </div>


        <div v-if="(selectedItem !== '' && selectedItem === com.id)">
          <hr class="border-1 border-gray-500">
          <TextBoxVue :actionType="'Reply'" :postId="post!.id" :userId="getCurrentlyLoggedUserProfile.id"
            :parentId="com.id" />
        </div>


        <hr class="border-1 border-gray-500">

      </div>
    </div>
  </div>

  <!--Comments are not allowed-->
  <div v-if="!post?.allowComment" class="mt-6">
    <h3 class="font-bold">Comments are disabled</h3>
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
import { usePostStore } from "@/Post/store/store";

//types
import { PostDto } from "@/Post/types";
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
    post: {
      type: Object as PropType<PostDto>,
      required: true
    },
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
      "deleteCommentById",
      'fetchAllCommentsByPostId',
      'setCommentsFromPost',
      'subscribeToTopic',
      'addAllCommentsToState'
    ]),
    ...mapActions(usePostStore, ['fetchPostById']),
    getNumberOfComments: function (comments: CommentDto[]): number {
      return comments.length;
    },
    toggle: function (item: string): void {

      if (this.selectedItem === item) {
        this.selectedItem = '';
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
      console.log("Watch post in comment section");

      if (this.post.allowComment) {
        //this.subscribeToTopic('comment/' + this.post.id);

        //also subscribe to like or dislike topic
        //this.subscribeToTopic('comment/' + this.post.id + '/like-dislike');
      }

    },
    getIsPostingComment: function (val: boolean) {
      if (val === false) {
        console.log("Fetch new comments from db");
        //this.fetchAllCommentsByPostId(this.post!.id);
      }
    },
  },
  data() {
    return {
      open: false as boolean,
      selectedItem: '' as string,
      currentCommentId: 0 as number,
      isReplyComment: false as boolean,
      expandEmojiClick: false as boolean,
      closeReplyTextArea: false as boolean,
    };
  },
  mounted() {
    console.log("Updated value", this.post.commentsDtos);
    //on mount set the state of comments from postDto
    if (this.post.commentsDtos !== undefined && this.post.commentsDtos !== null) {
      this.addAllCommentsToState(this.post.commentsDtos);
    }
  },
  updated() {
    console.log("Updated value", this.post);
    //this.fetchPostById(this.post.id);
  }
});
</script>

