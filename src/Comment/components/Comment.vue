<template v-if="getAllCommentsByPostId.length != 0">
  <div class="main-comment-div">
    <div class="comments" v-if="post!.allowComments === true">
      <div class="number-of-comments">
        <p style="color: white; margin-top: 1rem">
          Number of comments : {{ getNumberOfComments(getAllCommentsByPostId) }}
        </p>
      </div>

      <form
        v-on:submit.prevent="
          postCommentThenReturnData(
            writingComment,
            post!.id,
            getCurrentlyLoggedUserProfile.id,
            null
          )
        "
        class="form-style"
      >
        <div class="mb-3">
          <label
            style="color:white;"
            for="exampleFormControlTextarea1"
            class="form-label"
            >Comment</label
          >
          <textarea
            v-model="writingComment"
            class="form-control"
            id="exampleFormControlTextarea1"
            style="border-color:black;"
            rows="3"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-primary-comment-form">
          Post comment
        </button>
      </form>

      <!-- Comments !-->
      <div
        v-for="com in getAllCommentsByPostId"
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
            <span class="center-span">{{ getNumberOfLikes(com) }}</span>
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
            <span class="center-span">{{ getNumberOfDislikes(com) }}</span>
            <button
              class="btn btn-primary bicon-reply-button"
              style="float: left"
              @click="toggle(com.id)"
            >
              <BIconReply />
            </button>

            <div
              class="delete-icon-wrapper"
              v-show="isCommentHolder(com.userInfo.id)"
            >
              <div class="delete-icon">
                <button style="border: none; background: none">
                  <BIconTrash
                    @click.prevent="deleteCommentById(com.id, post!.id)"
                    color="#0d6efd"
                    width="25px"
                    height="25px"
                  />
                </button>
              </div>
            </div>
          </div>

          <div class="reply-form" v-if="com.id === selectedItem">
            <form
              v-on:submit.prevent="
                postCommentThenReturnData(
                  writingReplyComment,
                  post!.id,
                  getCurrentlyLoggedUserProfile.id,
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

        <!-- reply -->
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
              <span class="center-span">{{ getNumberOfLikes(com) }}</span>
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
              <span class="center-span">{{ getNumberOfDislikes(com) }}</span>
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
                    post!.id,
                    getCurrentlyLoggedUserProfile.id,
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
    <div>
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
import {CommentDto} from '@/Comment/types';

export default defineComponent({
  name: "CommentSection",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconReply,
    BIconTrash,
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
  created() {
    console.log("Open Stomp connection in Comments.vue");
    this.openWebsocketConnection();
    
  },
  methods: {
    ...mapActions(useCommentStore, [
      "postCommentAction",
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

      if (text === '') {
        this.toast.warning("Comment is empty");
        return;
      }

      this.postCommentAction({
        text: text,
        postId: idOfPost,
        userId: idOfUser,
        parentId: parentId,
      });

      this.writingComment = '';
      this.writingReplyComment = '';

    },
    toggle: function (item: number) {
      this.selectedItem = item;
    },
    checkIfUserIsLogged: function (): boolean {
      console.log(this.getCurrentlyLoggedUserProfile);
      if (this.getCurrentlyLoggedUserProfile.id != 0) {
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
    updateValue(value: string) {
      this.writingComment = value;
    },
    isCommentHolder(commentUserId: number): boolean {
      if (this.getCurrentlyLoggedUserProfile.id === commentUserId) {
        return true;
      }
      return false;
    },
  },watch :{
    post: function() {
      console.log("POST")
      this.setCommentsFromPost(this.post!.commentsDto);
    },
    getIsPostingComment: function(val : boolean) {
      if (val === false) {
        console.log("VALUE", val);
        this.fetchAllCommentsByPostId(this.post!.id);
      }
    }
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
    };
  },
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

.center-span {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 1em;
}

.btn-primary-comment-form {
  margin: 15px auto 5rem;
}

.bicon-reply-button {
  margin: 10px 4px 10px 4px;
}
.delete-icon-wrapper {
  margin-left: auto;
  display: grid;
  align-items: center;
}
</style>