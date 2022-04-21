<template>
  <div class="single-post-div">
    <NavigationBar/>
    <div class="post-div">
      <h1>{{ post.title }}</h1>
      <p>{{ post.text }}</p>
      <img :src="post.imageUrl" />
    </div>

    <div class="comments">
      <div class="number-of-comments">
        <p>Number of comments : {{ getNumberOfComments(post.commentsDto) }}</p>
      </div>

      <form
        v-on:submit.prevent="
          postCommentThenReturnData(writingComment, this.id, user.id, null)
        "
      >
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label"
            >Comment</label
          >
          <textarea
            v-model="writingComment"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Post comment</button>
      </form>

      <div class="card border-0" v-for="com in post.commentsDto" :key="com.id">
        <div class="commented-by" v-if="com.parentId === null">
          <div class="user-div">
            <img
              :src="com.userInfo.imageUrl"
              style="width: 25px; height: 25px; margin-right: 5px"
            />
            <p>{{ com.userInfo.username }} : {{ com.text }}</p>
          </div>
          <div class="actions-for-comments">
            <a href="#like" class="btn btn-primary"
              ><BIconHandThumbsUpFill
            /></a>
            <a href="#dislike" class="btn btn-primary"
              ><BIconHandThumbsDownFill
            /></a>
            <button
              class="btn btn-primary"
              style="float: left"
              @click="toggle(com.id)"
            >
              <BIconReply />
            </button>
          </div>
          <div class="reply-form" v-if="com.id === selectedItem">
            <form
              v-on:submit.prevent="
                postCommentThenReturnData(writingReplyComment, this.id, user.id, com.id)
              "
            >
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label"
                  >Comment</label
                >
                <textarea
                  v-model="writingReplyComment"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                Post comment
              </button>
            </form>
          </div>
        </div>

        <div class="reply-comment" v-else>
          <div class="commented-by">
            <div class="user-div">
              <img
                :src="com.userInfo.imageUrl"
                style="width: 25px; height: 25px; margin-right: 5px"
              />
              <p>{{ com.userInfo.username }} : {{ com.text }}</p>
            </div>
            <div class="actions-for-comments">
              <a href="#like" class="btn btn-primary"
                ><BIconHandThumbsUpFill
              /></a>
              <a href="#dislike" class="btn btn-primary"
                ><BIconHandThumbsDownFill
              /></a>
              <button class="btn btn-primary" style="float: left">
                <BIconReply />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Kraj comments div-a !-->
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { usePostStore } from "../store/PostStore";
import { useCommentStore, PostComment } from "../store/CommentStore";
import { mapActions, mapState } from "pinia";
import { Comments } from "../store/PostStore";
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconReply,
} from "bootstrap-icons-vue";
import NavigationBar from './NavigationBar.vue'
import { useUserStore } from '../store/UserStore'

export default defineComponent({
  name: "App",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconReply,
    NavigationBar
  },
  created() {
    let toNumber: number = parseInt(this.id!);
    const getById = this.fetchPostById(toNumber);
  },
  props: {
    id: String,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchPostById"]),
    ...mapActions(useCommentStore, ["postCommentAction"]),

    getNumberOfComments: function (comments: Comments[]): number {
      return comments.length;
    },
    getUserInfo() {
      console.log("Clicked");
    },
    postCommentThenReturnData: function (
      text: string,
      idOfPost: string,
      idOfUser: number,
      parentId: null | number
    ) {
      var toNumber: number = parseInt(idOfPost);

      if(!this.checkIfUserIsLogged()) {
          console.log("USer not logged in abort");
          alert("You have to login before you can comment on a post");
          return;
      }

      var temp = this.postCommentAction({
        text: text,
        postId: toNumber,
        userId: idOfUser,
        parentId: parentId,
      });
    },

    toggle: function (item: number) {
      console.log("Temp");
      this.selectedItem = item;
    },
    test: function (): void {
      var temp = this.post!.commentsDto;
      var map = new Map<number, number>();

      for (let i = 0; i < temp.length; i++) {
        map.set(temp[i].id, temp[i].parentId);
      }

      console.log(map.size, map);
    },
    checkIfUserIsLogged: function() : boolean{
      if (this.user.id != 0) {
        console.log("Logged user");
        return true;
      }
      console.log("Not logged");
      return false;
    }
  },
  computed: {
    ...mapState(usePostStore, ["post"]),
    ...mapState(useCommentStore, ["postComment"]),
    ...mapState(useUserStore, ['user']),
    getCurrentPostState() {
      return this.post;
    },
    getAllCommentsFromPost() {
      return this.postComment;
    },
  },
  data() {
    return {
      writingComment: "",
      writingReplyComment: "",
      open: false,
      isHidden: true,
      isActive: false,
      selectedItem: 0,
      currentCommentId: 0,
    };
  },
});
</script>

<style scoped>
img {
  width: 638px;
  height: 677px;
}

.post-div {
  margin: 20px 0 40px 0;
}
</style>