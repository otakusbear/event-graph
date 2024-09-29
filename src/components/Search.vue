<script>
import { useRouter,useRoute } from 'vue-router'
import { defineComponent, ref } from 'vue';
import Nar from './Nar.vue';
import { useStore } from 'vuex'
import axios from 'axios';
import newGraph from './newGraph.vue'
import Graph from './Graph.vue'

export default({
  setup() {
    const store = useStore();
    const lists=store.state.searchData
    const router = useRouter();
    const getDetail=value=>{
        let self = this;
        axios.get('/api/event-data', {
          params: { event_topic: value },
        }).then(function (response) {
          store.commit('getTitle',value)
          store.commit('getEvent', response.data);
          router.push({ path: '/detail'})
        })
    }
    const toSearch=value=>{
      let self = this;
      self.input=value
      console.log(self.input)
      axios.get('/api/search', {
          params: { content: value },
      }).then(function (response) {
        store.commit('getTitle',response.data[0].title)
        store.commit('getSear', response.data);
        router.push({ path: '/search'})
      })
    }
    return {
      lists,
      getDetail,
      toSearch
    };
  },
  components: { Nar,newGraph,Graph }
});
</script>

<template>
  <a-layout :style="{minHeight:'100vh'}">
    <Nar></Nar>
    <a-layout-content :style="{ padding: '30px 0' }">
      <div class="sear">
        <a-input-search
            :style="{width: '600px'}"
            v-model:value="value"
            placeholder="请输入您想要了解的事件"
            enter-button="搜索"
            size="large"
            @search="toSearch"
        />
      </div>
      <div class="main">
          <div class="left1">
            <div  v-for="list in lists">
              <div @click="getDetail(list.title)">
                <div class="title1">{{list.title}}</div>
                <div class="content1">{{list.des}}</div>
              </div>
              <a-divider />
            </div>   
          </div>
          <div class="right1">
            <div class="up" style="overflow: hidden">
              <Graph></Graph>
            </div>
            <div class="down" style="overflow: hidden">
              <newGraph></newGraph>
            </div>
          </div>
      </div>     
    </a-layout-content>
  </a-layout>
</template>

<style>
.sear{
    margin-left: 100px ;
    margin-bottom: 20px;
}
.main{
    display: flex;
    margin:0 100px ;
}
.left1{
    width: calc(100vw - 1010px);
    min-width: 200px;
    /* border: 3px solid #fff;
    border-radius: 8px;
    background-color: #F0F8FF; */
    /* padding: 30px; */
    margin-right: 30px;
}
.up{
  border: 3px solid #fff;
  border-radius: 8px;
  width: 508px;
  height: 500px;
}
.down{
  border: 3px solid #fff;
  border-radius: 8px;
  width: 508px;
  height: 500px;
}
/* .zindex{
  border: 1px solid #fff;
  border-radius: 8px;
  overflow: hidden; 
  z-index: 9999998; 
  position: fixed; 
  width: 500px;
  height: 500px;
  background: 
  rgb(0, 0, 0); 
  opacity: 0.6;
} */
.title1{ 
  font-family: 'Palanquin Dark', sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: 	#1a0dab;
  margin-bottom: 5px;
}
.title1:hover {
  cursor: pointer;
  text-decoration:underline;
}
.content1{
  overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>
