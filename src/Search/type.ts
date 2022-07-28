import { FrontPagePost } from "@/Post/types";
import { UserProfile } from "@/User/types";

export interface Search{
    posts: FrontPagePost[],
    users: UserProfile[]
}

export const enum SearchTypes {
    Search_Posts = "SEARCH_CONTENT",
    Search_Users = "SEARCH_USER"
}