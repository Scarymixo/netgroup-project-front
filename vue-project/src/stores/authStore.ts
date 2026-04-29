import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAuthResponse } from '@/domain/IAuth'

export const useAuthStore = defineStore('auth', () => {
    const STORAGE_KEY = "auth"
    
    let initial: { jwt: string; refreshToken: string; firstName: string; lastName: string } | null = null
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (raw) initial = JSON.parse(raw)
    } catch {
        sessionStorage.removeItem(STORAGE_KEY)
    }

    const jwt = ref<string>(initial?.jwt ?? "")
    const refreshToken = ref<string>(initial?.refreshToken ?? "")
    const firstName = ref<string>(initial?.firstName ?? "")
    const lastName = ref<string>(initial?.lastName ?? "")

    // Helper
    function persist() {
        if (!jwt.value) {
            sessionStorage.removeItem(STORAGE_KEY)
            return
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            jwt: jwt.value,
            refreshToken: refreshToken.value,
            firstName: firstName.value,
            lastName: lastName.value,
        }))
    }

    const setAuth = (data: IAuthResponse) => {
        jwt.value = data.token;
        refreshToken.value = data.refreshToken;
        firstName.value = data.firstName;
        lastName.value = data.lastName;
        persist();
    }

    const logOut = () => {
        jwt.value = "";
        refreshToken.value = "";
        firstName.value = "";
        lastName.value = "";
        sessionStorage.removeItem(STORAGE_KEY);
    }
  
    const isLoggedIn = () => {
        return jwt.value !== "";
    }

    return { jwt, refreshToken, firstName, lastName, setAuth, logOut, isLoggedIn }
})