<template>
  <div class="main-div">
    <div class="wrapper">
      <div class="left-side">
        <div class="signup">
          <h3>
            New to app? <br />
            Signup here<br />
          </h3>
          <UserSignupModal />
        </div>

        <div class="categories-border">
          
          <button class="btn btn-light" v-for="category in getAllCategories" :key="category.id"
            @click.prevent="getPostsByCategoryName(category.name)">
            <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }">
              <div class="category-icon">
                <img :src="category.iconUrl" style="width: 50px" />
                <div class="category-name"><span>{{ category.name }}</span></div>
              </div>
            </router-link>

          </button>

        </div>

      </div>
      <div class="right-side">
        <img style="display: grid" v-if="posts!.length === 0"
          src="https://res.cloudinary.com/dzatojfyn/image/upload/v1652251254/ui7ainqdeponxlukizk2.png" />

        <div class="dropdown" v-if="posts!.length != 0">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
            data-bs-toggle="dropdown" aria-expanded="false">
            <BIconFilter />
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" @click="sort(true)">Hot</a></li>
            <li><a class="dropdown-item" @click="sort(false)">Disliked</a></li>
          </ul>
        </div>

        <div class="posts" v-if="posts !== undefined">
          <!-- cards -->
          <router-link class="router-link" :to="{ name: 'SinglePage', params: { id: post.id } }" v-for="post in posts"
            :key="post.id">
            <div class="card" style="width: 50rem; margin: 0 auto 20px auto">


              <div class="divide-img-likes-dislikes">

                <div class="like-dislike">

                  <div class="buttons">

                    <div style="text-align: center;">
                      <!-- like button -->
                      <div class="like-button">
                        <button @click.prevent="
                          postLikeOrDislikeForPost({
                            postId: post.id,
                            likeOrDislike: true,
                          })
                        " class="btn btn-light bicon-reply-button" style="margin: 0px 10px 0 10px">
                          <BIconArrowUp
                            :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserUpvoted(post.id) : 'default-arrow'" />
                        </button>
                      </div>

                      <!-- sum likes or dislikes-->
                      <span style="text-align: center;" :class="cssForNumberOfLikes(sumLikesOrDislikesOnPost(post))">{{
                          sumLikesOrDislikesOnPost(post)
                      }}</span>

                      <!-- dislike button -->
                      <div class="dislike-button">
                        <button @click.prevent="
                          postLikeOrDislikeForPost({
                            postId: post.id,
                            likeOrDislike: false,
                          })
                        " class="btn btn-light bicon-reply-button" style="margin: 0px 10px 0 10px">
                          <BIconArrowDown
                            :class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserDownVoted(post.id) : 'default-arrow'" />

                        </button>
                      </div>

                      <!--:class="getCurrentlyLoggedUserProfile.id !== 0 ? checkIfUserDownVoted(post.id) : 'default-arrow'" />-->

                    </div>

                  </div>
                </div>

                <div class="image-div">
                  <div class="card-body card-body-shaddow">
                    <h3 class="card-title" style="text-align:center;">{{ post.title }}</h3>
                  </div>

                  <!-- show image of the post-->
                  <img v-bind:src="post.imageUrl" class="card-img-top" alt="" />
                </div>

              </div>

              <!-- Categories -->
              <div class="categories">
                <div class="category" v-for="category in post.categories" :key="category.id">

                  <router-link :to="{ name: 'FilterCategories', query: { category: category.name } }" class="btn btn-light"
                    @click.prevent="getPostsByCategoryName(category.name)">{{
                        category.name
                    }}</router-link>
                </div>
              </div>


              <div class="card-body card-body-shaddow">


                <p class="card-text">{{ post.text }}</p>

                <hr>

                <!-- show first posted by clickable image (route them to user profile) -->
                <div class="user-avatar">
                  <router-link :to="{ path: '/user/' + post.postedBy.id }">
                    <a class="btn btn-light non-decorative-link" style="margin: 0px 10px 0 10px">
                      <img class="rounded-circle border-image" :src="post.postedBy.imageUrl" alt="" />
                      {{ post.postedBy.username }}
                    </a>
                  </router-link>
                  <!--Chat button-->
                  <div class="chat-button">
                    <a v-if="post.allowComments" class="btn btn-light">
                      <BIconChatFill /> {{ post.commentsDto.length }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
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
        return 'up-vote-arrow';
      } else if (numberOfLikesOrDislikes < 0) {
        return 'down-vote-arrow';
      } else {
        return 'default-arrow';
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

.categories-border a{
  text-decoration: none;
  color:black;
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