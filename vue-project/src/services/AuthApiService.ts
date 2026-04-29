import type { ILoginRequest, IAuthResponse, IRefreshRequest } from "@/domain/IAuth";

export class AuthApiService {
    private static baseUrl: string = import.meta.env.VITE_API_BASE_URL;

    // (reminder for me) Why static methods: There's no per-instance state to hold

    static async login(req: ILoginRequest): Promise<IAuthResponse> {
        const url = `${this.baseUrl}Account/Login`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        })

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`)
        }

        return await response.json() as IAuthResponse

    }

    static async refresh(req: IRefreshRequest): Promise<IAuthResponse> {
        const url = `${this.baseUrl}Account/RefreshToken`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        })

        if (!response.ok) {
            throw new Error(`Refresh failed: ${response.status}`)
        }

        return await response.json() as IAuthResponse
    }
}