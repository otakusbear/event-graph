<script>
import { useRouter,useRoute } from 'vue-router'
import { defineComponent, ref } from 'vue';
import Nar from './Nar.vue';
import { useStore } from 'vuex'
import axios from 'axios';
import CategorySelector from './CategorySelector.vue';

export default({
    data(){
        return{
          loading: true,
            conpages:'',//总页数
            cur:1, //当前页
            pageSize:20, //每页要展示数据条数
            showPage:[],//每页展示的内容
            eventTypes: ['公共卫生事件', '自然灾害事件', '事故灾难', '社会安全'], // 添加一个表示事件类型的数据属性
            searchQuery: '', // 添加一个用于搜索的数据属性
            filterOption: '', // 添加一个用于筛选的数据属性
        }
    },
    computed: {
        getShowPage:function(){ //计算指定显示页码数，这里以4页为例
          let arrList = []
          if(this.conpages>10){
            for(let i=0; i<10; i++){
              arrList[i] = i+1;
            }
            return arrList
          }else{
            for(let i = 0; i<this.conpages; i++){
              arrList[i] = i+1;
            }
            return arrList
          }
        }
      },
    created(){
        this.fetchData();
    },
    methods:{
      onChange(pageNumber){
        console.log('Page: ', pageNumber);
        this.fetchData();
      },
      page(item){
        this.cur=item;  //当前页
        this.fetchData();
      },
      prav(){
        if(this.cur!=1){
          this.cur--
          this.fetchData();
        }
      },
      next(){
        if(this.cur<this.conpages){
          this.cur++
          this.fetchData();
        }
      },
      fetchData(){
        this.loading=true;
          axios.get("/api/events", {
              params: {
                  page: this.cur,
                  search: this.searchQuery, // 将搜索查询添加到请求参数中
                  filter: this.filterOption, // 将筛选选项添加到请求参数中
                  eventType: this.eventType, // 将事件类型添加到请求参数中
              }
          }).then(res => {
            this.porps=res.data.data;
            this.conpages = Math.ceil(res.data.total / this.pageSize) || 1;
            this.showPage = this.porps; // 直接将返回的数据赋值给showPage
            this.loading = false;
          })
      },
      filterByEventType(eventType) {
          this.searchQuery = eventType;
          this.fetchData();
      }
    },
    setup() {
        const store = useStore();
        const lists=store.state.searchData
        const router = useRouter();
        const getDetail=value=>{
            let self = this;
            console.log(value)
            axios.get('/api/new-data', {
                params: { event_topic: value },
            }).then(function (response) {
                store.commit('getEvent', response.data);
                store.commit('getTitle',value)
                router.push({ path: '/example'})
            })
        }
        return {
            lists,
            getDetail
        };
    },
    components: { Nar, CategorySelector }
});
</script>

<template>
  <div :style="{minHeight:'100vh'}">
    <Nar></Nar>
    <div class="maine">
      <div style="display: flex;justify-content: space-between;padding: 10px">
        <CategorySelector @type-selected="filterByEventType" />
        <div class="search-and-filter">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="事件关键词"
            enter-button="查询"
            size="large"
            @search="fetchData"
          />
          <!-- <input type="text" class="input-field" v-model="searchQuery" placeholder="事件关键词">
          <button @click="fetchData" style="font-weight: bolder">查询</button> -->
        </div>
      </div>
      <div></div>
    <el-skeleton :loading="loading" :animated="true" :count="9" :throttle="500">
  <!-- 使用template插槽来自定义骨架屏模板 -->
      <template #template>
        <el-skeleton-item variant="h1"/>
        <el-skeleton-item :variant="['p', 'p', 'p']"/>
      </template>
      <!-- 使用default插槽来定义真实的DOM结构 -->
      <template #default>
        <div v-if="!loading">
          <div v-for="data in showPage">
            <div class="hover-div" @click="getDetail(data.title)" style="cursor: pointer;">
              <div class="title">{{data.title}}</div>
    <!--                <div class="content">{{data.des}}</div>-->
            </div>
            <a-divider />
          </div>
        </div>
      </template>
    </el-skeleton>

    <div class="page">
      <a-pagination show-quick-jumper :total="500" :show-total="total => `共 ${total} 个结果`" :show-size-changer="false" :page-size="20" @change="onChange"/>

      <!-- <div class="pravPage" @click="prav">上一页</div>
      <div class="pages" v-for="(item,index) in getShowPage" :key="index" @click="page(item)" :class="item==cur?'active':''" >
        {{item}}
      </div>
      <div class="pages" v-if="this.conpages!=this.getShowPage[this.getShowPage.length-1]">...</div>
      <div class="nextPage" @click="next">下一页</div> -->
    </div>
    </div>
  </div>
</template>

<style>
.event-title {
    font-family: 'Brush Script MT', cursive; /* 使用艺术字体 */
    color: #6a0dad; /* 蓝紫色 */
    text-shadow: 2px 2px #9a32cd; /* 添加阴影效果 */
    font-size: 3em; /* 字体大小 */
    text-align: center; /* 居中对齐 */
    animation: fadeIn 2s; /* 添加淡入动画 */
}

/* .event-types {
    display: flex;
    justify-content: space-around;
} */

/* .event-type {
    background-color: #9a32cd;
    color: #ffffff; 
    border-radius: 50%; 
    width: 100px; 
    height: 100px; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s; 
    animation: popIn 0.5s ease-out; 
} */

/* .event-type:hover {
    background-color: #6a0dad;
    transform: scale(1.1); 
} */

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.active{
  font-weight: 800;
  width: 25px;
  height: 25px;
  border: 1px solid #8f8f8f;border-radius: 5px;
  margin: 0 5px;
  background: linear-gradient(to right, #3464e0, #9214f4);
  text-align: center;
  line-height: 25px;
  color: #fff;
}
.maine{
  min-width: 500px;
  border: 3px solid #fff;
  border-radius: 8px;
  margin:30px 100px ;
  background-color: #F0F8FF;
  padding: 30px;
}
.title{
    font-family: 'Palanquin Dark', sans-serif;
    font-size: 18px;
}
.page{
    text-align: center;
    margin: 10px auto;
}
div[class$=Page]{
    width: 80px; height: 25px;text-align: center;color: white;border-radius: 5px;
      line-height:25px;  background: linear-gradient(to right, #3464e0, #9214f4);margin: 0 5px;
    }
div[class=pages]{
    width: 25px;height: 25px;border: 1px solid #c3c3c3;border-radius: 5px;
      margin: 0 5px;background-color: rgb(236, 235, 235);text-align: center;line-height: 25px;
    }
.search-and-filter {
    display: inline-block;
    align-items: center;
    margin-left: 20px;
    /* 可以添加其他布局相关的样式 */
}

.input-field,
.select-field {
  width: 110px;
  padding: 8px 12px; /* 内边距 */
  font-size: 16px; /* 字体大小 */
  border: 1px solid #ccc; /* 边框 */
  border-radius: 4px; /* 圆角 */
    /* 你可以添加其他样式，如宽度、高度、颜色等 */
}

.select-field {
    /* 针对选择框的额外样式，如果需要的话 */
    /* 例如，你可能想隐藏默认的箭头 */
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px 16px;
}

/* 额外的样式，如悬停和焦点效果 */
.input-field:hover,
.input-field:focus,
.select-field:hover,
.select-field:focus {
    border-color: #4CAF50; /* 聚焦时边框颜色 */
    outline: none; /* 移除默认的浏览器聚焦边框 */
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  background: white;
  color: blue;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

/* button:hover,
button.selected {
  transform: scale(1.1);
  background: linear-gradient(to right, #3464e0, #9214f4);
  color: white;
  /*border: 2px solid blue;*/
/* } */ 
.hover-div{
  padding: 10px;
}
.hover-div:hover {
  color: #1677ff;
}
</style>
    