<template>
  <div>
    <NavigationBar />
    <router-view :posts="getAllPosts" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavigationBar from './components/navigation_bar/NavigationBar.vue';
import { mapState, mapActions } from 'pinia';
import { usePostStore } from './Post/store/store';

import CustomWebsocket from '@/service/CustomWebsocket'


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
    const ws = CustomWebsocket.getInstance();

  },

});

</script>

<style>
.btn {
  @apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  /*@apply bg-blue-700;*/
  @apply bg-blue-700
}

.btn-disabled {
  @apply text-white font-bold rounded py-2 px-4 opacity-50 cursor-not-allowed
}
</style>
