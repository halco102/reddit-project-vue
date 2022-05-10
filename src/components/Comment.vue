<template>
  <div class="main-comment-div">
    <div class="comments" v-if="post.allowComments === true">
      <div class="number-of-comments">
        <p style="color: white; margin-top: 1rem">
          Number of comments : {{ getNumberOfComments(dataComments) }}
        </p>
      </div>

      <form
        v-on:submit.prevent="
          postCommentThenReturnData(
            writingComment,
            post.id,
            getUserLogin.userProfileDto.id,
            null
          )
        "
        class="form-style"
      >
        <div class="mb-3">
          <label
            style="color: white"
            for="exampleFormControlTextarea1"
            class="form-label"
            >Comment</label
          >
          <textarea
            v-model="writingComment"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-primary-comment-form">
          Post comment
        </button>
      </form>

      <!-- Comments !-->
      <div
        v-for="com in sortCommentsByParentId(dataComments)"
        :key="com.id"
        class="card border-0"
        :class="
          com.parentId === null ? 'card-comment-div' : 'reply-comment-card'
        "
      >
        <div class="commented-by" v-if="com.parentId === null">
          <div class="user-div">
            <img
              :src="com.userInfo.imageUrl"
              style="width: 25px; height: 25px; margin-right: 5px"
            />
            <p>{{ com.userInfo.username }} : {{ com.text }}</p>
          </div>
          <div class="actions-for-comments">
            <button
              type="submit"
              class="btn btn-primary bicon-reply-button"
              @click="
                postLikeOrDislike({
                  commentId: com.id,
                  likeOrDislike: true,
                })
              "
            >
              <BIconHandThumbsUpFill />
            </button>
            <span class="center-span">{{getNumberOfLikes(com)}}</span>
            <button
              type="submit"
              class="btn btn-primary bicon-reply-button"
              @click="
                postLikeOrDislike({
                  commentId: com.id,
                  likeOrDislike: false,
                })
              "
            >
              <BIconHandThumbsDownFill />
            </button>
            <span class="center-span">{{getNumberOfDislikes(com)}}</span>
            <button
              class="btn btn-primary bicon-reply-button"
              style="float: left"
              @click="toggle(com.id)"
            >
              <BIconReply />
            </button>
          </div>
          <div class="reply-form" v-if="com.id === selectedItem">
            <form
              v-on:submit.prevent="
                postCommentThenReturnData(
                  writingReplyComment,
                  post.id,
                  getUserLogin.userProfileDto.id,
                  com.id
                )
              "
            >
              <div class="mb-3">
                <label
                  style="color: white"
                  for="exampleFormControlTextarea1"
                  class="form-label"
                  >Comment</label
                >
                <textarea
                  v-model="writingReplyComment"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn btn-primary allign-submit-button"
              >
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
              <button
                type="submit"
                class="btn btn-primary bicon-reply-button"
                @click="
                  postLikeOrDislike({
                    commentId: com.id,
                    likeOrDislike: true,
                  })
                "
              >
                <BIconHandThumbsUpFill />
              </button>
              <span class="center-span">{{getNumberOfLikes(com)}}</span>
              <button
                type="submit"
                class="btn btn-primary bicon-reply-button"
                @click="
                  postLikeOrDislike({
                    commentId: com.id,
                    likeOrDislike: false,
                  })
                "
              >
                <BIconHandThumbsDownFill />
              </button>
              <span class="center-span">{{getNumberOfDislikes(com)}}</span>
              <button
                class="btn btn-primary bicon-reply-button"
                style="float: left"
                @click="toggle(com.id)"
              >
                <BIconReply />
              </button>
            </div>
            <div class="reply-form" v-if="com.id === selectedItem">
              <form
                v-on:submit.prevent="
                  postCommentThenReturnData(
                    writingReplyComment,
                    post.id,
                    getUserLogin.userProfileDto.id,
                    com.id
                  )
                "
              >
                <div class="mb-3">
                  <label
                    style="color: white"
                    for="exampleFormControlTextarea1"
                    class="form-label"
                    >Comment</label
                  >
                  <textarea
                    v-model="writingReplyComment"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary allign-submit-button"
                >
                  Post comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comments" v-else>
      <p>Comments are disabled</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconReply,
} from "bootstrap-icons-vue";
import { FrontPagePost } from "../store/PostStore";
import { useCommentStore, CommentDto } from "../store/CommentStore";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../store/UserStore";
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: "CommentSection",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconReply,
  },
  props: {
    post: Object as PropType<FrontPagePost>,
  },
  computed: {
    ...mapState(useUserStore, ["getUserLogin", "userProfile"]),
    ...mapState(useCommentStore, ["getAllCommentsByPostId"]),
  },
  setup() {
    const toast = useToast();
    return { toast }
  },
  mounted(){
    this.openWebsocket();
  },
  methods: {
    ...mapActions(useCommentStore, [
      "postCommentAction",
      "postLikeOrDislike",
      "fetchAllCommentsFromPostById",
      "resetState",
      'patchComments',
      'getNumberOfLikes',
      'getNumberOfDislikes',
      'getEvent',
      'sendEvent',
      'closeWebSocket',
      'openWebsocket'
    ]),
    ...mapActions(useUserStore, ["getUserByIdOrUsername"]),
    getNumberOfComments: function (comments: CommentDto[]): number {
      return comments.length;
    },
    getUserInfo() {
      console.log("Clicked");
    },
    postCommentThenReturnData: function (
      text: string,
      idOfPost: number,
      idOfUser: number,
      parentId: null | number
    ) {
      if (!this.checkIfUserIsLogged()) {
        this.toast.warning("You have to log in to comment!");
        return;
      }

      this.postCommentAction({
        text: text,
        postId: idOfPost,
        userId: idOfUser,
        parentId: parentId,
      });

      this.writingComment = "";
    },
    toggle: function (item: number) {
      this.selectedItem = item;
    },
    checkIfUserIsLogged: function (): boolean {
      if (this.getUserLogin.userProfileDto.id != 0) {
        return true;
      }
      return false;
    },
    isReply: function (comment: FrontPagePost): boolean {
      if (comment.commentsDto.filter((x) => x.parentId !== null)) {
        console.log("ParentId not null ");
        this.isReplyComment = true;
        return true;
      }

      this.isReplyComment = false;
      return false;
    },
    sortCommentsByParentId: function (
      commentArray: CommentDto[]
    ): CommentDto[] {
      var filteredArray: CommentDto[] = [];

      commentArray.forEach((e) => {
        if (e.parentId === null) {
          filteredArray.push(e);
        }
        commentArray
          .filter((x) => x.parentId === e.id)
          .map((k) => filteredArray.push(k));
      });

      return filteredArray;
    },
    updateValue(value: string) {
      this.writingComment = value;
    },
  },
  beforeUpdate(){
    console.log("Try to get event")
    this.getEvent();
  },
  unmounted(){
    console.log("Close comment websocket");
    this.closeWebSocket();
  },
  data() {
    return {
      writingComment: "" as string,
      writingReplyComment: "" as string,
      open: false as boolean,
      isHidden: true as boolean,
      isActive: false as boolean,
      selectedItem: 0 as number,
      currentCommentId: 0 as number,
      isReplyComment: false as boolean,
      dataComments: [] as CommentDto[],
    };
  },
  watch: {
    post: function (newVal: FrontPagePost) {
      this.resetState();
      this.fetchAllCommentsFromPostById(newVal.id);
    },
    getAllCommentsByPostId: function(){
      console.log("FETCH DATA WATCH")
      this.dataComments = this.getAllCommentsByPostId;
    }
  }
});
</script>

<style scoped>
.main-comment-div p {
  color: black;
}
.number-of-comments {
  margin-bottom: 25px;
  display: flex;
}

.comments {
  display: flex;
  flex-direction: column;
  margin: 0px 31.1%;
}

.commented-by {
  padding: 2vh;
}

.card-comment-div {
  margin: 10px 0;
}

#user-button {
  width: 150px;
}

.reply-comment-card {
  margin-left: 50px;
  margin-bottom: 15px;
}

.user-div {
  display: flex;
}

.actions-for-comments a {
  margin: 10px;
}
.actions-for-comments {
  display: flex;
}
.form-style {
  margin: 10px 0 10px 0;
  display: grid;
}

.center-span{
  margin-top:auto;
  margin-bottom:auto;
  margin-right: 1em;
}

.btn-primary-comment-form {
  margin: 15px auto 5rem;
}

.bicon-reply-button {
  margin: 10px 4px 10px 4px;
}
</style>