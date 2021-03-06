import { PostedBy } from "../User/types";


export interface LikesDislikesComment {
    likedOrDisliked: boolean;
}

export interface CommentDto {
    id: number;
    text: string;
    parentId: number;
    userInfo: PostedBy
    likedOrDislikedComments: LikesDislikesComment[]
}


export interface PostComment {
    text: string,
    postId: number,
    userId: number
    parentId: number | null
}

export interface Comment {
    postLikeOrDislike: CommentLikeOrDislikeResponse[],
    commentsDto: CommentDto[],
    commentDto: CommentDto,
    isPostingComment: boolean
}

export interface PostLikeOrDislikeRequest {
    commentId: number,
    likeOrDislike: boolean
}

export interface CommentLikeOrDislikeResponse {
    postId: number,
    commentId: number,
    likeOrDislike: boolean,
}