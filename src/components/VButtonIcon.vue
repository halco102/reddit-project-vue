<template>

    <button class="bg-none hover:bg-gray-400 p-2 rounded-sm" @click="onClick">

        <slot name="icon"></slot>

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
        label: String
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