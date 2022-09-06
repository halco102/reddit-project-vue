<template>

    <div class="flex my-3 justify-center border-solid border-2 border-gray-300 rounded p-4 shadow-lg w-72 m-2">
        <div class="grid">
            <h5 class="text-center">{{ info }}</h5>
            <p class="text-center">{{ number }}</p>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "UserProfile",
    props: {

        info: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        }

    }

});

</script>