<template>
    <!--Login and signup-->
    <div
        class="mb-3 text-center border-solid border-2 border-black py-4 rounded sm:m-auto sm:mb-2 sm:p-6 lg:mx-0 lg:mb-2 md:mx-0 md:mb-2">
        <h3>
            New to app? <br />
            Signup here<br />
        </h3>
        <UserSignupModal />
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

import UserSignupModal from '@/User/components/modal/UserSignupModal.vue';


export default defineComponent({
    name: 'LoginAndSignup',
    components: {
        UserSignupModal
    }
})
</script>