<template>
  <div class="category-selector">
    <div class="categories">
      <a-button
        v-for="category in categories"
        @click="selectCategory(category);filterType(category)"
        :class="{ selected: selectedCategory === category }"
       style="font-weight: bolder">
        {{ category.name }}
      </a-button>
    </div>
    <div v-if="selectedCategory" class="description">
      {{ selectedCategory.description }}
    </div>
  </div>
</template>

<script>
import cloud from "@/components/static/picture/wcloud.png"
import cloud1 from "@/components/static/picture/cloud1.png"
import cloud2 from "@/components/static/picture/cloud2.png"
import cloud3 from "@/components/static/picture/cloud3.png"
import cloud4 from "@/components/static/picture/cloud4.png"
export default {
  data() {
    return {
      categories: [
        { name: '自然灾害', description: '主要包括水旱灾害、气象灾害、地震灾害、地质灾害、海洋灾害、生物灾害和森林草原火灾等。' },
        { name: '事故灾难', description: '主要包括工矿商贸等企业的各类安全事故、交通运输事故、公共设施和设备事故、环境污染和生态破坏事件等。' },
        { name: '公共卫生', description: '主要包括传染病疫情、群体性不明原因疾病、食品安全和职业危害、动物疫情，以及其他严重影响公众健康和生命安全的事件。' },
        { name: '社会安全', description: '主要包括恐怖袭击事件、经济安全事件和涉外突发事件等。' },
      ],
      selectedCategory: null,
      wordCloudImage: cloud,
    };
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category;
      this.$emit('category-selected', category.description);
    },
    filterType(category) {
      this.selectedCategory = category;
      this.$emit('type-selected', category.name);  // 将 category.name 作为事件的参数
    },
  },
};
</script>

<style scoped>
/* .category-selector {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
} */

.category-selector .categories {
  display: flex;
  gap: 1rem;
}

/* .category-selector button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.category-selector button:hover,
.category-selector button.selected {
  transform: scale(1.1);
  background:  #3464e0;
  color: white;
  /*border: 2px solid blue;*/
/* } */ 

.description {
  transition: opacity 0.3s ease;
  background: #DCDCDC;
  color: white; /* 改变文字颜色 */
  padding: 0.5rem; /* 添加内边距 */
  border-radius: 0.25rem; /* 添加圆角 */
  margin-top: 1rem;
}

/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
} */
</style>
