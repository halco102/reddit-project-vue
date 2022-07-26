<template>

    <div class="wrapper">
        <div class="search-types">

            <router-link :to="{ name: 'SearchPosts', query: { q: name, searchType: 'posts' }, params: { name: name } }"
                class="btn btn-light custom">Post</router-link>
            <router-link :to="{ name: 'SearchUsers', query: { q: name, searchType: 'users' }, params: { name: name } }"
                class="btn btn-light custom">
                Users
            </router-link>

        </div>
        <div class="main-component">
            <router-view></router-view>
        </div>
    </div>


</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'SearchGallery',
    props: {
        name: {
            type: String,
            required: true
        }
    },
})

</script>

<style scoped>


.search-types {
    display: flex;
    justify-content: center;
}

.custom {
    border-radius: 20px;
    padding: 12px 20px;
    margin: 3rem;
    background-color: aquamarine;
}

.wrapper {
    margin-top: 3vh;
    display: grid;
    justify-items: center;
}
</style>