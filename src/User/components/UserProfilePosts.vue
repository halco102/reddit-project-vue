<template>

  <div v-for="post in user.posts" :key="post.id">

    <!--Card-->
    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-[600px]">
      <div class="grid">

        <!--image-->
        <img :src="post.imageUrl" @click="pushRouterToSinglePagePost(post.id)" class="hover:cursor-pointer" />

        <!--Content info and icons for delete & edit-->
        <div class="grid">

          <!--content info-->
          <div class="flex py-4 justify-center mb-2 hover:cursor-pointer hover:bg-gray-500 hover:rounded-sm hover:my-1"
            @click="pushRouterToSinglePagePost(post.id)">
            <h5>{{ post.title }}</h5>
            <p>
              {{ post.text }}
            </p>
          </div>

          <hr class="mb-2">

          <!--If the user is owner of the content show it-->
          <div class="flex justify-around w-1/4 m-auto" v-if="isCurrentUser">
            <div class="mx-2">
              <VButtonIcon class="hover:bg-gray-500 px-4 z-50" @onClick="deletePostById(post.id)">
                <template #icon>
                  <BIconTrash class="w-6 h-6 focus:bg-blue-900" />
                </template>
              </VButtonIcon>
            </div>
            <div class="mx-2">
              <button @click="showModal = true" class="hover:bg-gray-500 btn btn-ligh">

                <router-link :to="{
                  name: 'UpdatePage', params: {
                    id: post.id,
                  }
                }">
                  <BIconPencil class="w-6 h-6 focus:bg-blue-900" />
                </router-link>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script lang="ts">
//vue
import { defineComponent } from "vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { mapActions } from "pinia";

//types
import { UserPosts } from "@/Post/types";

//bootstrap icons
import { BIconPencil } from "bootstrap-icons-vue";
import { BIconTrash } from "bootstrap-icons-vue";
import { UserProfile } from "../types";
import VButtonIcon from '@/components/VButtonIcon.vue';


export default defineComponent({
  name: "UserProfilePosts",
  components: {
    BIconTrash,
    BIconPencil,
    VButtonIcon
  },
  methods: {
    ...mapActions(usePostStore, ['deletePostById']),
    pushRouterToSinglePagePost: function (postId: number): void {
      this.$router.push({ name: 'SinglePage', params: { id: postId } });
    }
  },
  props: {
    isCurrentUser: Boolean,
    user: {
      type: Object as () => UserProfile,
      required: true
    }
  },
  data() {
    return {
      showModal: false
    }
  },
});
</script>
