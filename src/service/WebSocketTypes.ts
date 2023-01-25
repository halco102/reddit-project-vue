import { CommentDto, LikesDislikesComment } from "@/Comment/types";
import { PostDto } from "@/Post/types";

export interface LikeDislikeCommentsNotification {
    commentDto: CommentDto,
    eventName: string
}

export interface LikeDislikePostNotification {
    postDto: PostDto,
    eventName: string
}