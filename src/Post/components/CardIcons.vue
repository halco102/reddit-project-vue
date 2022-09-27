<template>

    <div class="flex justify-between p-4">
        <!--User profile-->
        <router-link :to="{ path: '/user/' + post!.postedBy.id }">
            <ButtonComponent :title="post!.postedBy.username" :disabled="false" :directionOfImage="'LEFT'" class="flex">
                <template #icon>
                    <img class="border-gray-600 w-12 h-12" :src="post!.postedBy.imageUrl" alt="" />
                </template>
            </ButtonComponent>
        </router-link>

        <template v-if="hasIcon">
            <slot name="commentIcon"></slot>
        </template>
    </div>

</template>

<script lang="ts">
import { defineComponent, useSlots } from 'vue';
import { FrontPagePost } from '../types';
import ButtonComponent from '@/components/ButtonComponent.vue';


export default defineComponent({
    name: 'IconsForCard',
    components: {
        ButtonComponent
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
            type: Object as () => FrontPagePost,
            required: true
        }
    }
})

</script>