<template>
  <div class="main">
    <NavigationBar />
    <div class="user-profile-main">
      <!-- content -->
      <div class="user-content">
        <div class="profile-bar">
          <UserProfileBar />
        </div>
        <p>Content</p>
        <router-link
          v-for="post in getUserProfile.posts"
          :key="post.id"
          :to="{ name: 'SinglePage', params: { id: post.id } }"
        >
          <div class="content">
            <div class="card" style="width: 35rem">
              <img :src="post.imageUrl" />
              <div class="card-body">
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text" style="color: black">
                  {{ post.text }}
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- user profile -->
      <div class="user-profile">
        <p>Profile</p>
        <div class="card" style="width: 18rem">
          <img :src="getUserProfile.imageUrl" />
          <div class="card-body">
            <h5 class="card-title">{{ getUserProfile.username }}</h5>
            <div class="additional-information">
              <p>Email: {{ getUserProfile.emai }}</p>
              <p>Created at: {{ getUserProfile.createdAt }}</p>
              <p>Sum of post likes: {{ likes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import { useUserStore, PostedBy } from "../store/UserStore";
import { mapActions, mapState } from "pinia";
import UserProfileBar from "./UserProfileBar.vue";

export default defineComponent({
  name: "UserProfile",
  components: {
    NavigationBar,
    UserProfileBar,
  },
  methods: {
    ...mapActions(useUserStore, [
      "getUserByIdOrUsername",
      "getAllPostsFromUserByUserId",
    ]),
    getPostedBy: function (): PostedBy {
      console.log("GetPostedBy", this.getUserProfile);
      return {
        id: this.getUserProfile.id,
        username: this.getUserProfile.username,
        imageUrl: this.getUserProfile.imageUrl,
      };
    },
    getNumberOfLikesFromAllPosts: function (): number {
      console.log("Start action");
      console.log(this.getLikesDislikesFromPost);

      return this.likes;
    },
  },
  data() {
    return {
      likes: 0,
    };
  },
  computed: {
    ...mapState(useUserStore, ["getUserProfile", "getLikesDislikesFromPost"]),
  },
  created() {
    let convertStringToInt = +this.$route.params.userId;
    this.getUserByIdOrUsername(convertStringToInt, null);
  },
  watch: {
    getUserProfile : function() {
      console.log("Got data", this.getUserProfile);
      this.getUserProfile.posts.filter((x) => x.postLikeOrDislikeDtos.filter((y) => y.likeOrDislike === true).map(() => this.likes++));
    }
  }
});
</script>

<style scoped>
.profile-bar {
}

.main p {
  color: white;
}

.user-profile-main {
  display: flex;
  justify-content: center;
  margin-top: 10vh;
}

.user-content {
  margin-right: 5vh;
  text-align: center;
}

.content {
  margin-bottom: 1rem;
}

.user-profile {
  text-align: center;
}

.user-profile img {
  display: block;
  width: 100px;
  height: 100px;
  margin-left: auto;
  margin-right: auto;
}

.additional-information p {
  color: black;
}
</style>
