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


export interface CommentRequest {
    postId: number,
    parentId: string | null,
    comment: string
}

export interface Comment {
    postLikeOrDislike: CommentLikeOrDislikeResponse[],
    commentsDto: CommentDto[],
    commentDto: CommentDto,
    isPostingComment: boolean,
}

export interface LikeDislikeCommentRequest {
    id: string,
    like: boolean
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
    postDto: CommentPostDto,
    userDto: UserComment,
    comment: string,
    createdAt: Date,
    likeDislikeComments: LikeDislikeComment[],
    mention: string | undefined
}


interface CommentPostDto {
    id: number,
    title: string
}

/*
export interface ReplyDto extends BaseComment {
    parentId: string
}*/

export interface CommentDto extends BaseComment {
    parentIds: string[],
    replies: CommentDto[]
}