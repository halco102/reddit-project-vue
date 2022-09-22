<template>

  <router-link v-for="post in user.posts" :key="post.id" :to="{ name: 'SinglePage', params: { id: post.id } }">

    <!--Card-->
    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-[600px]">
      <div class="grid">

        <!--image-->
        <img :src="post.imageUrl" />

        <!--Content info and icons for delete & edit-->
        <div class="grid">

          <!--content info-->
          <div class="flex py-4 justify-center mb-2">
            <h5 >{{ post.title }}</h5>
            <p>
              {{ post.text }}
            </p>
          </div>

          <hr class="mb-2">

          <!--If the user is owner of the content show it-->
          <div class="flex justify-around w-1/4 m-auto" v-if="isCurrentUser">
            <div class="mx-2">
              <button class="hover:bg-gray-500 btn btn-ligh">
                <BIconTrash @click.prevent="deletePostById(post.id)" class="w-6 h-6 focus:bg-blue-900" />
              </button>
            </div>
            <div class="mx-2">
              <button @click="showModal = true" class="hover:bg-gray-500 btn btn-ligh">

                <router-link :to="{ name: 'UpdatePage', params: {
                  id: post.id,
                } }">
                  <BIconPencil class="w-6 h-6 focus:bg-blue-900" />
                </router-link>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>

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


export default defineComponent({
  name: "UserProfilePosts",
  components: {
    BIconTrash,
    BIconPencil,
  },
  methods: {
    ...mapActions(usePostStore, ['deletePostById']),
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
