<template>
  <div class="main-div">
    <div class="wrapper-post">
      <div class="signup">
        <h3>
          New to app? <br />
          Signup here<br />
        </h3>
        <UserSignupModal />
      </div>

      <img
        style="display: grid"
        v-if="posts.length === 0"
        src="https://res.cloudinary.com/dzatojfyn/image/upload/v1651749462/output-onlinepngtools_pi0ngz.png"
      />

      <div class="dropdown" v-if="posts.length != 0">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <BIconFilter />
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="dropdown-item" @click="sort(true)">Hot</a></li>
          <li><a class="dropdown-item" @click="sort(false)">Disliked</a></li>
        </ul>
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
              <a v-if="post.allowComments" href="#chat" class="btn btn-primary"
                ><BIconChatFill /> {{ post.commentsDto.length }}</a
              >
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <p  @click="nekaMetoda">CLick me</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

//pinia
import { usePostStore } from "../store/PostStore";
import { mapState, mapActions } from "pinia";
import { useUserStore } from "../store/UserStore";

//components
import {
  BIconHandThumbsUpFill,
  BIconHandThumbsDownFill,
  BIconChatFill,
  BIconFilter,
} from "bootstrap-icons-vue";
import UserSignupModal from "./modal/UserSignupModal.vue";

//types
import { FrontPagePost } from '../types/PostType';
import { PostedBy } from '../types/UserType';

export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconHandThumbsUpFill,
    BIconHandThumbsDownFill,
    BIconChatFill,
    UserSignupModal,
    BIconFilter,
  },
  methods: {
    ...mapActions(usePostStore, [
      "postLikeOrDislikeForPost",
      "getNumberOfLikes",
      "getNumberOfDislikes",
      'sortPostsByNumberOfLikesOrDislikes'
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
    sort: function(condition : boolean) : void {
      this.sortPostsByNumberOfLikesOrDislikes(condition);
    },
    nekaMetoda : function() : void {
      const local = localStorage.getItem('userLogin');
      console.log("Local storage", local);
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
  updated() {
    console.log("Post component updated");
  },
});
</script>

<style scoped>
.signup-modal {
  margin-left: 0px;
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

.modal {
  position: absolute;
  display: grid;
}

.signup {
  margin-top:9vh;
  position: absolute;
  width: 225px;
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

.dropdown {
  margin-bottom: 10px;
  text-align: end;
}

@media only screen and (max-width: 1642px) {
  .signup {
    display: none;
  }
}
</style>