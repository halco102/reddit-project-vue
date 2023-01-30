<template>
    <div class="border-2 border-gray-400 rounded-lg p-3">
        <ShowFollowersOrFollowing :followObject="getUserFollowers" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useUserStore } from '@/User/store/store';
import ShowFollowersOrFollowing from '@/User/components/following_followers/ShowFollowersFollowing.vue'


export default defineComponent({
    name: "ShowFollowers",
    components: {
        ShowFollowersOrFollowing
    },
    computed: {
        ...mapState(useUserStore, ['getUserFollowers'])
    },
})

</script>