import { createRouter, createWebHistory } from "vue-router";
import UserProfilePosts from '../User/components/UserProfilePosts.vue';
import UserProfileComments from '../User/components/UserProfileComments.vue';
import UserProfile from '../User/components/UserProfile.vue';
import SinglePagePost from '../Post/components/SinglePagePost.vue';
import PostRequest from '../Post/components/PostRequest.vue';
import { useAuthenticationStore } from "@/User/store/authentication_store";
import UpdatePost from '@/Post/components/UpdatePost.vue';
import PostsGallery from '@/Post/components/PostsGallery.vue';
import SearchGallery from '@/Search/components/SearchGallery.vue'
import SearchPost from '@/Search/components/SearchPost.vue';
import SearchUser from '@/Search/components/SearchUser.vue';





const routes = [
    {
        path: '/',
        name: 'Home',
        component: PostsGallery,
        children: [
            {
                path: 'filter',
                name: "FilterCategories",
                component: PostsGallery
            },
        ]
    },
    {
        path: '/search',
        name: 'SearchGallery',
        component: SearchGallery,
        props: true,
        redirect: {
            name: 'SearchPosts'
        },
        children: [
            {
                path: '',
                name: 'SearchPosts',
                component: SearchPost,
                props: true
            },
            {
                path: '',
                name: 'SearchUsers',
                component: SearchUser,
                props: true
            }
        ]
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
        children: [
            {
                path: 'content',
                name: 'FilterPosts',
                component: UserProfilePosts,

            },
            {
                path: 'content',
                name: 'FilterComments',
                component: UserProfileComments
            }
        ]
    },
    {

        path: '/edit/:id',
        name: "UpdatePage",
        component: UpdatePost,
        props: true,
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