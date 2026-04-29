import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { IAuthResponse, IRefreshRequest } from '@/domain/IAuth';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const httpClient: AxiosInstance = axios.create({ baseURL });

export const rawHttpClient: AxiosInstance = axios.create({ baseURL });

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
    const authStore = useAuthStore();
    try {
        const req: IRefreshRequest = {
            jwt: authStore.jwt,
            refreshToken: authStore.refreshToken,
        };
        const { data } = await rawHttpClient.post<IAuthResponse>(
            'identity/Account/RefreshTokenData',
            req,
        );
        authStore.setAuth(data);
        return true;
    } catch {
        authStore.logOut();
        window.location.href = '/login';
        return false;
    }
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.jwt) {
        config.headers.set('Authorization', `Bearer ${authStore.jwt}`);
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        if (error.response?.status === 401 && original && !original._retry) {
            original._retry = true;

            if (!refreshPromise) {
                refreshPromise = refreshTokens().finally(() => {
                    refreshPromise = null;
                });
            }

            const refreshed = await refreshPromise;
            if (refreshed) {
                const authStore = useAuthStore();
                original.headers.set('Authorization', `Bearer ${authStore.jwt}`);
                return httpClient.request(original);
            }
        }

        return Promise.reject(error);
    },
);
