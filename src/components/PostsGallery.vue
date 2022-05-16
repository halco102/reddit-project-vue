<template>
  <div class="main-div">
    <div class="wrapper-post">
      <div class="signup" v-show="userLoginResponse.userProfileDto.id == 0">
        <h3> New to app? </h3>
        <UserSignupModal />
        <p style="color:beige;">Alredy have a account ?</p>
        <UserLoginModal />
        </div>

<div class="test">
      <img
        style="display: grid"
        v-if="posts.length === 0"
        src="https://res.cloudinary.com/dzatojfyn/image/upload/v1651749462/output-onlinepngtools_pi0ngz.png"
      />

      <router-link
        :to="{ name: 'SinglePage', params: { id: post.id } }"
        v-for="post in posts"
        :key="post.id"
      >
        <div class="card" style="width: 40rem; margin-bottom: 20px">
          <img v-bind:src="post.imageUrl" class="card-img-top" alt="" />
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.text }}</p>
            <div class="buttons">
              <div class="user-avatar">
                <router-link :to="{ path: '/user/' + post.postedBy.id }">
                  <a class="btn btn-primary" style="margin: 0px 10px 0 10px">
                    <img
                      :src="post.postedBy.imageUrl"
                      alt=""
                      style="withd: 25px; height: 25px"
                    />
                    Posted by: {{ post.postedBy.username }}
                  </a>
                </router-link>
              </div>
              <div class="like-dislike">
                <button
                  @click.prevent="
                    postLikeOrDislikeForPost({
                      postId: post.id,
                      likeOrDislike: true,
                    })
                  "
                  class="btn btn-primary bicon-reply-button"
                  style="margin: 0px 10px 0 10px"
                >
                  <BIconHandThumbsUpFill />
                </button>
                <span>{{ getNumberOfLikes(post) }}</span>
                <button
                  @click.prevent="
                    postLikeOrDislikeForPost({
                      postId: post.id,
                      likeOrDislike: false,
                    })
                  "
                  class="btn btn-primary bicon-reply-button"
                  style="margin: 0px 10px 0 10px"
                >
                  <BIconHandThumbsDownFill />
                </button>
                <span>{{ getNumberOfDislikes(post) }}</span>
              </div>
              <a href="#chat" class="btn btn-primary"
                ><BIconChatFill /> {{ post.commentsDto.length }}</a
              >
            </div>
          </div>
        </div>
      </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FrontPagePost, usePostStore } from "../store/PostStore";
import { mapState, mapActions } from "pinia";
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconChatFill,
} from "bootstrap-icons-vue";
import { useUserStore, PostedBy } from "../store/UserStore";
import UserLoginModal from './modal/UserLoginModal.vue'
import UserSignupModal from './modal/UserSignupModal.vue'



export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconChatFill,
    UserLoginModal,
    UserSignupModal
  },
  methods: {
    ...mapActions(usePostStore, [
      "postLikeOrDislikeForPost",
      "getNumberOfLikes",
      "getNumberOfDislikes"
    ]),
    getPostId: function (id: number) {
      return id;
    },
    exitedModal: function () {
      if (this.userLoginResponse.userProfileDto.id != 0) {
        console.log("Hide modal");
        this.isClose = true;
      }
    },

  },
  computed: {
    ...mapState(useUserStore, ["userLoginResponse"]),
  },
  props: {
    posts: Object as PropType<FrontPagePost[]>,
    postedBy: {
      postedBy: Object as PropType<PostedBy>,
      required: false,
    },
  },
  data() {
    return {
      isClose: false,
    };
  },
  mounted() {
    if (this.userLoginResponse.userProfileDto.id != 0) {
      this.isClose = true;
    }
  },
  updated(){
    console.log("Post component updated")
  }
});
</script>

<style scoped>

.signup-modal{
  margin-left:0px;
}

.user-avatar {
  display: inline-block;
  float: left;
}

.like-dislike {
  float: right;
}

.wrapper-post {
  display: grid;
  justify-content: center;
  padding: 25px 0px;
  margin: 2% 16%;
}

.modal{
  position:absolute;
  display:grid;
}


.signup {
  position: absolute;
  width: 225px;
  height: 275px;
  margin-left: 15px;
  border-style: solid;
  border-color: beige;
  border-width: 1px;
  border-radius: 10px;
  padding: 25px;
  padding-top: 30px;
}

.signup p,
h3,
h4 {
  color: beige;
}

.bicon-reply-button {
  margin: 10px 4px 10px 4px;
}



@media only screen and (max-width: 992px){
 .signup{
   background-color:white;
 } 
}
</style>