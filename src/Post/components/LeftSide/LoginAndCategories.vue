<template>
    <div id="categories-signup/login"
        class="grid sm:my-16 md:ml-26 lg:ml-26 xl:ml-32 w-64 h-fit lg:mt-16 justify-center xl:absolute lg:grid  ">

        <LoginAndSignup />

        <GenreSideBar :categories="categories" />

    </div>
</template>

<script lang="ts">
import { SingleCategory } from '@/Post/category-types';
import { defineComponent } from 'vue';
import GenreSideBar from '../Categories/GenreSideBar.vue';
import LoginAndSignup from '../LoginSignup/LoginAndSignup.vue';

    export default defineComponent({
        name: 'LoginAndCategories',
        props: {
            categories: Object as () => SingleCategory[]
        },
        components: {
            LoginAndSignup,
            GenreSideBar
        }

    })
</script>