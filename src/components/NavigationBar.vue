<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" :href="$router.resolve({ name: 'Home' }).href">Logo</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" :href="$router.resolve({ name: 'Home' }).href">Home</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'PostRequestPage' }">Post</router-link>
          </li>
        </ul>

        <!--search-->
        <form class="d-flex" style="margin:auto">
        

          <router-link :to="{ name: 'SearchGallery', query: { 'q': searchQuery }, params: {name : searchQuery} }"
            class="btn btn-outline-success" style="margin-right:0.5rem;">
            <BIconSearch />
          </router-link>
          <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search"
            aria-label="Search" />



        </form>

        <div class="second-type-login-signup" v-if="!exit()">
          <UserLoginModal />
          <UserSignupModal />
        </div>

        <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
          <div v-show="getCurrentlyLoggedUserProfile.id != 0" class="username-img">
            <img :src="getCurrentlyLoggedUserProfile.imageUrl" width="50" height="40" />
            <span class="navbar-text" style="margin-right: 2rem">{{
                getCurrentlyLoggedUserProfile.username
            }}</span>
          </div>
        </router-link>

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

//components
import UserLoginModal from "@/User/components/modal/UserLoginModal.vue";
import UserSignupModal from "@/User/components/modal/UserSignupModal.vue";
import { BIconSearch } from "bootstrap-icons-vue";


export default defineComponent({
  name: "NavigationBar",
  components: {
    UserLoginModal,
    UserSignupModal,
    BIconSearch
  },
  methods: {

    //...mapActions(usePostStore, ['searchPostByName']),
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
    reRoute: function (name: string): boolean {
      if (name.length > 0) {
        return true;
      }
      return false;
    }

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