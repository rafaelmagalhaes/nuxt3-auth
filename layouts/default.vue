<template>
  <div>
    <header>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/about">About</nuxt-link></li>
        <li class="loginBtn" style="float: right"><nuxt-link to="/login">Login</nuxt-link></li>
      </ul>
    </header>
    <div class="mainContent">
      <slot />
    </div>
    <footer v-if="auth.authenticated">
      <h1>Footer</h1>
    </footer>
  </div>
</template>
<script lang="ts" setup>
const auth = useAuth();
</script>

<style lang="scss">
body {
  font-family: Arial, Helvetica, sans-serif;
  padding: 0;
  margin: 0;
}
header {
  position: fixed;
  top: 0;
  width: 100%;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
  }

  li {
    float: left;
    border-right: 1px solid #bbb;
  }

  li:last-child {
    border-right: none;
  }

  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  li a:hover:not(.loginBtn) {
    background-color: #111;
  }

  .loginBtn {
    background-color: #04aa6d;
  }
}

.mainContent {
  padding: 16px;
  margin: 3rem auto;
}
</style>
