<template>
    <span :name="errorName" class="text-sm text-red-400">
        {{errorText}}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';



export default defineComponent({
    name: 'ErrorComponent',
    props: {
        errorText: String,
        errorName: {
            type: String,
            default: 'error',
            required: true
        }
    }

})
</script>