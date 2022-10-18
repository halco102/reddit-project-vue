<template>
    <div class="flex">

        <!-- Users image-->
        <div>
            <img :src="user.imgUrl" class="rounded-full w-10 h-10 mr-3 mb-3">
        </div>

        <!-- Users username and chat text-->
        <div class="grid flex-1 text-start pl-2">
            <!--Username-->
            <div class="font-semibold">
                {{ user.username }}
            </div>
            <!--Chat text-->
            <div>
                {{ commentText }}
            </div>

        </div>

    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

    interface User{
        imgUrl: string,
        username: string
    }

    export default defineComponent({
        name: 'CommentUserAndText',
        props:{
            user: {
                type: Object as () => User,
                required: true
            },
            commentText: {
                type: String,
                required: true
            }
        }
    })
</script>