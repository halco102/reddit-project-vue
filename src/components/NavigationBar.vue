<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }"
        >Logo</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'PostRequestPage' }"
              >Post</router-link
            >
          </li>
        </ul>

        <router-link :to="{ path: '/user/' + getUserLogin.userProfileDto.id }">
          <div
            class="username-img"
            v-show="getUserLogin.userProfileDto.id !== 0"
          >
            <img
              :src="getUserLogin.userProfileDto.imageUrl"
              width="50"
              height="40"
            />
            <span class="navbar-text" style="margin-right: 5px">{{
              getUserLogin.userProfileDto.username
            }}</span>
          </div>
        </router-link>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "../store/UserStore";
import { mapState } from "pinia";

export default defineComponent({
  name: "NavigationBar",
  components: {},
  methods: {
    refreshPage: function (): void {
      console.log("Refresh page");
      this.$router.go(0);
    },
  },
  computed: {
    ...mapState(useUserStore, ["getUserLogin"]),
  },
});
</script>

<style scope>
.move-right {
  float: right;
}
.username-img {
  display: flex;
}
</style>