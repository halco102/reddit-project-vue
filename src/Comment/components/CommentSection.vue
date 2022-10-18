<template>
    <div>
        <!--Userp info and comment text-->
        <CommentUserAndText :user="{
            imgUrl: commentObject.userInfo.imageUrl,
            username: commentObject.userInfo.username
        }" :commentText="commentObject.text" />

        <CommentIcons :comment="commentObject" @toggle="activateToogle" />

        <!-- Open reply -->
        <div v-if="(selectedItem !== 0 && selectedItem === commentObject.id)">
            <TextBox :postId="postId!" :parentId="commentObject.id" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommentUserAndText from '@/Comment/components/CommentUserText.vue'
import { CommentDto } from '../types';
import CommentIcons from '@/Comment/components/CommentIcons.vue'
import TextBox from './TextBox.vue';

export default defineComponent({
    name: 'CommentSection',
    components: {
        CommentUserAndText,
        CommentIcons,
        TextBox
    },
    props: {
        commentObject: {
            type: Object as () => CommentDto,
            required: true
        },
        postId: {
            type: Number,
            required: false
        }
    },
    methods: {
        activateToogle: function (item: number): void {
            if (this.selectedItem === item) {
                this.selectedItem = 0;
                return;
            }

            this.selectedItem = item;
        }
    },
    data() {
        return {
            selectedItem: 0 as number,

        }
    }

})
</script>
