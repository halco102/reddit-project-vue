<template>
  <div class="main-comment-div">
    <div class="comments" v-if="post.allowComments === true">
      <div class="number-of-comments">
        <p style="color: white">
          Number of comments : {{ getNumberOfComments(post.commentsDto) }}
        </p>
      </div>

      <form
        v-on:submit.prevent="
          postCommentThenReturnData(writingComment, post.id, user.id, null)
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
        class="card border-0 card-comment-div"
        v-for="com in addComments(post)"
        :key="com.id"
      >
        <p>{{com}}</p>
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
                  userId: user.id,
                  commentId: com.id,
                  likeOrDislike: true,
                })
              "
            >
              <BIconHandThumbsUpFill />
            </button>
            <button
              type="submit"
              class="btn btn-primary bicon-reply-button"
              @click="
                postLikeOrDislike({
                  userId: user.id,
                  commentId: com.id,
                  likeOrDislike: false,
                })
              "
            >
              <BIconHandThumbsDownFill />
            </button>
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
                  user.id,
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
                class="btn btn-primary"
                @click="
                  postLikeOrDislike({
                    userId: user.id,
                    commentId: com.id,
                    likeOrDislike: true,
                  })
                "
              >
                <BIconHandThumbsUpFill />
              </button>
              <button
                type="submit"
                class="btn btn-success bicon-reply-button "
                @click="
                  postLikeOrDislike({
                    userId: user.id,
                    commentId: com.id,
                    likeOrDislike: true,
                  })
                "
              >
                <BIconHandThumbsDownFill />
              </button>
              <button
                class="btn btn-primary bicon-reply-button"
                style="float: left"
              >
                <BIconReply />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comments" v-else>
      <p>Comments are disabled</p>
    </div>
    <p @click="sortCommentsByParentId(post)">{{getAllCommentsFromPost}}</p>
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
import { useCommentStore, CommentResponse, CommentDto } from "../store/CommentStore";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../store/UserStore";


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
    ...mapState(useUserStore, ["user", 'userProfile']),
    ...mapState(useCommentStore, ["postComment",'commentResponse','getAllCommentsFromPost']),
  },
  methods: {
    ...mapActions(useCommentStore, ["postCommentAction", "postLikeOrDislike", 'getAllCommentsFromPostById', 'resetState', 'updateState']),
    ...mapActions(useUserStore, ['getUserByIdOrUsername']),
    getNumberOfComments: function (comments: CommentResponse[]): number {
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
        console.log("User not logged in abort");
        alert("You have to login before you can comment on a post");
        return;
      }

      this.postCommentAction({
        text: text,
        postId: idOfPost,
        userId: idOfUser,
        parentId: parentId,
      });
      //fetch again comments
      this.getAllCommentsFromPostById(idOfPost);
      this.writingComment = '';

    },
    addComments: function(post : FrontPagePost) : CommentResponse[]{
      console.log("Post", post);
        var counter = 0 ;
        console.log("Post", this.commentResponse);
        if (counter === 0) {
          this.updateState(post);
          counter++;
        }
              
        return this.commentResponse;
    },
    toggle: function (item: number) {
      this.selectedItem = item;
    },
    checkIfUserIsLogged: function (): boolean {
      if (this.user.id != 0) {
        console.log("Logged user");
        return true;
      }
      console.log("Not logged");
      return false;
    },
    isReply: function (comment: FrontPagePost): boolean {

      if (comment.commentsDto.filter((x) => x.commentsDto.parentId !== null)) {
        console.log("ParentId not null ");
        this.isReplyComment = true;
        return true;
      }

      this.isReplyComment = false;
      return false;
    },
    sortCommentsByParentId: function (commentArray : FrontPagePost): CommentResponse[] {
      var filteredArray: CommentResponse[] = [];

      console.log("Sort", commentArray)
      console.log(commentArray)

      commentArray.commentsDto.filter((el) => console.log("ele",el))
/*
      commentArray.commentsDto.filter((el : CommentResponse) => {
        if (el.parentId === null) {
          filteredArray.push(el);
        }
        commentArray.filter((x) => x.parentId === el.id).map((k) => filteredArray.push(k))
      })*/
      return filteredArray;
    },
    updateValue(value: string){
      console.log("Update")
      this.writingComment = value;
    }
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
      isReplyComment: false,
    };
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

.reply-comment {
  padding-left: 50px;
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

.btn-primary-comment-form {
  margin: 15px auto 5rem;
}

.bicon-reply-button {
  margin: 10px 4px 10px 4px;
}
</style>