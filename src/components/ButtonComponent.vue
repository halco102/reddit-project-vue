<template>
    <!--This button component is gonna be used for login and signup (for now)-->
    <button
        class="font-bold text-white bg-blue-500 py-2 px-4 rounded disabled:opacity-50 hover:opacity-70 focus:ring-1 focus:ring-blue-500 active:opacity-80 "
        :disabled="disabled" @click="onClick">

        <span v-if="title != undefined" :class="{'my-auto' : hasIcon}">
            {{title}}
        </span>

        <template v-if="hasIcon">
            <slot name="icon"></slot>
        </template>

    </button>
</template>

<script lang="ts">

import { defineComponent, useSlots } from 'vue';


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