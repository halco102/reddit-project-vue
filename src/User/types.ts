import { UserPosts, FrontPagePost, LikeOrDislikeRequest } from "../Post/types";
import { CommentDto, CommentLikeOrDislikeResponse } from '../Comment/types';



export interface SignupRequest {
    username: string,
    email: string,
    password: string,
}

export interface SignInRequest {
    emailOrUsername: string,
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
    likedOrDislikedComments: CommentLikeOrDislikeResponse[]
}

export interface UserLoginResponse {
    jwt: string
}

export interface UserProfile {
    id: number,
    username: string,
    imageUrl: string,
    email?: string,
    createdAt: Date,
    posts: UserPosts[],
    commentsPosts: CommentsPost[],
    likedOrDislikedComments: CommentLikeOrDislikeResponse[],
    postLikeOrDislikeDtos: LikeOrDislikeRequest[]
}

export interface CommentsPost {
    postId: number,
    commentDto: CommentDto[]
}


export interface UserState {
    user: User,
    userProfile: UserProfile,
    postForLikeDislike: FrontPagePost[],
}

export interface Notification {
    userInfo: PostedBy,
    notifications: PostNotification
}


export interface PostNotification {
    id: number,
    title: string,
    imageUrl: string
}