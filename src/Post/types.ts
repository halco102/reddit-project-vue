import { PostedBy } from "../User/types";
import { CommentDto } from "../Comment/types";

export interface UserPosts {
    id: number,
    title: string,
    text: string,
    imageUrl: string,
    postLikeOrDislikeDtos: PostLikeOrDislike[]
 }
 
 export interface PostLikeOrDislike {
    postId: number,
    likeOrDislike: boolean
 }
 
 
 export interface FrontPagePost {
    id: number;
    title: string;
    text: string,
    imageUrl: string;
    postedBy: PostedBy;
    allowComments: boolean
    commentsDto: CommentDto[]
    postLikeOrDislikeDtos: PostLikeOrDislike[]
 }
 
 export interface PostRequest {
    title: string,
    text: string,
    imageUrl: string,
    allowComments: boolean,
 }
 
 export interface PostInterface {
    posts: FrontPagePost[],
    post: FrontPagePost,
    request: PostRequest,
    isLoading: boolean,
    isDeleted: boolean,
    isSameLikeOrDislikeButton: boolean
 }