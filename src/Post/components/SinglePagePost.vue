<template>
  <div class="main">
    <div class="single-post-div">
      
      <div class="card post-div">
        <img :src="post.imageUrl" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">{{ post.title }}</h5>
          <p v-if="post.text !== null" class="card-text" style="color:black;">{{ post.text }}</p>
        </div>
      </div>

        <CommentSection :post="post" />
      
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

//pinia
import { usePostStore } from "@/Post/store/store";
import { useUserStore } from "@/User/store/store";
import { mapActions, mapState } from "pinia";

//components
import CommentSection from "@/Comment/components/Comment.vue";


export default defineComponent({
  name: "App",
  components: {
    CommentSection,
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
  /*width: 638px;
  height: 677px;*/
  max-width: 100%;
  height: auto;
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

.post-div{
  margin:2vh 5% 1vh 5%;
  padding: 1rem;
}
</style>