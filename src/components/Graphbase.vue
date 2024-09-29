<template>
  <div>
    <h1 style="text-align:center">事理图谱数据库可视化页面</h1>
    <h2>选择事件主题:</h2>
    <select v-model="selectedEventType" @change="handleSelectChange">
      <option v-for="eventType in eventTypes" :key="eventType" :value="eventType">{{ eventType }}</option>
    </select>
    <br>
    <a-button @click="showSubevents">显示子事件</a-button>
    <a-button @click="hideSubevents">隐藏子事件</a-button>
    <a-button @click="toggleTimeRelations">显示/隐藏时序关系</a-button>
<a-button @click="toggleCausalRelations">显示/隐藏因果关系</a-button>

    <div ref="network" id="network"></div>
    <div id="timecontainer" style="display: block;">
      <h3 style="text-align: center;font-size: xx-large;font-weight: bolder;">事件新闻时间轴</h3>
    <div id="timeline" v-if="timelineData.length > 0">
        <!-- 时间轴上的每个点都是一个 'event' div -->
        <div class="event" v-for="event in timelineData" :key="event.time" @click="openLink(event.link)" v-bind:title="event.summary">
  <div class="dot" v-bind:title="'发布时间:' + formatDate(event.time)"></div>
<!--  <p class="time">发布时间: {{ event.time }}</p>-->
          <p class="month">{{ formatMonth(event.time) }}</p>
  <p class="name">{{ event.name }}</p>
          <p class="summary">{{ event.summary }}</p>
</div>

        <!-- 更多的 'event' divs... -->
    </div>
      <!-- 当 timelineData 数组为空时，显示环形进度条 -->
<!--    <div class="loader"></div>-->

      <div style="text-align: center;align-items: center;padding-top: 20px" v-if="loading">
        <div class="loadingdot"></div>
      <div class="loadingdot"></div>
      <div class="loadingdot"></div>

        <p style="text-align: center;align-items: center;padding-top: 20px">新闻时间轴加载中···</p>
      </div>

</div>

  </div>
</template>

<script>
import { DataSet, Network } from 'vis-network/standalone';
import axios from 'axios';

export default {
  data() {
    return {
      loading:false,
      allData:[],
      timelineData: [],
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
  //     springLength: 200,
  //     avoidOverlap: 0.5
  //   },
  // },
};
    this.network = new Network(container, data, options);
    // 创建一个HTML元素作为弹窗
var popup = document.createElement("div");
popup.style.display = "none";  // 初始时隐藏弹窗
    popup.style.position = "absolute";  // 采用绝对位置
popup.style.borderRadius = "10px";  // 设置圆角
popup.style.backgroundColor = "#f9f9f9";  // 设置背景颜色
popup.style.padding = "10px";  // 设置内边距
popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.1)";  // 设置阴影
document.body.appendChild(popup);  // 将弹窗添加到页面中

// 当点击弹窗以外的地方时，隐藏弹窗
window.addEventListener("click", function(event) {
    if (event.target != popup) {
        popup.style.display = "none";
    }
});

    this.network.on("click", (params) =>  {
    document.body.style.cursor = 'wait';
    if (params.nodes.length > 0) {
        var nodeId = params.nodes[0];
        console.log(params)
      console.log(this.eventDataResponse.data.events)
        let wordFrequency = {};
this.eventDataResponse.data.events.forEach(event => {
    let subject = event['subject'];
    let object = event['object'];
    if(subject !== 'NON') wordFrequency[subject] = (wordFrequency[subject] || 0) + 1;
    if(object !== 'NON') wordFrequency[object] = (wordFrequency[object] || 0) + 1;
});
let maxFrequencyWord = Object.keys(wordFrequency).reduce((a, b) => wordFrequency[a] > wordFrequency[b] ? a : b);

        var subject = this.eventDataResponse.data.events.find(event => event.id === nodeId)['subject'] !== 'NON' ? this.eventDataResponse.data.events.find(event => event.id === nodeId)['subject'] : maxFrequencyWord;
var object = this.eventDataResponse.data.events.find(event => event.id === nodeId)['object']

var label = '';
// if(subject !== maxFrequencyWord && object !== maxFrequencyWord) {
//     label += maxFrequencyWord;
// }
label += subject;
label += this.eventDataResponse.data.events.find(event => event.id === nodeId)['predicate'];
label += object;


        // var label = this.eventDataResponse.data.events.find(event => event.id === nodeId)['event_desc']
      this.query = label;
      console.log(label)
        // 使用Bing搜索API来搜索label
        this.bingSingleSearch().then(searchResults => {
          var date = new Date(searchResults.data[0][0]);  // 创建一个Date对象

// 创建一个DateTimeFormat对象，用于格式化日期时间
var formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Asia/Shanghai'  // 设置时区为上海
});

var formattedDate = formatter.format(date);  // 格式化日期时间
          console.log(formattedDate)
    // 将搜索结果添加到弹窗中
            popup.innerHTML = `
                <p>发布时间: ${formattedDate}</p>
                <p>真实性: ${searchResults.data[0][3]}</p>
                <p>标题: ${searchResults.data[0][2]}</p>
                <p>简介: ${searchResults.data[0][1]}</p>
                <p><a href="${searchResults.data[0][4]}" target="_blank">新闻源网页</a></p>
            `;
            popup.style.display = "block";  // 显示弹窗

            // 将弹窗定位到鼠标点击的位置
            popup.style.left = params.pointer.DOM.x + "px";
            popup.style.top = params.pointer.DOM.y + "px";
            document.body.style.cursor = 'default';
});

    }
});

    // 获取初始事件数据
    this.getEventData();
    this.bingSearch()
  },
  methods: {
    loadData() {
        this.loading = true;
        this.allData.forEach((event, index) => {
            setTimeout(() => {
                this.timelineData.push(event);
                this.$nextTick(() => {
                    if (index === this.allData.length - 1) {
                        this.loading = false;
                    }
                });
            }, 200 * index);
        });
    },
    formatDate(time) {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN');
  },
  formatMonth(time) {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
},
     openLink(url) {
      window.open(url, '_blank');
    },
    async bingSearch() {
      this.loading = true;
      this.timelineData = [];
      this.allData = [];
      const searchResults = await axios.get('/api/bing', {
    params: { event_topic: this.selectedEventType, count: "30" },
  });
      console.log(searchResults)
      // 使用搜索结果更新时间轴数据
      this.allData = searchResults.data.map(result => ({
        time: result[0],  // 发布时间
        name: result[2],  // 标题
        summary: result[1],  // 简介
        link: result[4],  // 新闻源网页链接
      }));
      this.allData.sort((a, b) => {
  // 将时间字符串转换为 Date 对象
  const dateA = new Date(a.time);
  const dateB = new Date(b.time);

  // 按照时间顺序排序
  return dateA - dateB;
});
  this.loadData();
      return searchResults;
    },
    async bingSingleSearch() {
      const searchResults = await axios.get('/api/faiss', {
    params: { event_topic: this.query, count: 1 },
  });
      console.log(searchResults)
      return searchResults;
    },
    async getEventData() {
  // 获取事件数据
  const response = await axios.get('/api/event-data', {
    params: { event_topic: this.selectedEventType },
  });
  const eventData = response.data;
  this.eventDataResponse = response;

  console.log(response)
  // 更新节点和边
  this.nodes.clear();
  this.edges.clear();
  const nodeSet = new Set(); // 使用Set来存储已添加的节点
  for (const event of eventData.events) {
    console.log(event.event_desc)
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
    handleSelectChange() {
    this.getEventData();
    this.bingSearch();
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
  width: 2000px;
  height: 1000px;
}
</style>
<style scoped>
#timecontainer {
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100vh;
    padding: 10px;
    border-radius: 24px;
    background-color: #f9f9f9d9;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    overflow-y: auto;
}

#timeline {
    position: relative;
    margin-left: 24px;
}

.event {
    position: relative;
    padding-left: 20px;
    margin-bottom: 20px;
  cursor: pointer;
}

.event:before {
    content: "";
    position: absolute;
    left: -10px;
    top: 10px;
    bottom: -10px;
    width: 10px;
    margin-left: 4px;
    border-left: 2px dashed #283838

}

.dot {
    position: absolute;
    left: -10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;  /* 设置点的颜色为透明 */
    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */
  transition: transform .2s;  /* 添加过渡效果 */
  cursor: pointer;
}
.loadingdot {

    left: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;  /* 设置点的颜色为透明 */
    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */
    transition: transform .2s;  /* 添加过渡效果 */
    cursor: pointer;
    animation: jump 1s infinite;  /* 添加跳动动画 */
  display: inline-block;
  margin-right: 20px;
}

.loadingdot:nth-child(2) {
    animation-delay: 0.2s;  /* 第二个点延迟1秒开始跳动 */
}

.loadingdot:nth-child(3) {
    animation-delay: 0.4s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(4) {
    animation-delay: 0.6s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(5) {
    animation-delay: 0.8s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(6) {
    animation-delay: 1s;  /* 第三个点延迟2秒开始跳动 */
}

@keyframes jump {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}
.dot:hover {
    transform: scale(2);  /* 当鼠标悬停时，放大点的大小 */
}
.time, .source, .summary {
    display: none;
}

.event:hover .time, .event:hover .name, .event:hover .summary {
    display: block;
}
.loader {
    position: relative;
    text-align: center;
  align-items: center;
    transform: translate(-50%, -50%);
    border: 16px solid rgba(255, 255, 255, 0.1);  /* 半透明的白色 */
    border-top: 16px solid #add8e6;  /* 蓝色 */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    backdrop-filter: blur(10px);  /* 添加毛玻璃效果 */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
p.summary{
  font-weight: lighter;
}
p.name{
  font-weight: bolder;
  font-size: 19px;
}
</style>
