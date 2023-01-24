### How to add authentication in nuxt 3

I've seen a few tutorials on this subject but most of them cover authentication with Supabase, Amplify or Firebase, most of these services have a nuxt component which makes it easier to add authentication to your website.

If you are like me and use the middleware to handle the authentication state of your application by calling an endpoint which provides a token. I will show you how to do this in nuxt 3.

I will be using  [DummyJSON](https://dummyjson.com/) fake API to help me do this.

##### What is DummyJSON?

> With DummyJSON, what you get is different types of REST Endpoints filled with JSON data which you can use in developing the frontend with your favourite framework and library without worrying about writing a backend.

Essentially it's a mock API with few endpoints, most importantly it provides a rest login endpoint which returns a fake token.


### Creating the project

first lets start by creating a project 

`npx nuxi init nuxt3-auth`

Create the following folders/files in the root of the project

- pages
  - index.vue
  - login.vue
  - about.vue

- layouts
  - default.vue

delete `app.vue`

### Creating required pages

`pages/index.vue`
```html
<template>
  <div>Hello Home Page</div>
</template>
<script lang="ts" setup></script>
```

`pages/about.vue`
```html
<template>
  <div>About Page</div>
</template>
<script lang="ts" setup></script>
```

The login page is going to be a very simple just username and password fields with a login button

`pages/login.vue`
```html
<template>
  <div>
    <div class="title">
      <h2>Login</h2>
    </div>
    <div class="container form">
      <label for="uname"><b>Username</b></label>
      <input
        v-model="user.username"
        type="text"
        class="input"
        placeholder="Enter Username"
        name="uname"
        required
      />

      <label for="psw"><b>Password</b></label>
      <input
        v-model="user.password"
        type="password"
        class="input"
        placeholder="Enter Password"
        name="psw"
        required
      />

      <button @click.prevent="login" class="button">Login</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const user = ref({
  username: '',
  password: '',
});

const login = async () => {
  // TODO send user Data to the login endpoint and redirect if  successful 
};
</script>
```

Creating our default layout 

> Nuxt provides a customizable layouts framework you can use throughout your application, ideal for extracting common UI or code patterns into reusable layout components.
Layouts are placed in the `layouts/` directory and will be automatically loaded via asynchronous import when used.

Our layout is going to consist of a navbar with Home, About, and Login links, and a footer at the bottom with our content in the middle the `<slot/>` will automatically be replaced with our code in the pages

`layouts/default.vue`
```html
<template>
  <div>
    <header>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
        <li v-if="!authenticated" class="loginBtn" style="float: right">
          <nuxt-link to="/login">Login</nuxt-link>
        </li>
      </ul>
    </header>
    <div class="mainContent">
      <slot />
    </div>
    <footer>
      <h1>Footer</h1>
    </footer>
  </div>
</template>
```

### Middlewares

> Nuxt provides a customizable route middleware framework you can use throughout your application, ideal for extracting code that you want to run before navigating to a particular route.
Route middleware is navigation guards that receive the current route and the next route as arguments.

We are going to create a named route middleware. which is placed in the `middleware/` directory and will be automatically loaded via asynchronous import when used on a page.

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    console.log('From auth middleware')
})
```
add a console log to verify this is working on our homepage we can now add this middleware

`pages/index.vue`
```html
<template>
  <div>Hello Home Page</div>
</template>
<script lang="ts" setup>
  definePageMeta({
    middleware: 'auth' // this should match the name of the file inside the middleware directory 
})
</script>
```
run the code and check and verify if you can see the `console.log`

in this case, I want to protect every route so how do I make this middleware global? we just need to add the `.global` suffix to our file like so `auth.global.ts` and it will automatically run on every route change.

we can now remove this piece of code from the homepage

```javascript
  definePageMeta({
    middleware: 'auth' // this should match the name of the file inside the middleware directory 
})
```

### Store with Pinia

I'm going to create an auth store to handle login and the authenticated state.  I've already covered an article on how to set up Pinia in nuxt 3. [Pinia and Nuxt 3](https://dev.to/rafaelmagalhaes/pinia-and-nuxt-3-4ij5)


```typescript
// store/auth.ts

import { defineStore } from 'pinia';

interface UserPayloadInterface {
  username: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      const { data, pending }: any = await useFetch('https://dummyjson.com/auth/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username,
          password,
        },
      });
      this.loading = pending;

      if (data.value) {
        const token = useCookie('token'); // useCookie new hook in nuxt 3
        token.value = data?.value?.token; // set token to cookie
        this.authenticated = true; // set authenticated  state value to true
      }
    },
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});
```
We have two actions `authenticateUser` and `logUserOut`

`authenticateUser` function receives a payload of username and password, then we make a post request using the `useFetch` hook to `/auth/login` endpoint from [dummyjson](https://dummyjson.com/docs/auth), we pass username and password in the body.
 we should receive a response like so

```json
{
  "id": 15,
  "username": "kminchelle",
  "email": "kminchelle@qq.com",
  "firstName": "Jeanne",
  "lastName": "Halvorson",
  "gender": "female",
  "image": "https://robohash.org/autquiaut.png?size=50x50&set=set1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZz9zaXplPTUweDUwJnNldD1zZXQxIiwiaWF0IjoxNjM1NzczOTYyLCJleHAiOjE2MzU3Nzc1NjJ9.n9PQX8w8ocKo0dMCw3g8bKhjB8Wo7f7IONFBDqfxKhs"
}
```
if we have data we save the token to the cookies


`logUserOut` this function simply removes the token from the cookies


### Finalising 

now we need to modify the middleware, login and layouts

#### Login page

now we can import our auth store and finish the login function

`pages/login.vue`
```html

<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const user = ref({
  username: 'kminchelle', 
  password: '0lelplR',
});
const router = useRouter();

const login = async () => {
  await authenticateUser(user.value); // call authenticateUser and pass the user object
  // redirect to homepage if user is authenticated
  if (authenticated) {
    router.push('/');
  }
};
</script>
```

#### layouts

in the default layout we now display a login/logout button according to the state of our app and handle the logout event

adjust the navbar to show and or hide the buttons based on the `authenticated` state

```html
        <li v-if="!authenticated" class="loginBtn" style="float: right">
          <nuxt-link to="/login">Login</nuxt-link>
        </li>
        <li v-if="authenticated" class="loginBtn" style="float: right">
          <nuxt-link @click="logout">Logout</nuxt-link>
        </li>
```

add the following to the script in `layouts/default.vue`
```html
<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const router = useRouter();


const { logUserOut } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const logout = () => {
  logUserOut();
  router.push('/login');
};
</script>
```

#### middleware

Now in middleware, we can handle the authentication based on the value of the token in the cookies.

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie('token'); // get token from cookies

  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    return navigateTo('/');
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/login');
  }
});
```

### Preview

![](https://sli1n332.directus.app/assets/63bcc93a-be69-49a3-83e2-a95eca72e3ec)

Repo:  [github](https://github.com/rafaelmagalhaes/nuxt3-auth)


