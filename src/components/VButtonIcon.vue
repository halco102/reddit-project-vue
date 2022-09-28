<template>
    <!--this is gonna be used more for components that go in comments, like/dislike, side bar categories and userprofile in card component-->

    <button class="p-2 rounded-md flex place-items-center gap-2 " @click="onClick">

        <slot name="icon"></slot>

        <span v-if="label !== undefined">{{label}}</span>

    </button>

</template>


<script lang="ts">

import { defineComponent, useSlots } from 'vue';


export default defineComponent({
    name: 'VButtonIcon',
    props: {
        label: {
            type: [Number, String],
            required: false
        }
    },
    setup() {
        const slot = useSlots();

        return { slot }
    },
    computed: {
        hasIcon: function (): boolean {
            return !!this.slot.icon;
        },
    },
    methods: {
        onClick: function (): void {
            this.$emit("onClick");
        }
    },
    data() {
        return {
            customCss: ''
        }
    }
})
</script>