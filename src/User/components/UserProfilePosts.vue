<template>

  <div class="user-profile-posts">
    <router-link v-for="post in posts" :key="post.id" :to="{ name: 'SinglePage', params: { id: post.id } }">
      <div class="content card-body-shaddow ">
        <div class="card" style="width: 35rem">
          <img :src="post.imageUrl" />
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text" style="color: black">
              {{ post.text }}
            </p>
            <div class="delete-icon-wrapper" v-if="isCurrentUser">
              <div class="delete-icon">
                <button style="border: none; background: none">
                  <BIconTrash @click.prevent="deletePostById(post.id)" color="#0d6efd" width="25px" height="25px" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>

</template>


<script lang="ts">
import { usePostStore } from "@/Post/store/store";
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { UserPosts } from "@/Post/types";
import { BIconTrash } from "bootstrap-icons-vue";

export default defineComponent({
  name: "UserProfilePosts",
  components: {
    BIconTrash
  },
  methods: {
    ...mapActions(usePostStore, ['deletePostById']),

  },
  props: {
    posts: Object as () => UserPosts[],
    isCurrentUser: Boolean
  }
});
</script>

<style scoped>
.card-body-shaddow {
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  margin-bottom: 3vh;
}
</style>