<template>
  <div class="flex justify-around my-6">
    <p>{{events}}</p>

    <router-link :to="{ name: 'FilterPosts', query: {filter: 'posts'} }" >
      <button :class="events.isPost ? 'btn btn-ligh hover:bg-gray-500 bg-gray-500' : 'btn btn-ligh hover:bg-gray-500'">Posts</button>
    </router-link>

    <router-link :to="{ name: 'FilterComments', query : {filter: 'comments'} }">
      <button :class="events.isComment ? 'btn btn-ligh hover:bg-gray-500 bg-gray-500' : 'btn btn-ligh hover:bg-gray-500'">Comments</button>
    </router-link>


  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserProfileBar",
  methods: {

    postOrCommentClicked(args: number): void {
      console.log("temp")

      if (args === 1) {
        console.log("Post clicked");
        this.events.isComment = false;
        this.events.isPost = true;
        this.$emit("postOrComment", this.events);
      } else {
        console.log("comment clicked");
        this.events.isComment = true;
        this.events.isPost = false;

        console.log("Event to sent", this.events)

        this.$emit("postOrComment", this.events)
      }
    }
  },
  data() {
    return {

      events: {
        isPost: true,
        isComment: false
      }
    }
  }
});

</script>
