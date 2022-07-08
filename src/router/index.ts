import { createRouter, createWebHistory } from "vue-router";
import UserProfile from '../User/components/UserProfile.vue'
import SinglePagePost from '../Post/components/SinglePagePost.vue'
import PostRequest from '../Post/components/PostRequest.vue'
import MainApp from '../components/MainApp.vue'
import { useAuthenticationStore } from "@/User/store/authentication_store";



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

router.beforeEach(() => {

    const auth = useAuthenticationStore();
    
    // first check the jwt
    auth.checkIfJwtIsValid();

})

export default router