<template >
    <div v-if="toggle">
        <div v-if="notifications.length === 0"
            class="rounded-md absolute -right-6 bg-gray-400 border border-gray-400 p-2 mt-3">
            <p>Nothing</p>
        </div>

        <div class="flex flex-col gap-4 rounded-md absolute -right-6 bg-gray-400 border border-gray-400 p-2 mt-3 overflow-auto max-h-72"
            v-else>
            <div class="w-52 hover:bg-gray-200 rounded-md" v-for="notification in notifications"
                :key="notification.userInfo.id">
                <router-link class="cursor-pointer"
                    :to="{ name: 'SinglePage', params: { id: notification.notifications?.id !== null ? notification.notifications?.id : 0 } }">
                    <div class="flex">
                        <img :src="notification.userInfo.imageUrl"
                            class="w-14 h-14 my-auto border rounded-full mx-2 bg-white" />

                        <div class="text-sm px-2 " v-if="notification.notifications?.title !== null">
                            <p><b>{{ notification.userInfo.username }}</b> posted
                                <b>{{ notification.notifications?.title
                                }}</b>
                                check it
                                out
                            </p>
                        </div>

                        <div class="text-sm px-2 " v-else>
                            <p><b>{{ notification.userInfo.username }}</b>
                                <b>
                                    'deleted this post &#128550;'
                                </b>
                            </p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Notification } from '@/User/types'

export default defineComponent({
    name: 'VdropDown',
    components: {
    },
    props: {
        notifications: {
            type: Object as () => Notification[],
            required: true
        },
        toggle: {
            type: Boolean,
            required: true
        }
    },
})
</script>