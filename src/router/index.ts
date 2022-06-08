import { createRouter, createWebHistory } from "vue-router";
import UserProfile from '../User/components/UserProfile.vue'
import SinglePagePost from '../Post/components/SinglePagePost.vue'
import PostRequest from '../Post/components/PostRequest.vue'
import MainApp from '../components/MainApp.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainApp,
    },
    {
        path: '/post/:id',
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
        path: '/user/:userId',
        name: "UserProfileById",
        component: UserProfile,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router