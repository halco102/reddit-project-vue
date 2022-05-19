<template>
  <div class="main">
    <NavigationBar />
    <PostsGallery :posts="getAllPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import PostsGallery from "./PostsGallery.vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../store/UserStore";
import { _RouteLocationBase } from "vue-router";

export default defineComponent({
  name: "MainApp",
  components: {
    NavigationBar,
    PostsGallery,
  },
  methods: {
    ...mapActions(usePostStore, [
      "fetchAllPostToShow",
      "openWebsocket",
      'disconnectFromWs'
    ]),
  },
  computed: {
    ...mapState(usePostStore, ["getAllPosts"]),
    ...mapState(useUserStore, ["getUserId"]),
  },
  beforeMount() {
    this.fetchAllPostToShow();
  },
  data() {
    return {
      isUpdate: false,
    };
  },
  created() {
    this.openWebsocket();
  },
  watch: {
    $route(to: _RouteLocationBase) {
      if (this.getUserId != 0) {
        if (
          to.fullPath != "/user/" + this.getUserId &&
          to.fullPath != "/post"
        ) {
          console.log("Disconnect", to.fullPath)
          this.disconnectFromWs();
        }
      }else{
        if (to.fullPath == '/post') {
          console.log("No logged user, do nothing")
          //this.disconnectFromWs();
        }
      }
    }
  },
});
</script>

<style scoped>
</style>
