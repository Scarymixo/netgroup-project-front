<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { AuthApiService } from '../services/AuthApiService'
import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const email = ref('')
  const password = ref('')
  const message = ref('')

  const randomDelay = (min = 500, max = 2000) => new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)))

  async function login() {
    message.value = ''
    try {
      const data = await AuthApiService.login({
        email: email.value,
        password: password.value,
      })

      authStore.setAuth(data)
      router.push({ name: 'Home' })
    } catch (err) {
      await randomDelay();
      message.value = 'Invalid email or password'
      console.error(err)
    }
  }

  onMounted(() => {
    if (authStore.isLoggedIn()) {
      router.push({ name: "Home" });
    }
  });
</script>

<template>
  <div class="text-center">
    <div class="alert alert-danger" role="alert" v-if="message">
      {{ message }}
    </div>
    <main class="form-signin">
      <form @submit.prevent="login">
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

        <div class="form-floating">
          <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="email" required>
          <label for="floatingEmail">Email</label>
        </div>

      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password" required>
        <label for="floatingPassword">Password</label>
      </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      </form>
    </main>
  </div>
</template>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>