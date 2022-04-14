<template>
  <div class="nav-bar">
    <nav class="nav nav-pills flex-column flex-sm-row">

      <router-link to="/" name="Home" class="flex-sm-fill text-sm-center nav-link">Home</router-link>
    
      <a
        v-show="user.id != 0"
        class="flex-sm-fill text-sm-center nav-link"
        href="#"
        >Logout</a
      >
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "NavigationBar",
  components: {},
  methods: {},
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
});
</script>

<style>
</style>