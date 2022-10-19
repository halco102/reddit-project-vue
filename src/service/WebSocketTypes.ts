import { CommentDto, LikesDislikesComment } from "@/Comment/types";
import { FrontPagePost } from "@/Post/types";

export interface LikeDislikeCommentsNotification {
    commentDto: CommentDto,
    eventName: string
}

export interface LikeDislikePostNotification {
    postDto: FrontPagePost,
    eventName: string
}