<template>

  <div id="main" class="md:flex lg:flex sm:grid justify-items-center">

    <div id="categories-signup/login"
      class="grid sm:my-16 md:ml-26 lg:ml-26 xl:ml-32 w-64 h-fit lg:mt-16 justify-center xl:absolute lg:grid  ">
      <!--Login and signup-->
      <div
        class="mb-3 text-center border-solid border-2 border-black py-4 rounded sm:m-auto sm:mb-2 sm:p-6 lg:mx-0 lg:mb-2 md:mx-0 md:mb-2">
        <h3>
          New to app? <br />
          Signup here<br />
        </h3>
        <UserSignupModal />
      </div>

      <!--categories-->
      <div class="sm:flex md:grid lg:grid border-solid border-2 rounded p-2 border-black">
        <button class="btn btn-blue mb-2 sm:mx-2 sm:px-6 sm:w-1/5 md:w-11/12 lg:w-11/12"
          v-for="category in getAllCategories" :key="category.id"
          @click.prevent="getPostsByCategoryName(category.name)">
          <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }">
            <div class="flex justify-center">
              <img :src="category.iconUrl" style="width: 50px" />
              <div class="mr-1"><span>{{ category.name }}</span></div>
            </div>
          </router-link>
        </button>
      </div>

    </div>

    <div class="grid flex-1 justify-center overflow-hidden">

      <!--Filter bit ce dropdown samo trebam skontati kako se to napravi-->
      <div class="flex justify-end mt-3 lg:relative">

        <div :class="isToggleDropdown ? 'grid' : ''">
          <button id="dropdownDefault"
            :class="isToggleDropdown ?'btn btn-ligh hover:bg-gray-500 ml-auto sm:mb-1 lg:mb-0 bg-gray-500' : 'btn btn-ligh hover:bg-gray-500'"
            v-on:click="toggleDropDownMenu">
            
            <BIconFilter class="w-7 h-7" />
          </button>

          <!--DropDown menu-->
          <div v-if="isToggleDropdown"
            class="block p-2 border border-solid border-gray-500 rounded lg:absolute lg:-right-28">
            <ul class="grid">
              <button class="btn btn-ligh mb-2 hover:bg-gray-500" @click="sort(true)">
                <li class="block">Hot</li>
              </button>
              <hr>
              <button class="btn btn-ligh mb-2 hover:bg-gray-500" @click="sort(false)">
                <li class="block">Dislike</li>
              </button>

            </ul>

          </div>
          <!--End toggle dropdown div-->
        </div>

      </div>

      <!--Main-->
      <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg"
        v-for="post in posts" :key="post.id">
        <!--Left side for like and dislike-->
        <div class="pr-1">
          <!--Like and dislike buttons-->
          <div class="grid items-center">
            <!--Like button-->
            <div class="">
              <button @click.prevent="
                postLikeOrDislikeForPost({
                  postId: post.id,
                  likeOrDislike: true,
                })
              " class="btn btn-ligh hover:bg-gray-500">
                <BIconArrowUp
                  :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserUpvoted(post.id) : 'text-gray-600'" />
              </button>
            </div>

            <!--Number of likes or dislikes-->
            <div>
              <span v-if="sumLikesOrDislikesOnPost(post) > 0 || sumLikesOrDislikesOnPost(post) < 0"
                :class="sumLikesOrDislikesOnPost(post) > 0 ? 'text-blue-600 grid justify-center' : 'text-red-600 grid justify-center'">{{
                sumLikesOrDislikesOnPost(post)
                }}</span>
              <span v-else class="grid justify-center">
                {{ 0 }}
              </span>
            </div>

            <!--Dislike button-->
            <div>
              <button @click.prevent="
                postLikeOrDislikeForPost({
                  postId: post.id,
                  likeOrDislike: false,
                })
              " class="btn btn-light hover:bg-gray-500">
                <BIconArrowDown
                  :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserDownVoted(post.id) : 'text-gray-600'" />

              </button>
            </div>
          </div>
        </div>

        <!--Posts-->
        <div class="sm:max-w-sm lg:max-w-lg">
          <router-link
            class="sm:max-w-sm lg:max-w-lg md:max-w-md rounded overflow-hidden shadow-lg divide-y-2 mx-auto my-2"
            :to="{ name: 'SinglePage', params: { id: post.id } }">
            <img class="lg:max-w-lg sm:sm:max-w-sm mb-3" :src="post.imageUrl" :alt="post.title">

            <!--Categories-->
            <div class="flex flex-wrap max-w-[600px]">
              <div class="px-6 pt-4 pb-2 w-1/3" v-for="category in post.categories" :key="category.id">
                <span
                  class="inline-block bg-gray-200 hover:bg-gray-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }"
                    class="btn btn-ligh " @click.prevent="getPostsByCategoryName(category.name)">#{{
                    category.name
                    }}</router-link>
                </span>
              </div>
            </div>

            <!--Text-->
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{{ post.title }}</div>
              <p class="text-gray-700 text-base">
                {{ post.text }}
              </p>
            </div>

            <!--User avatar and chat bubble (in future share link icon)-->
            <div class="flex justify-between pt-2">

              <!--User-->
              <router-link :to="{ path: '/user/' + post.postedBy.id }">
                <a class="btn btn-light flex hover:bg-gray-400">
                  <img class="w-10 h-10 border-solid border-2 border-gray-600 rounded-full"
                    :src="post.postedBy.imageUrl" alt="" />
                  <div class="flex">
                    <span class="self-center p-1">{{ post.postedBy.username }}</span>
                  </div>
                </a>
              </router-link>

              <!--Chat button-->
              <div class="w-fill">
                <button v-if="post.allowComments" class="btn btn-light hover:bg-gray-400">
                  <BIconChatFill /> {{ post.commentsDto.length }}
                </button>
              </div>

            </div>

          </router-link>

        </div>

        <!--left and right side same size 48px-->
        <div id="ghost-div" class="w-[48px]"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { mapState, mapActions } from "pinia";
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { useCategoryStore } from "../store/category-store";

//components
import {
  BIconChatFill,
  BIconFilter,
  BIconArrowUp,
  BIconArrowDown
} from "bootstrap-icons-vue";
import UserSignupModal from "@/User/components/modal/UserSignupModal.vue";

//types
import { FrontPagePost } from '@/Post/types';
import { PostedBy } from '@/User/types';


export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconArrowUp,
    BIconArrowDown,
    BIconChatFill,
    UserSignupModal,
    BIconFilter,
  },
  methods: {
    ...mapActions(usePostStore, [
      "postLikeOrDislikeForPost",
      "getNumberOfLikes",
      "getNumberOfDislikes",
      'sortPostsByNumberOfLikesOrDislikes',
      'sumLikesOrDislikesOnPost',
      'getPostsByCategoryName',
      'subscribeToTopic'
    ]),
    ...mapActions(useCategoryStore, ['fetchAllCategories']),
    getPostId: function (id: number) {
      return id;
    },
    exitedModal: function () {
      if (this.getCurrentlyLoggedUserProfile.id != 0) {
        this.isClose = true;
      }
    },
    sort: function (condition: boolean): void {
      this.sortPostsByNumberOfLikesOrDislikes(condition);
    },
    findLikeOrDislikedPost: function (postId: number): boolean | undefined {

      let result = this.getCurrentlyLoggedUserProfile.postLikeOrDislikeDtos.find(find => find.postId === postId);

      if (result === undefined) {
        return undefined;
      }

      return result.likeOrDislike;

    },
    checkIfUserUpvoted: function (postId: number): string {

      let find = this.findLikeOrDislikedPost(postId);
      //console.log("Upvote")

      if (find !== undefined && this.getCurrentlyLoggedUserProfile.id) {
        if (find)
          return 'up-vote-arrow';
      }

      return 'default-arrow';

    },
    checkIfUserDownVoted: function (postId: number): string {
      let find = this.findLikeOrDislikedPost(postId);

      if (find !== undefined && this.getCurrentlyLoggedUserProfile.id !== 0) {
        if (find === false)
          return 'down-vote-arrow';
      }
      return 'default-arrow';

    },

    cssForNumberOfLikes: function (numberOfLikesOrDislikes: number): string {
      if (numberOfLikesOrDislikes > 0) {
        return 'text-blue-500';
      } else if (numberOfLikesOrDislikes < 0) {
        return 'text-red-500';
      } else {
        return 'text-gray-600, text-center';
      }
    },
    toggleDropDownMenu: function (): void {
      this.isToggleDropdown = !this.isToggleDropdown;
    },
    temp: function() : void {
      this.isToggleDropdown = false;
    }
  },
  computed: {
    ...mapState(useAuthenticationStore, ["getCurrentlyLoggedUserProfile"]),
    ...mapState(useCategoryStore, ['getAllCategories']),
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
      isToggleDropdown: false
    };
  },
  mounted() {
    if (this.getCurrentlyLoggedUserProfile.id != 0) {
      this.isClose = true;
    }
    this.fetchAllCategories();
  },
  created() {
    this.subscribeToTopic('post');
  }
});
</script>

