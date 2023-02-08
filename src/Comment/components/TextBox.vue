<template>

    <!--Textbox form-->
    <div class="sm:grid md:grid max-w-full">

        <div class="max-w-full">
            <!--Text area-->
            <div class="my-4 max-w-full">

                <label for="message"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Comment</label>

                <div class="lg:flex md:grid sm:grid max-w-full">

                    <!--Textarea with emoji icon-->
                    <div class="lg:flex-1">


                        <!--Textarea
                        <textarea id="message" rows="4" ref="messageRef"
                            class="block
                             p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your message..." v-model="txt"></textarea>
                            -->

                        <!--Div for username and text area-->
                        <div class="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border
                             border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700
                              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                               dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-full">

                            <div class="flex gat-1 border-b-2">
                                <div v-html="mention" class="px-1"></div>

                                <!--Text area-->
                                <div ref="cont"
                                    class="border-none text-sm grow break-all focus:outline-none text-left px-1"
                                    contenteditable="true" @input="watchInputText">
                                </div>

                            </div>

                        </div>

                    </div>

                    <VuemojiPicker @emojiClick="handleEmojiClick"
                        class="lg:absolute lg:right-0 lg:mr-64 sm:grid sm:justify-center md:grid md:justify-center sm:mt-2 md:mt-2 lg:z-50 md:z-50"
                        v-if="toggleEmoji" />

                </div>
                <!--Ovaj za vuemoji i text-->

            </div>

            <div class="flex justify-start">
                <!--Icon-->
                <div class="my-auto mx-2">
                    <BIconEmojiSmile class="w-5 h-5 hover:cursor-pointer hover:bg-yellow-300 rounded-lg"
                        @click="toggleEmojiMethod" />
                </div>
                <div class="flex flex-1 justify-end">
                    <ButtonComponentVue :title="actionType" :disabled="false" class="mx-1" @onClick="
                    postCommentThenReturnData(
                        txt,
                        postId,
                        checkParentId()
                    )" />
                    <ButtonComponentVue :title="'Cancle'" :disabled="false" class="mx-1" @onClick="clearTextArea" />
                </div>
            </div>
        </div>


    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

//pinia
import { mapActions, mapState } from 'pinia';

//store
import { useCommentStore } from '../store/store';
import { useUserStore } from '@/User/store/store';

//toast
import { useToast } from 'vue-toastification';

import { VuemojiPicker, EmojiClickEventDetail } from 'vuemoji-picker'
import { useAuthenticationStore } from '@/User/store/authentication_store';
import ButtonComponentVue from '@/components/ButtonComponent.vue';

//components
import {
    BIconEmojiSmile
} from "bootstrap-icons-vue";

export default defineComponent({
    components: {
        BIconEmojiSmile,
        VuemojiPicker,
        ButtonComponentVue
    },
    data() {
        return {
            txt: '',
            toggleEmoji: false,
            mention: '' as string
        }
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    computed: {
        ...mapState(useCommentStore, ['isPostingComment']),
        ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile'])
    },
    methods: {
        ...mapActions(useCommentStore, ['postCommentAction']),
        ...mapActions(useUserStore, ['getUserByIdOrUsername']),

        postCommentThenReturnData: function (
            text: string,
            idOfPost: number,
            parentId: null | string
        ) {

            console.log("text to save comm", this.txt);

            if (this.getCurrentlyLoggedUserProfile.id === 0 ||
                this.getCurrentlyLoggedUserProfile.id === undefined ||
                this.getCurrentlyLoggedUserProfile.id === null) {
                this.toast.warning("You have to log in to comment!");
                return;
            }

            if (text === '') {
                this.toast.warning("Comment is empty");
                return;
            }

            this.postCommentAction({
                comment: text,
                postId: idOfPost,
                parentId: parentId,
            });

            this.clearTextArea();
        },
        checkParentId: function (): string | null {

            if (this.parentId === undefined || this.parentId === null) {
                return null;
            }

            return this.parentId;
        },
        handleEmojiClick: function (detail: EmojiClickEventDetail): void {
            if (detail.unicode !== undefined) {
                this.txt += detail.unicode;
            }
        },
        toggleEmojiMethod: function (): void {
            this.toggleEmoji = !this.toggleEmoji;
        },
        goToUserProfile(username: string): void {
            this.$router.push('/user/' + 19);
        },
        clearTextArea(): void {
            const temp = this.$refs.cont as HTMLInputElement;
            temp.innerText = '';
            this.txt = '';
        },
        watchInputText(payload: Event): void {
            const target = payload.target as HTMLInputElement;
            this.txt = target.innerText;
            console.log(this.txt);
        }
    },
    props: {
        postId: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: false
        },
        userId: {
            type: Number,
            required: false
        },
        parentId: {
            type: String,
            required: false
        },
        actionType: {
            type: String,
            required: true
        }

    },
    mounted() {
        if (this.username !== undefined) {
            //add @ and username to textarea as default
            this.mention = '@' + this.username + ' ';
            //change this.text mention with css and add as span
            var newStr = this.mention.replace(/@+?[^\s]*/, m => `<a href="www.google.com" style="color:red;">${m}</a>`)

            this.mention = newStr;
        }
    },
})
</script>