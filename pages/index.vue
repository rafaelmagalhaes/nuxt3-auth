<template>
  <div>
    Home Page {{ title }}
    <hello />
  </div>
</template>
<script lang="ts" setup>
const { title } = useTitle();
</script>
