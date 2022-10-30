<template>
    <button
        class="font-bold  py-2 px-4 rounded disabled:opacity-50 hover:opacity-70 focus:ring-1 focus:ring-blue-500 active:opacity-80 "
        :disabled="disabled" @click="onClick" :class="customBackground">

        <span v-if="title != undefined" :class="{ 'my-auto': hasIcon }">
            {{ title }}
        </span>

        <template v-if="hasIcon">
            <slot name="icon"></slot>
        </template>

    </button>
</template>

<script lang="ts">

import { defineComponent, useSlots } from 'vue';

export enum BACKGROUND {
    NONE = "bg-none text-black",
    BACKGROUND_BLUE = 'bg-blue-500 text-white'
}


export default defineComponent({
    name: 'ButtonComponent',
    props: {
        title: {
            type: String,
            default: '',
            required: false
        },
        disabled: {
            type: Boolean || undefined,
            required: true
        },
        background: {
            type: String,
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
            customBackground: ''
        }
    },
    mounted() {

        if (this.background === undefined) {
            this.customBackground = BACKGROUND.BACKGROUND_BLUE;
        } else
            this.customBackground = BACKGROUND.NONE
    }
})
</script>