<template>
  <div class="main-div">
      <NavigationBar/>
    <div class="user-information">
      <p>Username: {{ userProfile.username }}</p>
    </div>
    <div class="user-posts" v-if="userProfile.posts.length">
      <PostGallery :posts='userProfile.posts' :postedBy='getPostedBy()'/>
    </div>
    <div id="no-posts" v-else>
      <h3>User has no posts</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PostGallery from "./PostsGallery.vue"
import NavigationBar from './NavigationBar.vue'
import { useUserStore, PostedBy } from "../store/UserStore";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: "UserProfile",
  components: {
    PostGallery,
    NavigationBar
  },
  props: {
    userId: String,
  },
  methods: {
    ...mapActions(useUserStore, ["getUserByIdOrUsername"]),
    getPostedBy: function() : PostedBy{
        console.log("GetPostedBy", this.userProfile)
        return {
            id: this.userProfile.id,
            username: this.userProfile.username,
            imageUrl: this.userProfile.imageUrl
        }
    }
  },
  computed: {
    ...mapState(useUserStore, ["userProfile"]),
  },
  created() {
    let toNumber: number = parseInt(this.userId!);
    console.log("Get user by id ", toNumber);
    this.getUserByIdOrUsername(toNumber, null);
  },
  data() {
    return {
      id: 0
    }
  }
});
</script>

<style scoped>
</style>
