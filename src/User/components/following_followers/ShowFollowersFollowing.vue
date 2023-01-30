<template>
    <div class="grid grid-cols-2 grid-flow-row gap-12">
        <div v-for=" follow in followObject" :key="follow.id">
            <!--User-->
            <div class="flex gap-4">
                <div class="rounded-md border border-gray-300">
                    <img :src="follow.imageUrl" class="w-20 h-20" />
                </div>
                <div class="flex justify-around">
                    <span class="text-base font-bold font-sans my-auto">{{ follow.username }}</span>
                </div>



                <div class="flex-1 my-auto"
                    v-if="getCurrentlyLoggedUserProfile !== undefined && !currentUserCannotFollowOrUnfollowHimself(follow.id)">

                    <!--Follow icon for unfollowed users-->
                    <div v-if="!checkIfCurrentUserIsFollowing(follow.id)">
                        <div class="grid justify-end">
                            <VButtonIcon @onClick="followUser(follow.id)">
                                <template #icon>
                                    <FollowIcon class="w-6 h-6" />
                                </template>
                            </VButtonIcon>
                        </div>
                    </div>

                    <div v-else>
                        <div class="grid justify-end">
                            <VButtonIcon @onClick="unfollowUser(follow.id)">
                                <template #icon>
                                    <UnfollowIcon class="w-6 h-6" />
                                </template>
                            </VButtonIcon>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

</template>

<script lang="ts">
import { Follow } from '@/User/types';
import { defineComponent } from 'vue';
import VButtonIcon from '@/components/VButtonIcon.vue';
import FollowIcon from '../FollowIcon.vue';
import { mapActions, mapState } from 'pinia';
import { useAuthenticationStore } from '@/User/store/authentication_store'
import UnfollowIcon from '../UnfollowIcon.vue';

export default defineComponent({
    name: 'ShowFollowersOrFollowing',
    components: {
        VButtonIcon,
        FollowIcon,
        UnfollowIcon
    },
    computed: {
        ...mapState(useAuthenticationStore, ['getCurrentlyLoggedUserProfile']),
    },
    props: {
        followObject: {
            type: Object as () => Follow[],
            required: true
        },
        hasFollowIcon: {
            type: Boolean,
            required: false
        },
    },
    methods: {
        ...mapActions(useAuthenticationStore, ['followUser', 'unfollowUser']),
        checkIfCurrentUserIsFollowing: function (userId: number): boolean {

            return this.getCurrentlyLoggedUserProfile.following.some(f => {

                if (f.id === userId) {
                    return true;
                } else {
                    return false;
                }


            });
        },
        currentUserCannotFollowOrUnfollowHimself: function (userId: number): boolean {
            if (userId === this.getCurrentlyLoggedUserProfile.id) {
                return true;
            }
            else
                return false;
        }
    },
})
</script>