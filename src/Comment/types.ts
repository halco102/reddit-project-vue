import { PostedBy, UserComment } from "../User/types";


export interface LikesDislikesComment {
    likedOrDisliked: boolean;
}

/*
export interface CommentDto {
    id: number;
    text: string;
    parentId: number;
    userInfo: PostedBy
    likedOrDislikedComments: LikesDislikesComment[]
}*/


export interface PostComment {
    text: string,
    postId: number,
    userId: number
    parentId: string | null
}

export interface Comment {
    postLikeOrDislike: CommentLikeOrDislikeResponse[],
    commentsDto: CommentDto[],
    commentDto: CommentDto,
    isPostingComment: boolean
}

export interface PostLikeOrDislikeRequest {
    commentId: string,
    likeOrDislike: boolean
}

export interface CommentLikeOrDislikeResponse {
    postId: number,
    commentId: number,
    likeOrDislike: boolean,
}

export interface LikeDislikeComment {
    commentId: string,
    userDto: UserComment,
    like: boolean
}

interface BaseComment {
    id: string,
    commentPostDto: CommentPostDto,
    userDto: UserComment,
    comment: string,
    createdAt: Date,
    likeDislikeComments: LikeDislikeComment[]
}


interface CommentPostDto {
    id: number,
    title: string
}

export interface ReplyDto extends BaseComment {
    parentId: string
}

export interface CommentDto extends BaseComment {
    replies: ReplyDto[]
}