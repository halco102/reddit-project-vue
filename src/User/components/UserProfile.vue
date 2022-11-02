<template>
  <div class="grid justify-center my-10">

    <!--User profile with stats-->
    <div>
      <div class="flex justify-center mb-10 gap-4">

        <!--Image on left side-->
        <div class="border rounded-full">
          <img :src="getUserProfile.imageUrl" class="w-20 h-20" />
        </div>

        <!--Email and date on right side-->
        <div class="pl-4 pt-4 grid">
          <span class="font-serif">Username : {{ getUserProfile.username }}</span>
          <span class="font-serif">Email: {{ getUserProfile.email }}</span>
          <span class="font-serif">Created at: {{ getUserProfile.createdAt }}</span>
        </div>

        <!--Follow icon-->
        <div class="my-auto" v-if="getCurrentlyLoggedUserProfile.id !== getUserProfile.id">
          <VButtonIcon @onClick="followUnfollowUser(getUserProfile.id)" class="hover:bg-gray-300">
            <template #icon>
              <FollowIcon class="w-8 h-8" v-if="!userIsFollowed" />
              <UnfollowIcon class="w-8 h-8" v-else />
            </template>
          </VButtonIcon>
        </div>

      </div>

      <!--Under image and basic user info stats-->
      <div class="lg:flex md:flex sm:grid sm:justify-center">

        <UserProfileStatsVue>
          <template #info>
            <p class="text-center">Number of posts</p>
            <p class="text-center">{{ getUserProfile.posts.length }}</p>
          </template>
        </UserProfileStatsVue>

        <UserProfileStatsVue>
          <template #info>
            <p class="text-center">Number of comments</p>
            <p class="text-center">{{ numberOfComments() }}</p>
          </template>
        </UserProfileStatsVue>

        <UserProfileStatsVue>
          <template #info>
            <p class="text-center">Number of likes</p>
            <p class="text-center">{{ sumOfLikesOrDislikes() }}</p>
          </template>
        </UserProfileStatsVue>

      </div>
    </div>


    <!--User post and comments section-->
    <div class="grid">

      <!--Router link to filter post or comments of user-->
      <div class="flex justify-evenly my-6">

        <router-link :to="{ name: 'FilterPosts', query: { filter: 'posts' } }">
          <ButtonComponent
            class="active:bg-blue-200 focus:outline-none focus:ring focus:ring-gray-500 focus:bg-gray-300 hover:bg-gray-500 opacity-60"
            :disabled=false title="Posts" :background="'NONE'" />
        </router-link>


        <router-link :to="{ name: 'FilterComments', query: { filter: 'comments' } }">
          <ButtonComponent
            class="active:bg-blue-200 focus:outline-none focus:ring focus:ring-gray-500 focus:bg-gray-300 hover:bg-gray-500 opacity-60"
            :disabled=false title="Comments" :background="'NONE'" />
        </router-link>

        <router-link :to="{ name: 'FollowingComponent', query: { filter: 'following' } }">
          <ButtonComponent
            class="active:bg-blue-200 focus:outline-none focus:ring focus:ring-gray-500 focus:bg-gray-300 hover:bg-gray-500 opacity-60"
            :disabled=false title="Following" :background="'NONE'" />
        </router-link>

        <router-link :to="{ name: 'FollowersComponent', query: { filter: 'followers' } }">
          <ButtonComponent
            class="active:bg-blue-200 focus:outline-none focus:ring focus:ring-gray-500 focus:bg-gray-300 hover:bg-gray-500 opacity-60"
            :disabled=false title="Followers" :background="'NONE'" />
        </router-link>

      </div>


      <!--Filtered items-->
      <div class="grid">
        <router-view>
        </router-view>
      </div>

    </div>



  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


//components
import UserProfileStatsVue from "./UserProfileStats.vue";

//pinia
import { useUserStore } from "@/User/store/store";
import { usePostStore } from "@/Post/store/store";
import { mapActions, mapState } from "pinia";
import { useAuthenticationStore } from "../store/authentication_store";
import VButtonIcon from '@/components/VButtonIcon.vue'
import FollowIcon from "@/User/components/FollowIcon.vue";
import UnfollowIcon from "./UnfollowIcon.vue";
import ButtonComponent from '@/components/ButtonComponent.vue';


//types
import { PostedBy, UserProfile } from '@/User/types';

export default defineComponent({
  name: "UserProfile",
  components: {
    UserProfileStatsVue,
    VButtonIcon,
    FollowIcon,
    UnfollowIcon,
    ButtonComponent
  },
  methods: {
    ...mapActions(useUserStore, [
      "getUserByIdOrUsername",
      "getAllPostsFromUserByUserId",
    ]),
    ...mapActions(useAuthenticationStore, ['followUser',
      'unfollowUser']),
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
    currentlyFocusedFilter: function (post: boolean, comment: boolean): void {
      if (this.events.isPost && comment) {
        this.events.isPost = false;
        this.events.isComment = true;
      } else {
        this.events.isPost = true;
        this.events.isComment = false;
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
          }
        })

      return result;
    },
    checkIfCurrentUserFollowsProfile: function (profileId: number): void {

      if (this.getCurrentlyLoggedUserProfile.id !== 0)
        this.userIsFollowed = this.getCurrentlyLoggedUserProfile.followingDtos.some(object => object.id === profileId);


    },
    followUnfollowUser: function (profileId: number): void {
      if (this.userIsFollowed)
        this.unfollowUser(profileId);
      else
        this.followUser(profileId);
    }
  },
  data() {
    return {
      likes: 0,
      events: {
        isPost: false,
        isComment: false
      },
      userIsFollowed: false
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

  },
  watch: {
    getUserProfile: function (profile: UserProfile) {

      this.getUserProfile.posts.filter((x: any) => {
        if (x.postLikeOrDislikeDtos !== null) {
          x.postLikeOrDislikeDtos
            .filter((y: any) => y.likeOrDislike === true)
            .map(() => this.likes++)
        }
      }
      );

      this.checkIfCurrentUserFollowsProfile(profile.id);
    },
    getCurrentlyLoggedUserProfile: function (): void {
      this.checkIfCurrentUserFollowsProfile(this.getUserProfile.id);
    }

  },
});
</script>

