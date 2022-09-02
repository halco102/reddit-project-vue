<template>
  <nav class="flex min-w-max bg-slate-500 h-16 justify-between">
    <div class="flex items-center mx-4">
      <a :href="$router.resolve({ name: 'Home' }).href">
        <img src="https://res.cloudinary.com/dzatojfyn/image/upload/v1660927409/redditLogo_psurpk.png"
          class="w-14 h-14">
      </a>

      <!--Show post button only when user logsin-->
      <div class="px-4" v-if="getSuccessfullLogin">
        <button class="btn btn-blue">
          Post
        </button>
      </div>
    </div>



    <!--other-->
    <div class="flex justify-evenly items-center">

      <!--Search bar-->
      <div class="flex">
        <form class="flex m-auto">
          <router-link :to="{ name: 'SearchGallery', query: { 'q': searchQuery }, params: { name: searchQuery } }"
            class="btn btn-outline-success mr-2">
            <BIconSearch />
          </router-link>
          <input v-model="searchQuery" class="form-control me-2" type="search" placeholder="Search"
            aria-label="Search" />
        </form>
      </div>

      <!-- login/signup-->
      <div class="flex mr-3" v-if="!getSuccessfullLogin">
        <UserLoginModal class="mx-2" />
        <UserSignupModal />
      </div>

      <!-- when user is logged in show his avatar and notification bell-->
      <div class="flex justify-envenlt items-center mr-20" v-else>
        <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
          <div v-show="getCurrentlyLoggedUserProfile.id != 0" class="flex items-center">
            <img :src="getCurrentlyLoggedUserProfile.imageUrl" class="w-14 h-14" />
            <!--
            <span class="mr-1 font-medium">{{
                getCurrentlyLoggedUserProfile.username
            }}</span>
            -->
          </div>
        </router-link>
        <div class="px-4">
          <BIconBell class="w-6 h-6" />
        </div>
        <div>
          <button class="btn btn-blue">
            Logout
          </button>
        </div>
      </div>

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
</style>