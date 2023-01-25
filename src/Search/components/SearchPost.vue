<template>
    <div v-for="(post, index) in getAllPosts" :key="post.id" :class="index == 0 ? 'posts-with-border' : 'posts'">
        <div class="wrapper">
            <div class="text">

                <div class="user-info">
                    <small>Posted by : {{ post.postedBy.username }}</small>
                </div>
                <div class="post-info">
                    <h5>{{ post.title }}</h5>
                    <p>{{ post.description }}</p>
                </div>
                <div class="post-status">
                    <small>{{ sumOfLikerOrDislikes(post) }}</small>
                    <small style="margin-left: 5px;">| comments {{ post.numberOfComments }}</small>
                    <small style="margin-left: 5px">| {{ returnPostedAtOrEdited(post) }}</small>
                </div>
            </div>
            <div class="image-side">
                <img :src="post.imageUrl">
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePostStore } from "@/Post/store/store";
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "@/Search/store/search-store";
import { PostDto } from "@/Post/types";
import moment from 'moment';
import { SearchTypes } from '@/Search/type';


export default defineComponent({
    name: 'SearchPost',

    methods: {
        ...mapActions(useSearchStore, ['searchPostsOrUsersByName']),
        ...mapActions(usePostStore, ['sumLikesOrDislikesOnPost']),

        sumOfLikerOrDislikes: function (post: PostDto): string {
            let number = this.sumLikesOrDislikesOnPost(post);

            if (number >= 0) {
                return number + ' upvotes';
            }
            return number + ' downvotes';
        },
        returnPostedAtOrEdited: function (post: PostDto): string {
            return 'placeholder';

            //return 'edited at ' + moment(post.createdAt).fromNow();
        },
    },
    computed: {
        ...mapState(useSearchStore, ['getAllPosts'])
    },
    mounted() {
        console.log("Search component");
        this.searchPostsOrUsersByName(this.name, SearchTypes.Search_Posts);
    },
    props: {
        name: {
            type: String,
            required: true
        }
    }
})

</script>

<style scoped>
.posts {
    display: grid;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(148, 147, 147);
    max-height: 423px;
    min-height: 141px;
    width: 638px;
}

small {
    color: rgb(184, 184, 184);
}

.posts-with-border {
    display: grid;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(148, 147, 147);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    max-height: 423px;
    min-height: 141px;
    width: 638px;
}

.wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.text {
    word-break: break-all;
    display: grid;
    height: 100%;
}

.image-side img {
    max-width: 250px;
    max-height: 250px;
    padding: 1vh;
    border-radius: 10px;
}

.user-info {
    max-height: 25px;
    margin-left: 1rem;
}

.post-status {
    display: flex;
    margin-left: 1rem;
}

.post-info {
    margin-left: 1rem;
}
</style>