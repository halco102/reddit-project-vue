import { createRouter, createWebHistory } from "vue-router";
import UserProfile from '../components/UserProfile.vue'
import SinglePagePost from '../components/SinglePagePost.vue'
import PostRequest from '../components/PostRequest.vue'
import MainApp from '../components/MainApp.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainApp
    },
    {
        path: '/:id',
        name: 'SinglePage',
        component: SinglePagePost,
        props: true
    },
    {
        path: '/post',
        name: "PostRequestPage",
        component: PostRequest
    },
    {
        path: '/user/:id',
        name: "UserProfileById",
        component: UserProfile,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router