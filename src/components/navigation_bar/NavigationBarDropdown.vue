<template>
    <div class="flex flex-col gap-4 px-3 absolute bg-gray-400 -left-7 top-[51px]" v-if="toggleDropDown">
        <UserLoginModal />
        <UserSignupModal />
    </div>
    <div :class="{ 'bg-blue-400 roundend-md': toggleDropDown }">
        <BIconList class="w-10 h-10" />
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import UserLoginModal from "@/User/components/modal/UserLoginModal.vue";
import UserSignupModal from "@/User/components/modal/UserSignupModal.vue";
import { BIconList } from 'bootstrap-icons-vue';

export default defineComponent({
    name: 'NavigationBarDropDown',
    components: {
        UserLoginModal,
        UserSignupModal,
        BIconList
    },
    props: {
        toggleDropDown: {
            type: Boolean,
            required: true
        }
    },
})
</script>