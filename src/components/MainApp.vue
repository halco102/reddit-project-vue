<template>
  <div class="main">
    <NavigationBar />
    <PostsGallery :posts="getAllPosts" />

    <p> Test stomp nginx + spring stomp </p>

    <button @click="subscribeToWs"> Subscribe to hear latest news </button>
    <button @click="sendMessage"> Send data over stomp </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import PostsGallery from "./PostsGallery.vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";

//for stomp
import * as Stomp from 'webstomp-client';

let client : Stomp.Client;
//end

export default defineComponent({
  name: "MainApp",
  components: {
    NavigationBar,
    PostsGallery,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchAllPostToShow", 'getEvent', 'openWebsocket', 'closeWebSocket', 'subscribeToWs', 'sendMessage']),

  },
  beforeUnmount(){
    console.log("Close Mainapp websocket");
    //this.closeWebSocket();
  },
  computed: {
    ...mapState(usePostStore, ["getAllPosts"]),
  },
  created() {
    this.openWebsocket();
  },
  beforeMount(){
    console.log("before mount");
    this.fetchAllPostToShow();
  },
  updated(){
    console.log('update');
    this.getEvent();
  },
  data() {
    return{
      isUpdate : false
    }
  }

});
</script>

<style scoped>

</style>
