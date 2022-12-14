import { defineStore } from 'pinia';

interface UserPayloadInterface {
  username: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async authenticateUser(user: UserPayloadInterface) {
      // useFetch from nuxt 3
      const { data }: any = await useFetch('https://dummyjson.com/auth/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username: user.username,
          password: user.password,
        },
      });

      if (data.value) {
        const { $cookies } = useNuxtApp(); // import custom cookie plugin
        $cookies.set('token', data?.value?.token); // set token to cookie
        this.setAuthentication();
      }
    },
    setAuthentication() {
      this.authenticated = true; // set authenticated  state value to true
    },
    logUserOut() {
      const { $cookies } = useNuxtApp(); // import custom cookie plugin
      this.authenticated = false; // set authenticated  state value to false
      $cookies.removeAll(); // clear all cookies
    },
  },
});
