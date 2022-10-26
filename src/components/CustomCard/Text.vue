<template>
    <div class="max-w-full p-4 mb-3">
        <!--Title-->
        <h1 class="font-bold text-lg">
            {{title}}
        </h1>

        <!--Description-->
        <p class="text-sm break-words">
            {{description}}
        </p>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: 'CardText',
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: '',
            required: false
        }
    }
})
</script>