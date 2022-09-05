<template>

  <div id="main" class="md:flex lg:flex sm:grid justify-items-center">

    <div id="categories-signup/login" class="grid sm:my-4 md:ml-4 lg:ml-6 w-64 h-fit lg:mt-16 justify-center">
      <!--Login and signup-->
      <div class="mb-3 text-center border-solid border-2 border-black py-4 rounded sm:m-auto sm:mb-2 sm:p-6">
        <h3>
          New to app? <br />
          Signup here<br />
        </h3>
        <UserSignupModal />
      </div>

      <!--categories-->
      <div class="sm:flex lg:grid border-solid border-2 rounded p-2 border-black">
        <button class="btn btn-blue mb-2 sm:mx-2 sm:px-6" v-for="category in getAllCategories" :key="category.id"
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

    <div class="grid flex-1 justify-center ">

      <!--Filter bit ce dropdown samo trebam skontati kako se to napravi-->
      <div class="flex justify-end mt-3 ">
        <button id="dropdownDefault" class="btn btn-ligh hover:bg-gray-500" data-dropdown-toggle="dropdown">
          <BIconFilter class="w-7 h-7" />
        </button>

        <div id="dropdown" class="hidden" aria-labelledby="dropdownDefault">
          <ul>
            <li>Item1</li>
            <li>Item2</li>
          </ul>
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
              <!--
              <span :class="cssForNumberOfLikes(sumLikesOrDislikesOnPost(post))">{{
                  sumLikesOrDislikesOnPost(post)
              }}</span>
              -->
              <span v-if="sumLikesOrDislikesOnPost(post) > 0"
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

<style scoped>
.signup-modal {
  margin-left: 0px;
}

.user-avatar {
  display: flex;
  margin-top: 1vh;
  margin-bottom: 1vh;
  justify-content: space-between;
}

.non-decorative-link a {
  text-decoration: none;
}

.non-decorative-link:hover {
  text-decoration: none;
  border-radius: 20px;
  border-style: solid;
  border-color: black;
  background-color: rgb(100, 100, 100);
}


.border-image {
  width: 50px;
  height: 50px;
  border-style: solid;
  border-color: black;
}

.like-dislike {
  display: grid;
}

.wrapper-post {
  display: grid;
  justify-content: center;
  padding: 25px 0px;
  margin: 2% 12%;
}

.buttons {
  margin-bottom: 2vh;
  padding-top: 15px;
}

.modal {
  position: absolute;
  display: grid;
}

.signup {
  margin-top: 5vh;
  width: 225px;
  border-style: solid;
  border-color: black;
  background-color: rgb(243 243 243);
  border-width: 1px;
  border-radius: 10px;
  padding: 25px;
  padding-top: 30px;
}

.signup p,
h3,
h4 {
  color: black;
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


.router-link {
  text-decoration: none;
  color: black;
}

.card-body-shaddow {
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
}

.divide-img-likes-dislikes {
  display: flex;
}

.chat-button {
  margin-top: 10px;
}

.chat-button a:hover {
  background-color: gray;
}

.image-div {
  margin: 1rem auto;
}

.down-vote-arrow {
  color: red;
}

.up-vote-arrow {
  color: blue;
}

.default-arrow {
  color: black;
}

.categories {
  display: flex;
  margin-top: 3vh;
  justify-content: end;
  padding-right: 0.6rem;
}

.category {
  margin: 0 5px;
}

.category button:hover {
  background-color: gray;
}

.wrapper {
  display: flex;
  margin-right: 19%;
  justify-content: space-evenly;
  padding-top: 7vh;
}

.categories-border {
  border-style: solid;
  border-color: black;
  display: grid;
  margin-top: 2vh;
  border-width: 1px;
  border-radius: 5px;
}

.categories-border a {
  text-decoration: none;
  color: black;
}

.categories-border button:hover {
  background-color: gray;
}

.like-dislike button:hover {
  background-color: gray;
}

.category-icon {
  display: flex;
}

.category-name {
  margin: auto 0 auto 1rem;
}
</style>