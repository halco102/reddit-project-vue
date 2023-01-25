<template>

    <div class="flex justify-between p-4">
        <!--User profile-->
        <router-link :to="{ path: '/user/' + post!.postedBy.id }">
            <VButtonIcon :label="post!.postedBy.username" class="hover:bg-gray-500">
                <template #icon>
                    <img class="w-12 h-12 border-2 rounded-full border-gray-500" :src="post!.postedBy.imageUrl"
                        alt="" />
                </template>
            </VButtonIcon>
        </router-link>

        <template v-if="hasIcon">
            <slot name="commentIcon"></slot>
        </template>
    </div>

</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import { PostDto } from '../types';
import VButtonIcon from '@/components/VButtonIcon.vue';


export default defineComponent({
    name: 'IconsForCard',
    components: {
        VButtonIcon
    },
    setup() {
        const slots = useSlots();

        return { slots }
    },
    computed: {
        hasIcon: function (): boolean {
            return !!this.slots.commentIcon;
        }
    },
    props: {
        post: {
            type: Object as () => PostDto,
            required: true
        }
    },
})

</script>