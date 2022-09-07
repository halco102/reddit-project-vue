<template>

    <!--Textbox form-->
    <div class="sm:grid md:grid">

        <form v-on:submit.prevent="
            postCommentThenReturnData(
                txt,
                postId,
                userId,
                checkParentId()
            )
        ">
            <!--Text area-->
            <div class="my-4">

                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Comment</label>

                <div class="lg:flex md:grid sm:grid">

                    <!--Textarea with emoji icon-->
                    <div class="relative lg:flex-1">
                        <!--Icon-->
                        <div class="absolute right-0 top-2 mr-2 flex">
                            <BIconEmojiSmile class="w-5 h-5 hover:cursor-pointer" @click="toggleEmojiMethod" />
                        </div>

                        <!--Textarea-->
                        <textarea id="message" rows="4"
                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your message..." v-model="txt"></textarea>
                    </div>

                    <VuemojiPicker @emojiClick="handleEmojiClick " 
                        class="lg:absolute lg:right-0 lg:mr-64 sm:grid sm:justify-center md:grid md:justify-center sm:mt-2 md:mt-2"
                        v-if="toggleEmoji" />

                </div>
                <!--Ovaj za vuemoji i text-->

            </div>

            <button class="btn btn-blue mb-2">Submit</button>
        </form>


    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

//pinia
import { mapActions, mapState } from 'pinia';

//store
import { useCommentStore } from '../store/store';

//toast
import { useToast } from 'vue-toastification';

import { VuemojiPicker, EmojiClickEventDetail } from 'vuemoji-picker'

//components
import {
    BIconEmojiSmile
} from "bootstrap-icons-vue";

export default defineComponent({
    components: {
        BIconEmojiSmile,
        VuemojiPicker
    },
    data() {
        return {
            txt: '',
            toggleEmoji: false
        }
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    computed: {
        ...mapState(useCommentStore, ['isPostingComment'])
    },
    methods: {
        ...mapActions(useCommentStore, ['postCommentAction']),

        postCommentThenReturnData: function (
            text: string,
            idOfPost: number,
            idOfUser: number,
            parentId: null | number
        ) {


            if (this.userId === 0 || this.userId === undefined || this.userId === null) {
                this.toast.warning("You have to log in to comment!");
                return;
            }

            if (text === '') {
                this.toast.warning("Comment is empty");
                return;
            }

            this.postCommentAction({
                text: text,
                postId: idOfPost,
                userId: idOfUser,
                parentId: parentId,
            });

            this.txt = '';
        },
        checkParentId: function (): number | null {

            console.log("Check parent id", this.parentId);
            if (this.parentId === undefined || this.parentId === null) {
                return null;
            }

            return this.parentId;
        },
        handleEmojiClick: function (detail: EmojiClickEventDetail): void {
            console.log("Emoji clicker");
            if (detail.unicode !== undefined) {
                this.txt += detail.unicode;
            }
        },
        toggleEmojiMethod : function() : void {
            this.toggleEmoji = !this.toggleEmoji;
        }
    },
    props: {
        postId: {
            type: Number,
            required: true
        },
        userId: {
            type: Number,
            required: true
        },
        parentId: {
            type: Number,
            required: false
        },

    },
})
</script>