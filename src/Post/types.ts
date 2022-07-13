import { PostedBy } from "../User/types";
import { CommentDto } from "../Comment/types";
import { SingleCategory } from "./category-types";

export interface UserPosts {
    id: number,
    title: string,
    text: string,
    imageUrl: string,
    postLikeOrDislikeDtos: PostLikeOrDislike[],
    categories: SingleCategory[]
 }
 
 export interface PostLikeOrDislike {
    postId: number,
    likeOrDislike: boolean
 }
 
 export interface UpdatePost{
   title: string,
   text: string,
   allowComments: boolean,
   categories: SingleCategory[]
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
    categories: SingleCategory[]
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
    isSameLikeOrDislikeButton: boolean,
    updatePost: UpdatePost
 }
