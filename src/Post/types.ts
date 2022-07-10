import { PostedBy } from "../User/types";
import { CommentDto } from "../Comment/types";
import { Category, SingleCategory } from "./category-types";

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
    postLikeOrDislikeDtos: PostLikeOrDislike[],
    categories: Category[]
 }
 
 export interface PostRequest {
    title: string,
    text: string,
    imageUrl: string,
    allowComments: boolean,
    categories: SingleCategory[]
 }
 
 export interface PostInterface {
    posts: FrontPagePost[],
    post: FrontPagePost,
    request: PostRequest,
    isLoading: boolean,
    isDeleted: boolean,
    isSameLikeOrDislikeButton: boolean
 }
