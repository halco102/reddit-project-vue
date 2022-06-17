import { UserPosts, FrontPagePost } from "../Post/types";
import {PostLikeOrDislikeResponse} from '../Comment/types'


export interface SignupRequest {
    username: string,
    email: string,
    password: string,
}

export interface SignInRequest {
    email: string,
    password: string
}

export interface PostedBy {
    id: number;
    username: string;
    imageUrl: string
}

export interface User {
    id: number,
    username: string,
    email: string,
    imageUrl: string,
    createdAt: Date,
    posts: UserPosts[],
    likedOrDislikedComments: PostLikeOrDislikeResponse[]
}

export interface UserLoginResponse {
    jwt: string
}

export interface UserProfile {
    id: number,
    username: string,
    imageUrl: string,
    emai?: string,
    createdAt: Date,
    posts: UserPosts[],
}





export interface UserState {
    user: User,
    userProfile: UserProfile,
    postForLikeDislike: FrontPagePost[],
}


