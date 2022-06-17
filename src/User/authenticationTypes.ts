import { UserProfile } from "./types"

export interface SignupRequest {
    username: string,
    email: string,
    password: string,
}

export interface SignInRequest {
    email: string,
    password: string
}

export interface UserLoginResponse {
    jwt: string
}

export interface Authentication {
    userLoginResponse : UserLoginResponse,
    userProfile: UserProfile,
    isSignupLoading: boolean,
    isLoginLoading: boolean,
    successfullSignup: boolean,
    succesfullLogin: boolean,
    isJwtValid: boolean,
    signutUser: boolean
}