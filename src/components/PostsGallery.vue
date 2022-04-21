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
                <UserSignup/>
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
            @click="isClosed()"
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
      
      <p v-if="posts === []">Nothing to show</p>
      
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
                <router-link :to="{name: 'UserProfileById', params:{userId: testTag(post.postedBy).id, id: testTag(post.postedBy).id}}">
                <a
                  class="btn btn-primary"
                  style="margin: 0px 10px 0 10px"
                >
                  <img
                    v-bind:src="testTag(post.postedBy).imageUrl"
                    alt=""
                    style="withd: 25px; height: 25px"
                  />
                  Posted by: {{ testTag(post.postedBy).username }}
                </a>
                </router-link>
              </div>
              <div class="like-dislike">
                <a
                  href="#like"
                  class="btn btn-primary"
                  style="margin: 0px 10px 0 10px"
                  ><BIconHandThumbsUpFill
                /></a>
                <a
                  href="#dislike"
                  class="btn btn-primary"
                  style="margin: 0px 10px 0 10px"
                  ><BIconHandThumbsDownFill
                /></a>
              </div>
              <a href="#chat" class="btn btn-primary"><BIconChatFill /></a>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FrontPagePost } from "../store/PostStore";
import { mapState } from "pinia";
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconChatFill,
} from "bootstrap-icons-vue";
import UserSignup from "./UserSignup.vue";
import { useUserStore, PostedBy } from "../store/UserStore";
import UserLogin from "./UserLogin.vue";

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
    isClosed: function () {
      console.log("Wait");
      if (this.user.id !== 0) {
        console.log("Now close");
        this.isClose = true;
      }
    },
    getPostId: function(id: number) {
      return id;
    },
    testTag: function(postsPostedBy: PostedBy | null) : PostedBy{
      if(postsPostedBy != null) {
        return postsPostedBy;
      }
      return this.postedBy as PostedBy;
    }
  },
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
  props: {
    posts: Object as PropType<FrontPagePost[]>,
    postedBy: {
      postedBy: Object as PropType<PostedBy>,
      required: false
    }
  },
  data() {
    return {
      isClose: false,
    };
  },
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
</style>