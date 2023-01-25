import { PostedBy } from "../User/types";
import { CommentDto } from "../Comment/types";
import { SingleCategory } from "./category-types";

export interface UserPosts {
   id: number,
   title: string,
   text: string,
   imageUrl: string,
   postLikeOrDislikeDtos: LikeOrDislikeRequest[],
   categories: SingleCategory[]
}

export interface LikeOrDislikeRequest {
   postId: number,
   likeOrDislike: boolean
}

export interface LikeDislikeDto {
   postId: number,
   userId: number,
   likeOrDislike: boolean
}

export interface UpdatePost {
   title: string,
   text: string,
   allowComments: boolean,
   categories: SingleCategory[]
}

//this will be the base of post, the post can be 
//SinglePagePostDto and PostDto (but they both have the same base)
interface BasePost {
   id: number,
   title: string,
   description: string,
   imageUrl: string,
   allowComment: boolean,
   postedBy: PostedBy,
   categoryDtos: SingleCategory[],
   postLikedDislike: LikeDislikeDto[]
}

export interface PostDto extends BasePost {
   numberOfComments?: number | null,
   commentsDtos?: CommentDto[] | null
}

/*
export interface FrontPagePost {
   id: number;
   title: string;
   description: string,
   imageUrl: string;
   postedBy: PostedBy;
   allowComments: boolean
   commentsDto: CommentDto[]
   postLikeOrDislikeDtos: LikeOrDislikeRequest[],
   categories: SingleCategory[],
   createdAt: Date,
   //editedAt: Date | null
}
*/

export interface PostRequest {
   title: string,
   text: string,
   imageUrl: string,
   allowComments: boolean,
   categories: SingleCategory[]
}

export interface PostInterface {
   posts: PostDto[],
   post: PostDto,
   request: PostRequest,
   isLoading: boolean,
   isDeleted: boolean,
   isSameLikeOrDislikeButton: boolean,
   updatePost: UpdatePost
}

