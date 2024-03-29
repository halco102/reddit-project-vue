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
    <div class="lg:flex justify-evenly items-center gap-2 md:hidden sm:hidden">

      <VnavigationSearchBar />


      <!-- login/signup-->
      <div class="lg:flex mr-3" v-if="getCurrentlyLoggedUserProfile.id === 0">
        <UserLoginModal class="mx-2" />
        <UserSignupModal />
      </div>


      <VuserNotification :userProfile="getCurrentlyLoggedUserProfile" v-else />

    </div>


    <!--When screen is sm size show bell on middle of nav-bar-->
    <div class="lg:hidden md:visible sm:visible my-auto flex gap-2" v-if="getCurrentlyLoggedUserProfile.id !== 0">
      <div class="my-auto relative">
        <VButtonIcon :disabled=false :label=getAllNotifications.length class="hover:bg-white" :class="{
          'border rounded-md border-black bg-white':
            bellNotification
        }" @onClick="openCloseDropDown()">
          <template #icon>
            <BIconBell class="w-6 h-6" />
          </template>
        </VButtonIcon>

        <BellWithDropDown :notifications="getAllNotifications" :toggle="bellNotification" />
      </div>
      <div class="p-4">
        <VnavigationSearchBar />

      </div>
    </div>

    <!--When screen is sm show dropdown for login/signup or profile-->
    <div class="lg:hidden my-auto relative ">
      <BIconList class="w-10 h-10" @click="toogleDropDownMenu" />

      <div class="absolute p-4 bg-gray-400 bg-opacity-70 right-0 flex flex-col gap-4 rounded-md w-44"
        v-if="toggleDropDown">

        <div class="flex flex-col gap-4" v-if="getCurrentlyLoggedUserProfile.id === 0">
          <UserLoginModal @open="checkIfModalIsOpen" class="grid justify-center" />
          <UserSignupModal @open="checkIfModalIsOpen" class="grid justify-center" />
        </div>

        <div v-else class="flex flex-col gap-4 justify-center">
          <router-link :to="{ path: '/user/' + getCurrentlyLoggedUserProfile.id }">
            <div class="flex gap-2 hover:bg-gray-200 rounded-md">
              <span class="my-auto">{{ getCurrentlyLoggedUserProfile.username }}</span>
              <img :src="getCurrentlyLoggedUserProfile.imageUrl" class="w-12 h-12 border rounded-full" />
            </div>
          </router-link>
          <ButtonComponent :disabled=false title="Logout" @onClick="logoutAndRefreshSite" />
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
import ButtonComponent from "@/components/ButtonComponent.vue";
import VButtonIcon from "@/components/VButtonIcon.vue";
import VnavigationSearchBar from '@/components/navigation_bar/SearchBar.vue'
import VuserNotification from "./UserNotification.vue";
import { BIconList, BIconBell } from 'bootstrap-icons-vue';
import BellWithDropDown from '@/components/VdropDownComponent.vue';


export default defineComponent({
  name: "NavigationBar",
  components: {
    UserLoginModal,
    UserSignupModal,
    ButtonComponent,
    VButtonIcon,
    VnavigationSearchBar,
    VuserNotification,
    BIconList,
    BIconBell,
    BellWithDropDown
  },
  methods: {

    //...mapActions(usePostStore, ['searchPostByName']),
    ...mapActions(useAuthenticationStore, ['logout', 'checkedNewNotification']),
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
    toogleDropDownMenu: function () {
      this.toggleDropDown = !this.toggleDropDown;
    },
    toogleLoginSignupModal: function (): boolean {
      return true;
    },
    checkIfModalIsOpen: function (val: boolean): boolean {
      console.log("EMIT", val);
      return val;
    },
    openCloseDropDown: function (): void {
      console.log("Toogle")
      this.bellNotification = !this.bellNotification;
      this.checkedNewNotification();
    },
    newNotification: function (): string {
      if (this.getIsNewNotification) {
        return 'text-red-500';
      } else
        return ''
    },
  },
  computed: {
    ...mapState(useAuthenticationStore, ['getSuccessfullLogin', 'getCurrentlyLoggedUserProfile', 'getIsNewNotification', 'getAllNotifications']),
  },
  data() {
    return {
      isClose: false,
      searchQuery: '',
      toggleDropDown: false,
      bellNotification: false
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