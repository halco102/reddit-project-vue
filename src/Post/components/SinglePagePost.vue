<template>
  <div class="grid justify-center">

    <!--Post card-->
    <div class="sm:max-w-sm lg:max-w-2xl md:max-w-md rounded overflow-hidden shadow-lg  mx-auto my-6 ">
      <img :src="post.imageUrl" class="w-full h-full my-4" alt="..." />
      <div class="my-4 p-6">
        <h5 class="text-md font-medium text-center">{{ post.title }}</h5>
        <p v-if="post.text !== null" class="">{{ post.text }}</p>
      </div>
    </div>

    <!--Comment component-->
    <div class="text-center">
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

.post-div {
  margin: 2vh 5% 1vh 5%;
  padding: 1rem;
}
</style>