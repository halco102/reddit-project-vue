<template>
  <div class="main">
    <NavigationBar />

    <!-- first show the user profile in its own div -->

    <!-- user profile -->
    <div class="user-profile">
      <div>
        <h5 style="text-align:left;">{{ getUserProfile.username }} profile</h5>
        <div class="profile-content">
          <img :src="getUserProfile.imageUrl" />
          <div class="card-body">
            <div class="additional-information">
              <p>Email: {{ getUserProfile.email }}</p>
              <p>Created at: {{ getUserProfile.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="user-profile-stats">
       
       <UserProfileStatsVue info="Number of posts" :number="getUserProfile.posts.length" />

       <UserProfileStatsVue info="Number of comments" :number="numberOfComments()" />

       <UserProfileStatsVue info="Number of likes" :number="0" />

      </div>
    </div>

    <div class="user-profile-main">
      <!-- content -->
      <div class="user-content">
        <div class="profile-bar">
          <UserProfileBar @postOrComment="postOrComment" />
        </div>

        <UserProfilePosts :posts="getUserProfile.posts" :isCurrentUser="isCurrentUser()" v-show="events.isPost" />
        <UserProfileComments :user="getUserProfile" :isCurrentUser="isCurrentUser()" :isClicked="events.isComment" v-show="events.isComment"
          v-if="events.isComment" />

      </div>


    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

//components
import NavigationBar from "@/components/NavigationBar.vue";
import UserProfileBar from "@/User/components/UserProfileBar.vue";
import UserProfilePosts from "@/User/components/UserProfilePosts.vue"
import UserProfileComments from "./UserProfileComments.vue";
import UserProfileStatsVue from "./UserProfileStats.vue";

//pinia
import { useUserStore } from "@/User/store/store";
import { usePostStore } from "@/Post/store/store";
import { mapActions, mapState } from "pinia";
import { useAuthenticationStore } from "../store/authentication_store";

//types
import { PostedBy } from '@/User/types';

export default defineComponent({
  name: "UserProfile",
  components: {
    NavigationBar,
    UserProfileBar,
    UserProfilePosts,
    UserProfileComments,
    UserProfileStatsVue
  },
  methods: {
    ...mapActions(useUserStore, [
      "getUserByIdOrUsername",
      "getAllPostsFromUserByUserId",
      "openUserWebsocket",
      'sendUserMessage',

    ]),
    ...mapActions(useAuthenticationStore, []),
    ...mapActions(usePostStore, ["deletePostById"]),
    getPostedBy: function (): PostedBy {
      console.log("GetPostedBy", this.getUserProfile);
      return {
        id: this.getUserProfile.id,
        username: this.getUserProfile.username,
        imageUrl: this.getUserProfile.imageUrl,
      };
    },
    getNumberOfLikesFromAllPosts: function (): number {
      console.log(this.getLikesDislikesFromPost);

      return this.likes;
    },
    deletePost: function (id: number): void {
      this.deletePostById(id);
    },
    postOrComment: function (val: any): void {
      if (val.isPost) {
        this.events.isPost = true;
        this.events.isComment = false
      } else {
        this.events.isPost = false;
        this.events.isComment = true;
      }
    },
    isCurrentUser: function (): boolean {
      // get the id from url
      let convert: number = + this.$route.params.userId;

      if (this.getCurrentlyLoggedUserProfile.id === convert) {
        return true;
      }


      return false;
    },
    numberOfComments: function() : number {
      let numberOfComments = 0;

      this.getUserProfile.commentsPosts.forEach((item) => {
        numberOfComments += item.commentDto.length;
      })

      return numberOfComments;
    }
  },
  data() {
    return {
      likes: 0,
      events: {
        isPost: true,
        isComment: false
      }
    };
  },
  computed: {
    ...mapState(useUserStore, ["getUserProfile", "getLikesDislikesFromPost",]),
    ...mapState(usePostStore, ["getIsDeleted"]),
    ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile'])
  },
  created() {
    let convertStringToInt = +this.$route.params.userId;
    this.getUserByIdOrUsername(convertStringToInt, null);
    this.openUserWebsocket();
  },
  watch: {
    getUserProfile: function () {

      this.getUserProfile.posts.filter((x: any) =>
        x.postLikeOrDislikeDtos
          .filter((y: any) => y.likeOrDislike === true)
          .map(() => this.likes++)
      );

    },
    getIsDeleted: function () {
      console.log("Post is deleted");
      this.sendUserMessage(this.getUserProfile);
    }
  },
});
</script>

<style scoped>
.main p {
  color: black;
}

.user-profile-main {
  display: grid;
  justify-items: center;
  margin-top: 10vh;
}

.user-content {
  margin-right: 5vh;
  text-align: center;
  min-width: 30%;
}

.content {
  margin-bottom: 1rem;
}

.user-profile {
  text-align: center;
  display: grid;
  justify-items: center;
  margin-top: 5vh;
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
  padding-left: 4rem;
}

.delete-icon-wrapper {
  margin-left: 24.6%;
  margin-right: 25%;
}

.profile-content {
  display: flex;
}

.profile-content img {
  border-style: solid;
  border-radius: 55px;
}

.user-profile-stats{
  display:flex;
  margin:1rem;
}

</style>
