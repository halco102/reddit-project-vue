<template>
  <div class="main">
    <router-view>
      <NavigationBar />
      <PostsGallery :posts = 'posts'/>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import PostsGallery from "./PostsGallery.vue";
import {usePostStore} from '../store/PostStore'
import {mapActions, mapState} from 'pinia'

export default defineComponent({
  name: "MainApp",
  components: {
    NavigationBar,
    PostsGallery,
  },
  methods: {
    ...mapActions(usePostStore, ['fetchAllPostToShow']),
  },
  computed: {
    ...mapState(usePostStore, ['posts'])
  },
  created() {
    this.fetchAllPostToShow();
  }
});
</script>

<style scoped>

</style>
