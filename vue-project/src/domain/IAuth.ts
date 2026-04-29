export interface ILoginRequest {
    email: string,
    password: string,
}

export interface IAuthResponse {
    jwt: string,
    refreshToken: string,
}

export interface IRefreshRequest {
    jwt: string,
    refreshToken: string,
}
