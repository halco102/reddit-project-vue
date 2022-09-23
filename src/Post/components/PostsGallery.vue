<template>

  <div id="main" class="md:flex lg:flex sm:grid justify-items-center">

    <LoginAndCategories :categories="getAllCategories" />


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

      <div v-for="post in posts" :key="post.id">
        <CustomCard :post="post" :hasLikeAndDislike="true" :currentlyLoggedUser="getCurrentlyLoggedUserProfile"
          :hasCategories="true" :hasCardIcons="true">

          <template #cardText>
            <Text :title="'test'" :description="'testign'" />
          </template>

          <template #cardIcons>
            <IconsForCard :post="post">
              <template #commentIcon>
                <ButtonComponent :disabled="false" >
                  <template #icon>
                    <BIconChatFill class="w-4 h-4" />
                  </template>
                </ButtonComponent>
              </template>
            </IconsForCard>
          </template>

        </CustomCard>
      </div>
      <!--Main
      <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg"
        v-for="post in posts" :key="post.id">

        <LikeDislikeComponentVue :post="post" :getCurrentlyLoggedUserProfile="getCurrentlyLoggedUserProfile" />

        <div class="sm:max-w-sm lg:max-w-lg">
          <router-link
            class="sm:max-w-sm lg:max-w-lg md:max-w-md rounded overflow-hidden shadow-lg divide-y-2 mx-auto my-2"
            :to="{ name: 'SinglePage', params: { id: post.id } }">

            <img class="lg:max-w-lg sm:sm:max-w-sm mb-3" :src="post.imageUrl" :alt="post.title">

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

            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2 text-center">{{ post.title }}</div>
              <p class="text-gray-700 text-base break-words">
                {{ post.text }}
              </p>
            </div>



            <IconsForCard :post="post">
              <template #icon>
                <button v-if="post.allowComments" class="btn btn-light hover:bg-gray-400">
                  <BIconChatFill /> {{ post.commentsDto.length }}
                </button>
              </template>
            </IconsForCard>

          </router-link>

      </div>
-->

      <!--left and right side same size 48px-->
      <div id="ghost-div" class="w-[48px]"></div>
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
import IconsForCard from '@/Post/components/CardIcons.vue'
import CustomCard from '@/components/CustomCard/Cards.vue'
import Text from "@/components/CustomCard/Text.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";

//components
import {
  BIconChatFill,
  BIconFilter,
} from "bootstrap-icons-vue";
import LikeDislikeComponentVue from "./LikeDislikeComponent.vue";
import LoginAndCategories from '@/Post/components/LeftSide/LoginAndCategories.vue'

//types
import { FrontPagePost } from '@/Post/types';
import { PostedBy } from '@/User/types';


export default defineComponent({
  name: "PostsGallery",
  components: {
    BIconChatFill,
    BIconFilter,
    LoginAndCategories,
    CustomCard,
    Text,
    ButtonComponent,
    IconsForCard
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
    temp: function (): void {
      this.isToggleDropdown = false;
    },
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


    this.subscribeToTopic('post')


    if (this.getCurrentlyLoggedUserProfile.id != 0) {
      this.isClose = true;
    }
    this.fetchAllCategories();

  },
});
</script>

