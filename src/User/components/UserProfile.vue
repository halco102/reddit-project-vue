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
                <div class="delete-icon-wrapper" v-if="isCurrentUser()">
                  <div class="delete-icon">
                    <button style="border: none; background: none">
                      <BIconTrash
                        @click.prevent="deletePost(post.id)"
                        color="#0d6efd"
                        width="25px"
                        height="25px"
                      />
                    </button>
                  </div>
                </div>
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

//components
import NavigationBar from "@/components/NavigationBar.vue";
import UserProfileBar from "@/User/components/UserProfileBar.vue";
import { BIconTrash } from "bootstrap-icons-vue";

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
    BIconTrash,
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
    deletePost: function (id: number) : void{
      this.deletePostById(id);
    },

    isCurrentUser: function() : boolean {
      // get the id from url
      let convert : number = + this.$route.params.userId;

      if (this.getCurrentlyLoggedUserProfile.id === convert) {
        return true;
      }

      /*
      let jwt : string = sessionStorage.getItem('jwt');

      // check first if the state of userProfile is empty 
      if (this.getCurrentlyLoggedUserProfile.id === 0) {
        // it is in the default state get the jwt from storage and fetch data
        if (jwt.length > 0) {
          // now check the jwt and in that methods the userProfile method will be called
          this.checkIfJwtIsValid(jwt);
        }
      }

      //get the jwt from local storage, check if its ok and fetch userData
      */


      return false;
    },
  },
  data() {
    return {
      likes: 0,
    };
  },
  computed: {
    ...mapState(useUserStore, ["getUserProfile", "getLikesDislikesFromPost", ]),
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

      this.getUserProfile.posts.filter((x : any) =>
        x.postLikeOrDislikeDtos
          .filter((y : any) => y.likeOrDislike === true)
          .map(() => this.likes++)
      );

    },
    getIsDeleted: function(){
      console.log("Post is deleted");
      this.sendUserMessage(this.getUserProfile);
    }
  },
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

.delete-icon-wrapper {
  margin-left: 24.6%;
  margin-right: 25%;
}
</style>
