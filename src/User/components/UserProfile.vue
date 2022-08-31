<template>
  <div class="main">

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

        <UserProfileStatsVue info="Number of likes" :number="sumOfLikesOrDislikes()" />

      </div>
    </div>

    <div class="user-profile-main">

      <div class="user-content">
        <div class="profile-bar">
          <UserProfileBar @postOrComment="postOrComment" />
        </div>

        <router-view :user="getUserProfile" :posts="getUserProfile.posts" :isCurrentUser="isCurrentUser()">
        </router-view>

      </div>



    </div>


  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

//components
import UserProfileBar from "@/User/components/UserProfileBar.vue";
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
    UserProfileStatsVue,
    UserProfileBar
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
    numberOfComments: function (): number {
      let numberOfComments = 0;

      this.getUserProfile.commentsPosts.forEach((item) => {
        numberOfComments += item.commentDto.length;
      })

      return numberOfComments;
    },

    sumOfLikesOrDislikes: function (): number {
      let result = 0;

      this.getUserProfile
        .posts.map((res) => {
          if (res.postLikeOrDislikeDtos !== null) {
            res.postLikeOrDislikeDtos.filter((k) => {
              if (k.likeOrDislike) {
                result++;
              } else {
                result--;
              }
            }
          )
    }})

return result;
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

    this.getUserProfile.posts.filter((x: any) => {
      if (x.postLikeOrDislikeDtos !== null) {
        x.postLikeOrDislikeDtos
          .filter((y: any) => y.likeOrDislike === true)
          .map(() => this.likes++)
      }
    }
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

.user-profile-stats {
  display: flex;
  margin: 1rem;
}
</style>
