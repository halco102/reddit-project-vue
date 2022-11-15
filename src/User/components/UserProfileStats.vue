<template>

    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-72 m-2">
        <div class="grid">
            <template v-if="hasInfo">
                <slot name="info"></slot>
            </template>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, useSlots } from "vue";
export default defineComponent({
    name: "UserProfile",
    setup() {
        const slot = useSlots();

        return { slot }
    },
    computed: {
        hasInfo: function (): boolean {
            return !!this.slot.info;
        },
    }

});

</script>