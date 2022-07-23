<template>
  <div class="main">
    <NavigationBar />
    <router-view :posts="getAllPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavigationBar from './components/NavigationBar.vue';
import { mapState, mapActions } from 'pinia';
import { usePostStore } from './Post/store/store';


export default defineComponent({
  name: 'App',
  components: {
    NavigationBar
  },
  computed: {
    ...mapState(usePostStore, ["getAllPosts"]),
  },
  methods: {
    ...mapActions(usePostStore, [
      "fetchAllPostToShow",
    ]),
  },
  beforeMount() {
    this.fetchAllPostToShow();
  },

});

</script>

<style>
#app html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
  /*background-color: rgba(28, 28, 28, 0.9) !important;*/
  background-color: #fff !important;
  width: 100%;
}

.main {
  overflow: hidden;
  width: 100%
}

.modal {
  width: 300px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
</style>
