import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAuthResponse } from '@/domain/IAuth'

export const useAuthStore = defineStore('auth', () => {
    const STORAGE_KEY = "auth"
    
    let initial: { jwt: string; refreshToken: string } | null = null
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) initial = JSON.parse(raw)
    } catch {
        sessionStorage.removeItem(STORAGE_KEY)
    }

    const jwt = ref<string>(initial?.jwt ?? "")
    const refreshToken = ref<string>(initial?.refreshToken ?? "")

    // Helper
    function persist() {
        if (!jwt.value) {
            sessionStorage.removeItem(STORAGE_KEY)
            return
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            jwt: jwt.value,
            refreshToken: refreshToken.value,
        }))
    }

    const setAuth = (data: IAuthResponse) => {
        jwt.value = data.jwt;
        refreshToken.value = data.refreshToken;
        persist();
    }

    const logOut = () => {
        jwt.value = "";
        refreshToken.value = "";
        sessionStorage.removeItem(STORAGE_KEY);
    }
  
    const isLoggedIn = () => {
        return jwt.value !== "";
    }

    // Only admins can authenticate today; revisit when regular-user login is added.
    const isAdmin = () => {
        return isLoggedIn();
    }

    return { jwt, refreshToken, setAuth, logOut, isLoggedIn, isAdmin }
})