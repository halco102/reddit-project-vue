import { createRouter, createWebHistory } from "vue-router";
import PostsGallery from '../components/PostsGallery.vue'
import SinglePagePost from '../components/SinglePagePost.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: PostsGallery
    },
    {
        path: '/:id',
        name: 'SinglePage',
        component: SinglePagePost,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router