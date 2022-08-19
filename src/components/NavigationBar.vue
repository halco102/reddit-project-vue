<template>
  <nav class="flex min-w-max bg-slate-500 h-16 justify-between">
    <div class="flex items-center mx-4">
      <a :href="$router.resolve({ name: 'Home' }).href">
        <img src="https://res.cloudinary.com/dzatojfyn/image/upload/v1660927409/redditLogo_psurpk.png"
          class="w-14 h-14">
      </a>

      <!--Show post only when user logsin-->
      <div class="px-4" v-if="getSuccessfullLogin">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
          Post
        </button>
      </div>
    </div>

    <!--Search bar-->
    <div class="flex">
      <form class="flex m-auto">
        <router-link :to="{ name: 'SearchGallery', query: { 'q': searchQuery }, params: { name: searchQuery } }"
          class="btn btn-outline-success" style="margin-right:0.5rem;">
          <BIconSearch />
        </router-link>
        <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
      </form>
    </div>

    <!--other-->
    <div class="flex justify-evenly items-center">

      <!-- login/signup-->
      <div class="flex mr-3" v-if="!getSuccessfullLogin">
        <UserLoginModal />
        <UserSignupModal />
      </div>

      <!-- when user is logged in show his avatar and notification bell-->
      <div class="flex justify-envenlt items-center mr-20" v-else>
        <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
          <div v-show="getCurrentlyLoggedUserProfile.id != 0" class="flex items-center">
            <img :src="getCurrentlyLoggedUserProfile.imageUrl" class="w-14 h-14" />
            <span class="mr-1 font-medium">{{
                getCurrentlyLoggedUserProfile.username
            }}</span>
          </div>
        </router-link>
        <div class="px-4">
          <BIconBell class="w-6 h-6" />
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
            Logout
          </button>
        </div>
      </div>

    </div>

  </nav>

  <!--

  <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <a class="flex items-center" :href="$router.resolve({ name: 'Home' }).href">Logo</a>

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

        <form class="d-flex" style="margin:auto">
          <router-link :to="{ name: 'SearchGallery', query: { 'q': searchQuery }, params: { name: searchQuery } }"
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
            <span class="navbar-text" style="margin-right: 1rem">{{
                getCurrentlyLoggedUserProfile.username
            }}</span>
            <div class="notification-bell">
              <BIconBell width="20px" height="20px" />
            </div>
          </div>
        </router-link>

      </div>

      <button v-show="getCurrentlyLoggedUserProfile.id != 0" class="btn btn-primary" style="margin-right:1rem;"
        @click="logoutAndRefreshSite">Logout</button>
    </div>
  </nav>
  -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

//pinia
import { useAuthenticationStore } from "@/User/store/authentication_store";
import { mapState, mapActions } from "pinia";

//components
import UserLoginModal from "@/User/components/modal/UserLoginModal.vue";
import UserSignupModal from "@/User/components/modal/UserSignupModal.vue";
import { BIconSearch, BIconBell } from "bootstrap-icons-vue";




export default defineComponent({
  name: "NavigationBar",
  components: {
    UserLoginModal,
    UserSignupModal,
    BIconSearch,
    BIconBell
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
    },
  },
  computed: {
    ...mapState(useAuthenticationStore, ['getSuccessfullLogin', 'getCurrentlyLoggedUserProfile']),
  },
  data() {
    return {
      isClose: false,
      searchQuery: '',
    }
  },
  watch: {
    getSuccessfullLogin: function (val: boolean): void {
      if (val) {
        //this.openWebsocket();
      }
    }
  },
  created() {
    //this.openWebsocket();
  }

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

.notification-bell {
  margin: auto;
  padding-right: 10px;

}
</style>