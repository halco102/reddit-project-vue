import { createRouter, createWebHistory } from "vue-router";
import UserProfile from '../User/components/UserProfile.vue'
import SinglePagePost from '../Post/components/SinglePagePost.vue'
import PostRequest from '../Post/components/PostRequest.vue'
import MainApp from '../components/MainApp.vue'
import { useAuthenticationStore } from "@/User/store/authentication_store";
import UpdatePost from '@/Post/components/UpdatePost.vue'





const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainApp,
    },
    {
        path: '/post',
        name: "PostRequestPage",
        component: PostRequest,
    },
    {
        path: '/user/:userId',
        name: "UserProfileById",
        component: UserProfile,
    },
    {
            
        path: '/edit/:id',
        name: "UpdatePage",
        component: UpdatePost,
        props: true
    
    },
    {
        path: '/post/:id',
        name: 'SinglePage',
        component: SinglePagePost,
        props: true,

    },

]



const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(() => {

    const auth = useAuthenticationStore();

    // first check the jwt
    auth.checkIfJwtIsValid();

})

export default router