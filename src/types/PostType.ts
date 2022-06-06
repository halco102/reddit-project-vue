import { PostedBy } from "./UserType";
import { CommentDto } from "./CommentType";

export interface UserPosts {
    id: number,
    title: string,
    text: string,
    imageUrl: string,
    postLikeOrDislikeDtos: PostLikeOrDislike[]
 }
 
 export interface PostLikeOrDislikeRequest {
    postId: number,
    likeOrDislike: boolean
 }
 
 export interface PostLikeOrDislike {
    likeOrDislike: boolean | null;
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