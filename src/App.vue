<script setup>
import Index from './components/Index.vue';
import Search from './components/Search.vue';
import 'ant-design-vue/dist/antd.css';

localStorage.setItem('canvas_id', 1)

</script>

<template>
    <!-- <Index /> -->
    <router-view></router-view>
</template>

<style scoped>

</style>
