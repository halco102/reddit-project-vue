<template>
  <nav class="flex min-w-max bg-slate-500 h-16 justify-between">

    <!--Left side logo and post button-->
    <div class="flex items-center mx-4">

      <!--Logo-->
      <a :href="$router.resolve({ name: 'Home' }).href">
        <img src="https://res.cloudinary.com/dzatojfyn/image/upload/v1660927409/redditLogo_psurpk.png"
          class="w-14 h-14">
      </a>

      <!--Show post button only when user logsin-->
      <div class="px-4" v-if="getCurrentlyLoggedUserProfile.id !== 0">
        <router-link :to="{ name: 'PostRequestPage' }">
          <button class="btn btn-blue">
            Post
          </button>
        </router-link>
      </div>
    </div>

    <!--other-->
    <div class="flex justify-evenly items-center">

      <!--Search bar-->
      <div class="mx-2 block my-12">

        <form class="flex m-auto">

          <!--button of search icon-->
          <button class="sm:hidden lg:block font-bold py-2 px-4 rounded border-solid hover:bg-white border-2 mx-2">
            <router-link :to="{ name: 'SearchGallery', query: { 'q': searchQuery }, params: { name: searchQuery } }"
              class="">
              <BIconSearch />
            </router-link>
          </button>

          <button class="lg:hidden md:hidden font-bold py-2 px-4 rounded border-solid  border-2 mx-2 hover:bg-orange-500" @click="toggleMobile">
              <BIconSearch/>
          </button>

          <input v-model="searchQuery" class="rounded pl-2 sm:hidden lg:block md:block" type="search" placeholder="Search"
            aria-label="Search" />
        </form>

      </div>


      <!-- login/signup-->
      <div class="lg:flex mr-3" v-if="getCurrentlyLoggedUserProfile.id === 0">
        <UserLoginModal class="mx-2" />
        <UserSignupModal />
      </div>

      <!-- when user is logged in show his avatar and notification bell-->
      <div class="flex justify-envenlt items-center mr-20" v-else>
        <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
          <div v-show="getCurrentlyLoggedUserProfile.id !== 0" class="flex items-center">
            <img :src="getCurrentlyLoggedUserProfile.imageUrl" class="w-12 h-12 border rounded-full" />
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
          <button class="btn btn-blue" @click="logoutAndRefreshSite">
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
    BIconBell,
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
      sessionStorage.removeItem('jwt');
      this.$router.go(0);
    },
    reRoute: function (name: string): boolean {
      if (name.length > 0) {
        return true;
      }
      return false;
    },
    toggleMobile: function (): void {
      this.toggle = !this.toggle;
    }
  },
  computed: {
    ...mapState(useAuthenticationStore, ['getSuccessfullLogin', 'getCurrentlyLoggedUserProfile']),
  },
  data() {
    return {
      isClose: false,
      searchQuery: '',
      toggle: false
    }
  },
  watch: {
    getSuccessfullLogin: function (val: boolean): void {
      if (val) {
        console.log("succesfull relogin")
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