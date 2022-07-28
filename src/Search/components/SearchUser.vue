<template>
    <div v-for="(user, index) in getAllUsers" :key="user.id" :class="index === 0 ? 'users-with-border' : 'users'">
        <router-link id="router-link" :to="{ name: 'UserProfileById', params: { userId: user.id } }">
            <div class="users">
                <div class="user-profile">
                    <div class="user-image">
                        <img :src="user.imageUrl">
                    </div>
                    <div class="user-info">
                        <h6>{{ user.username }}</h6>
                        <p style="margin-left:10px;">.{{ sumOfLikesOrDislikes(user) }} upvotes</p>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "../store/search-store";
import { SearchTypes } from "../type";
import { UserProfile } from '@/User/types'


export default defineComponent({

    name: 'SearchUser',
    methods: {
        ...mapActions(useSearchStore, ['searchPostsOrUsersByName']),
        sumOfLikesOrDislikes: function (user: UserProfile): number {
            let result = 0;

            user
                .posts.map((res) => {
                    res.postLikeOrDislikeDtos.filter((k) => {
                        if (k.likeOrDislike) {
                            result++;
                        } else {
                            result--;
                        }
                    })
                })

            return result;
        }
    },
    computed: {
        ...mapState(useSearchStore, ['getAllUsers'])
    },
    mounted() {
        this.searchPostsOrUsersByName(this.name, SearchTypes.Search_Users);
    },
    props: {
        name: {
            type: String,
            required: true
        }
    }

});

</script>

<style scoped>
#router-link {
    text-decoration: none;
    color: black;
}

.users {
    display: grid;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(148, 147, 147);
    max-height: 423px;
    min-height: 141px;
    width: 638px;
}

.users-with-border {
    display: grid;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(148, 147, 147);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    max-height: 250px;
    min-height: 141px;
    width: 638px;
}

.user-profile {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    text-decoration: none;
    margin-top: 10px;
    align-items: baseline;

}

.user-info p {
    color: rgb(172, 170, 170);
}

.user-image img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
}

.user-image {
    margin-right: 1rem;
    padding-bottom: 10px;
}
</style>