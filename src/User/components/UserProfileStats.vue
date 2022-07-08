<template>

    <div class="card" style="width: 18rem; margin:5px">
        <div class="card-body">
            <h5 class="card-title">{{ info }}</h5>
            <p class="card-text">{{ number }}</p>
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