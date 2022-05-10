<template>
  <div class="main">
    <NavigationBar />
    <div class="single-post-div">
      <div class="post-div">
        <h1>{{ post.title }}</h1>
        <p>{{ post.text }}</p>
        <img :src="post.imageUrl" />
        <div class="delete-icon-wrapper">
          <div class="delete-icon">
            <span style="color:white">Delete post</span>
            <button style="border:none; background:none">
              <BIconTrash @click="deletePost(post.id)" color="#0d6efd" width="25px" height="25px" />
            </button>
          </div>
        </div>
      </div>
      <CommentSection :post="post" />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";
import NavigationBar from "./NavigationBar.vue";
import CommentSection from "./Comment.vue";
import { useUserStore } from "../store/UserStore";
import { BIconTrash } from "bootstrap-icons-vue";

export default defineComponent({
  name: "App",
  components: {
    NavigationBar,
    CommentSection,
    BIconTrash,
  },
  created() {
    let toNumber: number = parseInt(this.id!);
    console.log("toNumber ", toNumber);
    const getById = this.fetchPostById(toNumber);
  },
  props: {
    id: String,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchPostById",'deletePostById']),
    deletePost: function(id: number) {
      this.deletePostById(id);
      if (this.getIsDeleted) {
        this.$router.push('/')
      }
    }
  },
  computed: {
    ...mapState(usePostStore, ["post", 'getIsDeleted']),
    ...mapState(useUserStore, ["user"]),
  },
});
</script>

<style scoped>
img {
  width: 638px;
  height: 677px;
}

.single-post-div {
  margin: 20px 0 40px 0;
  /*display:grid;
  justify-content:center;*/
  text-align: center;
}

.single-post-div p,
h1 {
  color: white;
}

.delete-icon-wrapper {
  margin-left: 24.6%;
  margin-right: 25%;

}

.delete-icon {
  display: flex;
  justify-content: end;
  margin-top: 1rem;
}
</style>