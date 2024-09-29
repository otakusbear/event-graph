<template>
  <div id="app">
    <input type="text" v-model="searchTerm" placeholder="Search..." />
    <button @click="search">Search</button>
    <transition-group name="fade" tag="div">
      <div v-for="tag in tags" :key="tag" class="tag">{{ tag }}</div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      tags: []
    };
  },
  methods: {
    search() {
      // 这里只是一个示例，你可以根据需要替换为实际的搜索逻辑
      this.tags = this.searchTerm.split(' ');
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.tag {
  display: inline-block;
  padding: 10px;
  margin: 10px;
  background: #eee;
  border-radius: 20px;
}
</style>
