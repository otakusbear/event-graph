<template>
  <div>
    <a-button  @click="showSubevents">显示子事件</a-button>
    <a-button  @click="hideSubevents">隐藏子事件</a-button>
    <a-button  @click="toggleTimeRelations">显示/隐藏时序关系</a-button>
    <a-button  @click="toggleCausalRelations">显示/隐藏因果关系</a-button>
    <div ref="network" id="network"></div>
  </div>
</template>

<script>
import { DataSet, Network } from 'vis-network/standalone';
import axios from 'axios';
import { useStore } from 'vuex'

export default {
  data() {
    return {
      eventTypes: [],
      selectedEventType: '',
      nodes: new DataSet(),
      edges: new DataSet(),
      eventDataResponse: null,
      network: null,
      showTimeRelations: true, // 是否显示时序关系的边
      showCausalRelations: true, // 是否显示因果关系的边
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
        // 您可以在这里重新获取事件数据并渲染网络
        this.getEventData();
      },
      immediate: true,
    },
  },
  async mounted() {
    // 获取事件类型列表
    const response = await axios.get('/api/event-types');
    this.eventTypes = response.data;
    this.selectedEventType = this.eventTypes[0];

    // 初始化图形
    const container = this.$refs.network;
    const data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    const options = {
      // physics: {
      //   barnesHut: {
      //     springLength: 130,
      //     avoidOverlap: 0.05
      //   },
      // },
    };
    this.network = new Network(container, data, options);

    // 获取初始事件数据
    this.getEventData();
    this.network.fit();
  },
  methods: {

    async getEventData() {
      const title=this.$store.state.title;
      console.log(title)
       // 获取事件数据
      const response = await axios.get('/api/patternjson', {
        params: { event: title },
      });
      const eventData = response.data;
    this.eventDataResponse = response;
    // 更新节点和边
    this.nodes.clear();
    this.edges.clear();
    const nodeSet = new Set(); // 使用Set来存储已添加的节点
    for (const event of eventData.events) {
      // 如果subject不为'NON'且未被添加过，则添加subject节点
      if (event.subject !== 'NON' && !nodeSet.has(event.subject)) {
        this.nodes.add({ id: event.subject, label: event.subject, color: 'lightblue' , font: { size: 20 }});
        nodeSet.add(event.subject);
      }
      // 如果predicate不为'NON'且未被添加过，则添加predicate节点
      if (event.predicate !== 'NON') {
        this.nodes.add({ id: event.id, label: event.predicate, color: 'pink', font: { size: 30 } });

      }
      // 如果object不为'NON'且未被添加过，则添加object节点
      if (event.object !== 'NON' && !nodeSet.has(event.object)) {
        this.nodes.add({ id: event.object, label: event.object, color: 'lightblue', font: { size: 20 } });
        nodeSet.add(event.object);
      }

      // 如果subject和predicate都不为'NON'，则添加边
      if (event.subject !== 'NON' && event.predicate !== 'NON') {
        this.edges.add({ from: event.subject, to: event.id, color: 'lightgray' });
      }
      // 如果predicate和object都不为'NON'，则添加边
      if (event.predicate !== 'NON' && event.object !== 'NON') {
        this.edges.add({ from: event.id, to: event.object, color: 'lightgray' });
      }
    }

    for (const relation of eventData.time_relations) {
      const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
      const toEvent = eventData.events.find(event => event.id === relation.event2_id);
      if (fromEvent && toEvent) {
        this.edges.add({
        id: `time-relation-${relation.event1_id}-${relation.event2_id}`,
          from: fromEvent.id,
          to: toEvent.id,
          color: '#c06c84',
          arrows: 'to',
          width: 5,
        });
      }
    }

    for (const relation of eventData.causal_relations) {
      const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
      const toEvent = eventData.events.find(event => event.id === relation.event2_id);
      if (fromEvent && toEvent) {
        this.edges.add({
        id: `causal-relation-${relation.event1_id}-${relation.event2_id}`,
          from: fromEvent.id,
          to: toEvent.id,
          color: '#355c7d',
          dashes: [20, 20] ,
          arrows:'to',
          width: 5,
        });
      }
    }
    this.showTimeRelations = true;
    this.showCausalRelations = true;
},
async showSubevents() {
    // 获取事件数据
    const response = this.eventDataResponse;
    const eventData = response.data;

    // 更新节点和边
    for (const subevent of eventData.subevents) {
      // 如果subject不为'NON'，则添加subject节点
if (subevent.subject !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-subject`, label: subevent.subject, color: 'yellow', shape: 'box' , font: { size: 15 }});
}
// 如果predicate不为'NON'，则添加predicate节点
if (subevent.predicate !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-predicate`, label: subevent.predicate, color: 'lightgreen', font: { size: 20 } });
}
// 如果object不为'NON'，则添加object节点
if (subevent.object !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-object`, label: subevent.object, color: 'yellow', shape: 'box', font: { size: 15 } });
}

// 如果subject和predicate都不为'NON'，则添加边
if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
  this.edges.add({ id: `edge-subject-predicate-${subevent.id}`,from: `subevent-${subevent.id}-subject`, to: `subevent-${subevent.id}-predicate`, color: 'lightgray' });
}
// 如果predicate和object都不为'NON'，则添加边
if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
  this.edges.add({ id: `edge-predicate-object-${subevent.id}`, from: `subevent-${subevent.id}-predicate`, to: `subevent-${subevent.id}-object`, color: 'lightgray' });
}



      // 找到子事件对应的事件
      const event = eventData.events.find(event => event.id === subevent.event_id);
      if (event) {
        // 添加边，连接事件的predicate节点和子事件的predicate节点
        this.edges.add({ id: `edge-event-subevent-${subevent.id}`, from: event.id, to: `subevent-${subevent.id}-predicate`, color: 'lightgray', dashes: [5, 5] });
      }
    }
  },
  async hideSubevents() {
  // 获取事件数据
  const response = this.eventDataResponse;
  const eventData = response.data;

  // 删除子事件节点和边
  for (const subevent of eventData.subevents) {
    this.nodes.remove(`subevent-${subevent.id}-subject`);
    this.nodes.remove(`subevent-${subevent.id}-predicate`);
    this.nodes.remove(`subevent-${subevent.id}-object`);

    // 删除子事件之间的边
    if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
      this.edges.remove(`edge-subject-predicate-${subevent.id}`);
    }
    if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
      this.edges.remove(`edge-predicate-object-${subevent.id}`);
    }

    // 删除子事件和事件之间的边
    const event = eventData.events.find(event => event.id === subevent.event_id);
    if (event) {
      this.edges.remove(`edge-event-subevent-${subevent.id}`);
    }
  }
},
async toggleTimeRelations() {
    // 获取事件数据
    const response = this.eventDataResponse;
    const eventData = response.data;

    if (this.showTimeRelations) {
      // 隐藏时序关系的边
      for (const relation of eventData.time_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.remove(`time-relation-${relation.event1_id}-${relation.event2_id}`);
        }
      }
      this.showTimeRelations = false;
    } else {
      // 显示时序关系的边
      for (const relation of eventData.time_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.add({
          id: `time-relation-${relation.event1_id}-${relation.event2_id}`,
            from: fromEvent.id,
            to: toEvent.id,
            color: '#c06c84',
            arrows: 'to',
            width: 5,
          });
        }
      }
      this.showTimeRelations = true;
    }
  },
  async toggleCausalRelations() {
    // 获取事件数据
    const response = this.eventDataResponse;
    const eventData = response.data;

    if (this.showCausalRelations) {
      // 隐藏因果关系的边
      for (const relation of eventData.causal_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.remove(`causal-relation-${relation.event1_id}-${relation.event2_id}`);
        }
      }
      this.showCausalRelations = false;
    } else {
      // 显示因果关系的边
      for (const relation of eventData.causal_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.add({
          id: `causal-relation-${relation.event1_id}-${relation.event2_id}`,
            from: fromEvent.id,
            to: toEvent.id,
            color: '#355c7d',
            dashes: [20, 20] ,
            arrows:'to',
            width: 5,
          });
        }
      }
      this.showCausalRelations = true;
    }
  },
  },
};
</script>

<style>
#network {
  height: 33em;
  width: auto;
}
</style>
