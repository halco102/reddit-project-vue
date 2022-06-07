<template>
  <div class="main">
    <NavigationBar />
    <PostsGallery :posts="getAllPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { _RouteLocationBase } from "vue-router";

//components
import NavigationBar from "./NavigationBar.vue";
import PostsGallery from "./PostsGallery.vue";

//pinia
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../store/UserStore";

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
      console.log(this.getUserId)
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
          console.log("User not logged in")
          this.$router.push('/')
        }
      }
    }
  },
});
</script>

<style scoped>
</style>
