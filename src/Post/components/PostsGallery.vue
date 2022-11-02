<template>

  <div id="main" class="md:flex lg:flex sm:grid justify-items-center">

    <div class="sm:hidden lg:block">
      <LoginAndCategories :categories="getAllCategories" />
    </div>
    <div class="lg:hidden md:hidden mt-10 border border-black rounded-sm ">
      <CarouselVue :categories="getAllCategories" />
    </div>


    <div class="grid flex-1 justify-center overflow-hidden">

      <!--Filter bit ce dropdown samo trebam skontati kako se to napravi-->
      <div class="flex justify-end mt-3 lg:relative">

        <div :class="isToggleDropdown ? 'grid' : ''">
          <button id="dropdownDefault"
            :class="isToggleDropdown ? 'btn btn-ligh hover:bg-gray-500 ml-auto sm:mb-1 lg:mb-0 bg-gray-500' : 'btn btn-ligh hover:bg-gray-500'"
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

          <template #image>
            <img class="xl:max-w-xl lg:max-w-lg sm:sm:max-w-sm mb-6 p-6 hover:cursor-pointer" :src="post.imageUrl"
              :alt="post.title">
          </template>

          <template #cardText>
            <div class="grid hover:bg-gray-300 hover:cursor-pointer">
              <Text class="text-center break-words" :title="post.title" :description="post.text" />
            </div>

          </template>

          <template #categories>
            <GenreCard :categories="post.categories" />
          </template>

          <template #cardIcons>
            <IconsForCard :post="post">
              <template #commentIcon v-if="post.allowComments">
                <router-link class="my-auto" :to="{ name: 'SinglePage', params: { id: post.id } }">
                  <VButtonIcon :disabled="false" class="hover:bg-gray-500" :label="post.commentsDto.length">
                    <template #icon>
                      <BIconChatFill class="w-5 h-5" />
                    </template>
                  </VButtonIcon>
                </router-link>
              </template>
            </IconsForCard>
          </template>

        </CustomCard>
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
import IconsForCard from '@/Post/components/CardIcons.vue'
import CustomCard from '@/components/CustomCard/Cards.vue'
import Text from "@/components/CustomCard/Text.vue";
import VButtonIcon from "@/components/VButtonIcon.vue";

//components
import {
  BIconChatFill,
  BIconFilter,
} from "bootstrap-icons-vue";
import LoginAndCategories from '@/Post/components/LeftSide/LoginAndCategories.vue'
import GenreCard from "./Categories/GenreCard.vue";
import CarouselVue from "@/components/Carousel.vue";

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
    IconsForCard,
    GenreCard,
    CarouselVue,
    VButtonIcon
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
      isToggleDropdown: false,
    };
  },
  mounted() {

    if (this.getCurrentlyLoggedUserProfile.id != 0) {
      this.isClose = true;
    }

    this.fetchAllCategories();


    setTimeout(() => {
      this.subscribeToTopic('post');
    }, 1000);
    this.subscribeToTopic('post/like-dislike');
  }
});
</script>

