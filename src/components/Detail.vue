<script>
import { defineComponent, ref } from 'vue';
import Nar from './Nar.vue';
import Graph from './Graph.vue';
import { useStore } from 'vuex'
import axios from 'axios';
export default defineComponent({
  setup() {
    const store = useStore();
    const lists=store.state.event;
    return {
      lists
    };
  },
  components: { Nar,Graph }
});
</script>

<template>
  <a-layout :style="{minHeight:'100vh'}" class="deMain">
    <Nar></Nar>
    <a-layout-content  class="detail">
      <a-card class="card">
        <div>{{lists.topic.event_topic}}</div>
        <a-divider />
        <div class="des">事件概述</div>
        <p>{{lists.topic.event_chain_desc}}</p>
      </a-card>
      <Graph></Graph>
      <a-timeline >
        <div v-for="list in lists.events">
          <a-timeline-item>{{list.name}}
            <div>{{list.event_desc}}</div>
          </a-timeline-item>
        </div>
      </a-timeline>     
    </a-layout-content>
  </a-layout>
</template>

<style>
.deMain{
  backgroundColor:'#DCDCDC'
}
.detail{
  border: 3px solid #fff;
  border-radius: 8px;
  margin: 30px 100px;
  background-color: #fff;
  padding: 30px;
}
.card{
  margin-bottom: 10px;
}
.des{
  font-family: 'Palanquin Dark', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: 	rgb(45, 45, 45);
}
</style>
