<template>
    <div class="flex flex-row gap-6 mx-4">

        <!--User image-->
        <router-link :to="{ path: '/user/' + userProfile?.id }">
            <div>
                <img :scr="userProfile.imageUrl" class="w-12 h-12 border rounded-full" />
            </div>
        </router-link>

        <!--Bell-->
        <div class="my-auto">
            <!--For now ill leave it like an icon with no connection, have to finish be after fe-->
            <BIconBell class="w-6 h-6" />
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



export default defineComponent({
    name: 'VuserNotification',
    components: {
        BIconBell,
        ButtonComponent
    },
    props: {
        userProfile: {
            type: Object as () => UserProfile,
            required: true
        }
    },
    methods: {
        logoutAndRefreshSite: function (): void {
            sessionStorage.removeItem('jwt');
            this.$router.go(0);
        },
    },
    mounted() {
        console.log("Heey", this.userProfile)
    }
})
</script>