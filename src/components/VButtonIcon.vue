<template>

    <button class="hover:bg-gray-500 p-2 rounded-sm flex place-items-center gap-2" @click="onClick">

        <slot name="icon"></slot>

        <span v-if="label !== undefined">{{label}}</span>

    </button>

</template>


<script lang="ts">

import { defineComponent, useSlots } from 'vue';


export default defineComponent({
    name: 'VButtonIcon',
    props: {
        disabled: {
            type: Boolean || undefined,
            required: true
        },
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
            this.$emit("onClick",);
        }
    },
    data() {
        return {
            customCss: ''
        }
    }
})
</script>