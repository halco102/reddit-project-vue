<template>
  <nav class="flex min-w-max bg-slate-500 h-16 justify-between px-8">

    <!--Left side logo and post button-->
    <div class="flex items-center mx-4">

      <!--Logo-->
      <a :href="$router.resolve({ name: 'Home' }).href">
        <VButtonIcon>
          <template #icon>
            <img src="https://res.cloudinary.com/dzatojfyn/image/upload/v1660927409/redditLogo_psurpk.png"
              class="w-14 h-14">
          </template>
        </VButtonIcon>
      </a>

      <!--Show post button only when user logsin-->
      <div class="px-4" v-if="getCurrentlyLoggedUserProfile.id !== 0">
        <router-link :to="{ name: 'PostRequestPage' }">
          <ButtonComponent title="Post" :disabled="false">
          </ButtonComponent>
        </router-link>
      </div>
    </div>


    <!--other-->
    <div class="flex justify-evenly items-center gap-2">

      <VnavigationSearchBar />


      <!-- login/signup-->
      <div class="lg:flex mr-3" v-if="getCurrentlyLoggedUserProfile.id === 0">
        <UserLoginModal class="mx-2" />
        <UserSignupModal />
      </div>


      <VuserNotification :userProfile="getCurrentlyLoggedUserProfile" v-else />

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
import ButtonComponent from "@/components/ButtonComponent.vue";
import VButtonIcon from "@/components/VButtonIcon.vue";
import VnavigationSearchBar from '@/components/navigation_bar/SearchBar.vue'
import VuserNotification from "./UserNotification.vue";



export default defineComponent({
  name: "NavigationBar",
  components: {
    UserLoginModal,
    UserSignupModal,
    ButtonComponent,
    VButtonIcon,
    VnavigationSearchBar,
    VuserNotification
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