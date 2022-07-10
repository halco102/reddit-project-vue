<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }" >Logo</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }" >Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'PostRequestPage' }">Post</router-link>
          </li>
        </ul>

        <div class="second-type-login-signup" v-if="!exit()">
          <UserLoginModal />
          <UserSignupModal />
        </div>

        <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
          <div v-show="getCurrentlyLoggedUserProfile.id != 0" class="username-img">
            <img :src="getCurrentlyLoggedUserProfile.imageUrl" width="50" height="40" />
            <span class="navbar-text" style="margin-right: 5px">{{
                getCurrentlyLoggedUserProfile.username
            }}</span>
          </div>
        </router-link>
        <form class="d-flex">
          <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search"
            aria-label="Search" />
          <button class="btn btn-outline-success" type="submit"
            @click.prevent="searchPostByName(searchQuery)">Search</button>
        </form>
      </div>

      <button v-show="getCurrentlyLoggedUserProfile.id != 0" class="btn btn-primary"
        @click="logoutAndRefreshSite">Logout</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapState, mapActions } from "pinia";
import { usePostStore } from "@/Post/store/store";

//components
import UserLoginModal from "@/User/components/modal/UserLoginModal.vue";
import UserSignupModal from "@/User/components/modal/UserSignupModal.vue";

export default defineComponent({
  name: "NavigationBar",
  components: {
    UserLoginModal,
    UserSignupModal,
  },
  methods: {

    ...mapActions(usePostStore, ['searchPostByName']),
    ...mapActions(useAuthenticationStore, ['logout']),

    exit: function (): boolean {

      if (this.getCurrentlyLoggedUserProfile.id != 0) {
        return true;
      }
      return false;
    },
    logoutAndRefreshSite: function (): void {
      this.logout;
      this.$router.go(0);
    },

  },
  computed: {
    ...mapState(useAuthenticationStore, ['getSuccessfullLogin', 'getCurrentlyLoggedUserProfile']),
  },
  data() {
    return {
      isClose: false,
      searchQuery: ''
    }
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

.second-type-login-signup {
  display: flex;
  margin-right: 10px;
}

.second-type-login-signup UserLoginModal {
  margin: 10px;
}

.signup-modal {
  margin-left: 10px;
}
</style>