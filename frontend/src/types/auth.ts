export interface IUser {
    id?: string
    username: string
    role: string
}

export interface IAuthResponse {
    message: string
    user: IUser
}

export interface ISignupPayload {
    username: string
    password: string
}
