<template>
  <div class="main-div">
    <div class="wrapper-post">
      <div class="signup" v-if="!isClose">
        <h3>New to App ?</h3>
        <h4>Signup below</h4>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Sign up
        </button>

        <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          ref="signupModal"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Signup</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <UserSignup />
              </div>
            </div>
          </div>
        </div>

        <div class="link-to-login">
          <p>Already have an account?</p>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            Login
          </button>
          <div
            class="modal fade"
            id="loginModal"
            tabindex="-1"
            aria-labelledby="loginModal"
            aria-hidden="true"
            ref="loginModal"
            @click="exitedModal"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <UserLogin />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--
      <img v-if="posts.length === 0" src="https://camden.rutgers.edu/new/wp-content/plugins/elementor/assets/images/no-search-results.svg" >
      -->
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
    <button
      @click="
        sendPostToWs({
          id: 1000,
          title: 'String',
          text: 'STring',
          imageUrl: 'String',
          postedBy: {
            id: 1,
            username: 'a',
            imageUrl: 'a',
          },
          allowComments: true,
          commentsDto: [],
          postLikeOrDislikeDtos: [],
        })
      "
    >
      DUGME
    </button>
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
import UserSignup from "./UserSignup.vue";
import { useUserStore, PostedBy } from "../store/UserStore";
import UserLogin from "./UserLogin.vue";
import SockJS from "sockjs-client";
import * as Stomp from 'webstomp-client';


var stompClient = {} as Stomp.Client;

export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconChatFill,
    UserSignup,
    UserLogin,
  },
  methods: {
    ...mapActions(usePostStore, [
      "postLikeOrDislikeForPost",
      "getNumberOfLikes",
      "getNumberOfDislikes",
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

    sendPostToWs: function (post: FrontPagePost): void {
      const dummyData = {
        id: 1000,
        title: "String",
        text: "STring",
        imageUrl: "String",
        postedBy: {
          id: 1,
          username: "a",
          imageUrl: "a",
        },
        allowComments: true,
        commentsDto: [],
        postLikeOrDislikeDtos: [],
      };

      stompClient.send('/app/post', JSON.stringify(dummyData), {});
      
      //stompClient.send('/topic/post', JSON.stringify(dummyData), {});
      
    },

    connectWs : function() : void{
      var websocket = new WebSocket('ws://localhost:8082/temp');
      console.log(websocket)
      stompClient = Stomp.over(websocket);
      stompClient.connect({}, function (frame){
        console.log('frame', frame);
        stompClient.subscribe('/topic/post', tick => {
          console.log(tick);
        })
      })
    }
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
  created() {
    this.connectWs()
  }
});
</script>

<style scoped>
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

.link-to-login {
  margin-top: 10px;
}

.bicon-reply-button {
  margin: 10px 4px 10px 4px;
}
</style>