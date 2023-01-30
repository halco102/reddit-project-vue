import { UserPosts, LikeOrDislikeRequest, PostDto } from "../Post/types";
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

export interface UserComment {
    id: number,
    username: string,
    imageUrl: string
}

export interface PostedBy {
    id: number,
    email: string,
    username: string,
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
    email: string,
    createdAt: Date,
    posts: UserPosts[],
    commentsPosts: CommentDto[],
    likedOrDislikedComments: CommentLikeOrDislikeResponse[],
    postLikeOrDislikeDtos: LikeOrDislikeRequest[],
    following: Follow[],
    followers: Follow[]
}

export interface CommentsPost {
    postId: number,
    commentDto: CommentDto[]
}


export interface UserState {
    user: User,
    userProfile: UserProfile,
    postForLikeDislike: PostDto[],
}

export interface Notification {
    userInfo: PostedBy,
    notifications?: PostNotification
}


export interface PostNotification {
    id: number,
    title: string,
    imageUrl: string
}

export interface Follow {
    id: number,
    username: string,
    email: string,
    createdAt: Date,
    imageUrl: string
}

/*
export interface FollowersDto extends Follow {
    id: number
}

export interface FollowingDto extends Follow {
    id: number
}
*/
