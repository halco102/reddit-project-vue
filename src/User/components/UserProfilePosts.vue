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
            <div class="icon-wrapper" v-if="isCurrentUser">
              <div class="icon">
                <button>
                  <BIconTrash @click.prevent="deletePostById(post.id)" color="#0d6efd" width="25px" height="25px" />
                </button>
              </div>
              <div class="icon">
                <button @click="showModal = true">

                  <router-link :to="{ name: 'UpdatePage', params: {
                    id: post.id,
                  } }">
                    <BIconPencil color="#0d6efd" width="20px" height="20px" />
                  </router-link>

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

//components
import UpdatePostModal from '@/Post/components/modal/UpdatePostModal.vue';

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
    posts: Object as () => UserPosts[],
    isCurrentUser: Boolean
  },
  data() {
    return {
      showModal: false
    }
  }
});
</script>

<style scoped>
.card-body-shaddow {
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  margin-bottom: 3vh;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
}

.icon button {
  border: none;
  background: none;
  margin: 0 1rem;
}

.icon:hover {
  background-color: gray;
}
</style>