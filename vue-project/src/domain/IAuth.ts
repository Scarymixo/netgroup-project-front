export interface ILoginRequest {
    email: string,
    password: string,
}

export interface IAuthResponse {
    token: string,
    refreshToken: string,
    firstName: string,
    lastName: string,
}

export interface IRefreshRequest {
    jwt: string,
    refreshToken: string,
}
