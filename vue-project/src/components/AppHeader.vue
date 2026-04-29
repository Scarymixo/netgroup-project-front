<script setup lang="ts">
    import { useAuthStore } from '../stores/authStore'
    import { RouterLink, useRouter } from 'vue-router'

    const router = useRouter();

    const authStore = useAuthStore()

    function logOut() {
        authStore.logOut()
        router.push({ name: "Login" })
    }
</script>

<template>
    <header>
        <nav class="navbar navbar-expand navbar-light bg-light" aria-label="Second navbar example">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" to="/">Eventify</RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarsExample02">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">Events</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/about">About</RouterLink>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item" v-if="authStore.isLoggedIn()">
                            <a class="nav-link" @click="logOut">Logout</a>
                        </li>
                        <li class="nav-item" v-else>
                            <RouterLink class="nav-link" to="/login">Login</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
body {
  padding-bottom: 20px;
}

.navbar {
  margin-bottom: 20px;
}
</style>