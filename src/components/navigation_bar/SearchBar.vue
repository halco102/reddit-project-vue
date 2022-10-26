<template>

    <div class="flex bg-white rounded-full">

        <!--Search icon-->
        <VButtonIcon class="hover:bg-blue-300 first-of-type:rounded-full px-3" @onClick="startSearch">
            <template #icon>
                <BIconSearch />
            </template>
        </VButtonIcon>

        <input v-model="searchQuery" class="px-2 outline-none rounded-full" v-bind="$attrs" type="search"
            placeholder="Search" aria-label="Search" @keyup.enter="startSearch" />
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BIconSearch } from "bootstrap-icons-vue";
import VButtonIcon from '../VButtonIcon.vue';

export default defineComponent({
    name: 'VnavigationSearchBar',
    components: {
        BIconSearch,
        VButtonIcon
    },
    data() {
        return {
            searchQuery: '' as string
        }
    },
    methods: {
        startSearch: function (): void {
            if (this.searchQuery.length > 0)
                this.$router.push({ name: 'SearchGallery', query: { 'q': this.searchQuery }, params: { name: this.searchQuery } });
            else
                alert('Search is empty!')
        }
    }
})
</script>