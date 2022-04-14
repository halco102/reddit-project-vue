<template>
  <div class="main-div">
    <NavigationBar />
    <div class="wrapper-post">
      <div class="signup">
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
                <a
                  href="#user"
                  class="btn btn-primary"
                  style="margin: 0px 10px 0 10px"
                >
                  <img
                    v-bind:src="post.postedBy.imageUrl"
                    alt=""
                    style="withd: 25px; height: 25px"
                  />
                  Posted by: {{ post.postedBy.username }}
                </a>
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
    <p>{{this.user}} User</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconChatFill,
} from "bootstrap-icons-vue";
import UserSignup from "./UserSignup.vue";
import NavigationBar from "./NavigationBar.vue";
import { useUserStore } from "../store/UserStore";
import UserLogin from "./UserLogin.vue";

export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconChatFill,
    UserSignup,
    NavigationBar,
    UserLogin,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchAllPostToShow"]),
  },
  computed: {
    ...mapState(usePostStore, ["posts"]),
    ...mapState(useUserStore, ["user"]),
  },
  created() {
    this.fetchAllPostToShow();
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
  background-color: rgba(28, 28, 28, 0.9);
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