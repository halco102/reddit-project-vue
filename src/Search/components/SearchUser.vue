<template>
    <div v-for="(user) in getAllUsers" :key="user.id">
        {{user.username}}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "../store/search-store";
import { SearchTypes } from "../type";


export default defineComponent({

    name: 'SearchUser',
    methods: {
        ...mapActions(useSearchStore, ['searchPostsOrUsersByName'])
    },
    computed: {
        ...mapState(useSearchStore, ['getAllUsers'])
    },
    mounted() {
        this.searchPostsOrUsersByName(this.name, SearchTypes.Search_Users);
    },
    props: {
        name: {
            type: String,
            required: true
        }
    }

});

</script>