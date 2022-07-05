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
import NavigationBar from "@/components/NavigationBar.vue";
import PostsGallery from "@/Post/components/PostsGallery.vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { mapActions, mapState } from "pinia";
import { useAuthenticationStore } from "@/User/store/authentication_store";



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
    ...mapState(useAuthenticationStore, ["getCurrentlyLoggedUserProfile"]),
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
      console.log(this.getCurrentlyLoggedUserProfile.id)
      if (this.getCurrentlyLoggedUserProfile.id != 0) {
        if (
          to.fullPath != "/user/" + this.getCurrentlyLoggedUserProfile.id &&
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
