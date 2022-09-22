<template>
    <button class="font-bold py-2 px-4 rounded" @click="onClick">
        {{title}}
        <template v-if="hasIcon">
            <span name="icon"></span>
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
            required: true
        },
        disabled: {
            type: Boolean || undefined,
            required: true
        }
    },
    setup() {
        const slot = useSlots();

        return { slot }
    },
    computed: {
        hasIcon: function (): boolean {
            console.log(this.slot.icon);
            return !!this.slot.icon;
        },
    },
    methods: {
        onClick: function (): void {
            console.log("Clicked")
            this.$emit("onClick",);
        }
    }
})
</script>