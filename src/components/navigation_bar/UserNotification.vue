<template>
    <div class="flex flex-row gap-6 mx-4">

        <!--User image-->
        <router-link :to="{ path: '/user/' + userProfile?.id }">
            <div class="flex gap-2 hover:bg-gray-200 rounded-md">
                <span class="my-auto">{{ userProfile.username }}</span>
                <img :src="userProfile.imageUrl" class="w-12 h-12 border rounded-full" />
            </div>
        </router-link>

        <div class="my-auto relative">
            <VButtonIcon class="hover:bg-white" :label="getAllNotifications.length" :customLabelCss="newNotification()"
                @onClick="openCloseDropDown()">
                <template #icon>
                    <BIconBell class="w-6 h-6" />
                </template>
            </VButtonIcon>

            <VdropDown :notifications="getAllNotifications" :toggle="toggleDropDown" />
        </div>

        <!--Logout bcs when this is show user is logged in :)-->
        <ButtonComponent title="Logout" :disabled="false" @onClick="logoutAndRefreshSite" />

    </div>
</template>

<script lang="ts">
import { UserProfile } from '@/User/types';
import { defineComponent } from 'vue';
import { BIconBell } from "bootstrap-icons-vue";
import ButtonComponent from '../ButtonComponent.vue';
import { mapActions, mapState } from 'pinia';
import { useAuthenticationStore } from '@/User/store/authentication_store';
import VButtonIcon from '@/components/VButtonIcon.vue'
import VdropDown from '@/components/VdropDownComponent.vue'



export default defineComponent({
    name: 'VuserNotification',
    components: {
        BIconBell,
        ButtonComponent,
        VButtonIcon,
        VdropDown
    },
    computed: {
        ...mapState(useAuthenticationStore, ['getAllNotifications', 'getIsNewNotification'])
    },
    data() {
        return {
            toggleDropDown: false
        }
    },
    props: {
        userProfile: {
            type: Object as () => UserProfile,
            required: true
        }
    },
    methods: {
        ...mapActions(useAuthenticationStore, ['subscribeToTopic', 'checkedNewNotification', 'fetchAllNotifications']),
        logoutAndRefreshSite: function (): void {
            sessionStorage.removeItem('jwt');
            this.$router.go(0);
        },
        newNotification: function (): string {
            if (this.getIsNewNotification) {
                return 'text-red-500';
            } else
                return ''
        },
        openCloseDropDown: function (): void {
            this.toggleDropDown = !this.toggleDropDown;
            this.checkedNewNotification();
        }
    },
    mounted() {
        console.log("Heey", this.userProfile)
        if (this.userProfile.id !== 0) {
            this.subscribeToTopic();
            this.fetchAllNotifications();
        }
    },
})
</script>