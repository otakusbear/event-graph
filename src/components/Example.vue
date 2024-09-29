<script>
import { defineComponent, ref } from 'vue';
import Nar from './Nar.vue';
import Graph2 from './Graph2.vue';
import axios from 'axios';
export default defineComponent({
  props: {
    isEmbedded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      summary: '',
      timelineItems: [],
      stages: ['萌芽期', '发展期', '爆发期', '消退期'],
      eventSummaryItems: [],
    };
  },
  computed: {
    title() {
      return this.$store.state.title;
    },
  },
  watch: {
    title: {
      handler(newValue, oldValue) {
        // 当title发生变化时，这个函数会被调用
        // 您可以在这里更新组件的状态
        this.updateTimelineItems(newValue);
      },
      immediate: true,
    },
  },
  methods: {
    async updateTimelineItems(event) {
      const eventParam = event;
      const response = await axios.get(`api/getjson?event=${encodeURIComponent(eventParam)}`);
      const times = response.data.news.map(item => new Date(item[0]));
      const minDate = Math.min(times);
      const maxDate = Math.max(times);
      this.timelineItems = response.data.news.map(item => ({name: item[2], time: item[0], url: item[5], event_desc: this.markColor(item[1], response.data.chain.events), stage: this.getStage(item.time, minDate, maxDate)}));
      const eventDescs = this.timelineItems.map(item => item.event_desc);
      const response2 = await axios.post('api/sum', { event_descs: eventDescs });
      this.summary = response2.data.summary;
    },
    markColor(desc, triples) {

      triples.forEach(triple => {
        console.log(triple.event_triple[0])
        desc = desc.replace(triple.event_triple[0], `<span style="background-color: lightblue;font-size: 20px;padding: 2px">${triple.event_triple[0]}</span>`);
        desc = desc.replace(triple.event_triple[1], `<span style="background-color: #ffa6a6;font-size: 20px;padding: 2px">${triple.event_triple[1]}</span>`);
        desc = desc.replace(triple.event_triple[2], `<span style="background-color: lightblue;font-size: 20px;padding: 2px">${triple.event_triple[2]}</span>`);
        desc = desc.replace(triple.subevent_triple[0], `<span style="background-color: #fff983;font-size: 20px;padding: 2px">${triple.event_triple[0]}</span>`);
        desc = desc.replace(triple.subevent_triple[1], `<span style="background-color: #51f6bc;font-size: 20px;padding: 2px">${triple.event_triple[1]}</span>`);
        desc = desc.replace(triple.subevent_triple[2], `<span style="background-color: #fff983;font-size: 20px;padding: 2px">${triple.event_triple[2]}</span>`);
      });
      return desc;
    },
    getStage(time, minDate, maxDate) {
      const totalSpan = maxDate - minDate;
      const stageSpan = totalSpan / 4;
      const date = new Date(time);
      const index = Math.floor((date - minDate) / stageSpan);
      return this.stages[index];
    }
  },
  components: { Nar,Graph2 },
  async created() {
    const eventParam = this.$store.state.title;
    const response = await axios.get(`api/getjson?event=${encodeURIComponent(eventParam)}`);
    const times = response.data.news.map(item => new Date(item[0]));
    console.log(times)
    const minDate = Math.min(times);
    const maxDate = Math.max(times);
    this.timelineItems = response.data.news.map(item => ({name: item[2], time: item[0], url: item[5], event_desc: this.markColor(item[1], response.data.chain.events), stage: this.getStage(item.time, minDate, maxDate)}));
    console.log(this.timelineItems)
    this.eventSummaryItems = response.data.chain.events.map(item => ({event: item.event}));
  }
});
</script>

<template>
  <a-layout :style="{minHeight:'100vh'}" class="deMain">
    <Nar v-if="!isEmbedded"></Nar>
    <a-layout-content  class="detail">
      <a-card class="card">
        <div style="font-size: x-large;font-weight: bold">{{title}}</div>
        <a-divider />
        <div class="des">事件概述</div>
        <p>{{this.summary}}</p>
      </a-card>
      <div style="display: flex;flex-direction: row">
      <Graph2></Graph2>
      <a-layout :style="{width: '33%', float: 'left', backgroundColor: '#fff'}">
        <a-card title="事件演化摘要">
          <a-timeline
            :dataSource="eventSummaryItems"
          >
            <a-timeline-item v-for="item in eventSummaryItems" :key="item.event">
              <a-list-item-meta
                :title="item.event"
              />
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-layout>
        </div>
      <a-timeline >
        <div v-for="item in timelineItems">
          <a-timeline-item><a :href="item.url" target="_blank">{{item.name}}</a>
            <div v-html="item.event_desc"></div>
            <div>{{item.stage}}</div>
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
  margin: 1vh 1vw;
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
