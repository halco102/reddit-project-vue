<template>
  <div class="single-post-div">
    <NavigationBar />
    <div class="post-div">
      <h1>{{ post.title }}</h1>
      <p>{{ post.text }}</p>
      <img :src="post.imageUrl" />
    </div>
    <CommentSection :post="post" />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";
import NavigationBar from "./NavigationBar.vue";
import CommentSection from "./Comment.vue";
import { useUserStore } from "../store/UserStore";

export default defineComponent({
  name: "App",
  components: {
    NavigationBar,
    CommentSection,
  },
  created() {
    let toNumber: number = parseInt(this.id!);
    console.log("toNumber ", toNumber)
    const getById = this.fetchPostById(toNumber);
  },
  props: {
    id: String,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchPostById"]),
  },
  computed: {
    ...mapState(usePostStore, ["post"]),
    ...mapState(useUserStore, ["user"]),
  },
});
</script>

<style scoped>

img {
  width: 638px;
  height: 677px;
}

.post-div {
  margin: 20px 0 40px 0;
  display:grid;
  justify-content:center;
  text-align:center;
}

.single-post-div p, h1{
  color: white;
}
</style>