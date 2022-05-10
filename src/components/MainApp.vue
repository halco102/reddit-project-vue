<template>
  <div class="main">
    <NavigationBar />
    <PostsGallery :posts="getAllPosts" @click="closeWebSocket()"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "./NavigationBar.vue";
import PostsGallery from "./PostsGallery.vue";
import { usePostStore } from "../store/PostStore";
import { mapActions, mapState } from "pinia";


//var ws = new WebSocket('ws://127.0.0.1:80/ws');

export default defineComponent({
  name: "MainApp",
  components: {
    NavigationBar,
    PostsGallery,
  },
  methods: {
    ...mapActions(usePostStore, ["fetchAllPostToShow", 'getEvent', 'openWebsocket', 'closeWebSocket']),
    stompConnection: function() {
      this.openWebsocket();
      /*
        ws.onopen = function() {
          console.log("Open ws");
        }; 
        */     

    },


  },
  computed: {
    ...mapState(usePostStore, ["getAllPosts"]),
  },
  created() {
    this.stompConnection();
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
