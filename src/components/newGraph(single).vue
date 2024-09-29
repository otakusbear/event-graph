<template>
  <div style="overflow-x: hidden">
    <div style="width: 100%;margin-top: 50px;"><div style="text-align: center"><input style="height: 40px;width: 240px;border-radius: 15px 0 0 15px;border: 1px solid #1984ff" v-model="selectedEventType" @keyup.enter="step1"/>
    <a-button style="border-radius: 0 15px 15px 0;height: 41px;background-color: #1f8ded" @click="getEventData"><span style="color: #ffffff">生成事件链</span></a-button></div>
  <a-button v-for="source in sourceSet" :key="source" @click="toggleSource(source)">
      {{ source }}
    </a-button>
    </div>
    <div style="z-index: 1;left: 50%;top: 50%; transform: translate(-50%, -50%); text-align: center;align-items: center;padding-top: 50px;position:fixed;width: 200px;height: 150px;background-color: #f9f9f9d9;border-radius: 10px;box-shadow: 0px 0px 10px rgba(0,0,0,0.2);" v-if="eventloading">
        <div class="loadingdot"></div>
      <div class="loadingdot"></div>
      <div class="loadingdot"></div>

        <p style="text-align: center;align-items: center;padding-top: 20px">加载中···</p>
      </div>
    <div id="step1" style="padding-left: 35px;display: none"><p style="font-size: xx-large">事件链</p></div>
    <div class="tlcontainer" style="padding: 100px;overflow-x: scroll;overflow-y: visible;scroll-behavior: smooth;">
      <div id="timeline" style="width: fit-content" v-if="timelineData.length > 0">
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event top" v-if="event.summary.length % 2 === 0" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>
<p v-for="item in event.summary" v-bind:title="item">{{ item }}</p>
            </div>
            <div class="event placeholder" v-else></div>
           <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h3>相关真实新闻</h3>
                <div class="row">
          <div v-for="index in event.index" class="event top" @click.stop="openLink(news[0][index][5])">
    <div class="dot"></div>
             <p class="name">{{ news[0][index][2] }}</p>
          <p class="summary">{{ news[0][index][1] }}</p>
    <p class="source">新闻来源:{{ news[0][index][4] }}</p>
</div>
        </div>

      </div>
    </div>
        </div>
    </div>
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event bottom" v-if="event.summary.length % 2 === 1" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>
<p v-for="item in event.summary" v-bind:title="item">{{ item }}</p>
            </div>
            <div class="event placeholder" v-else></div>
        <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">

      <div class="modal-content">
        <h3>相关真实新闻</h3>
        <div class="row">
          <div v-for="index in event.index" class="event top" @click.stop="openLink(news[0][index][5])">
    <div class="dot"></div>
             <p class="name">{{ news[0][index][2] }}</p>
          <p class="summary">{{ news[0][index][1] }}</p>
    <p class="source">新闻来源:{{ news[0][index][4] }}</p>
</div>
        </div>


      </div>
    </div>

    </div>

    </div>
</div>


    </div>

<!--    <div id="timecontainer" style="display: block;">-->
<!--      <h3 style="text-align: center;font-size: xx-large;font-weight: bolder;">事件新闻时间轴</h3>-->
<!--    <div id="timeline" v-if="timelineData.length > 0">-->
<!--        &lt;!&ndash; 时间轴上的每个点都是一个 'event' div &ndash;&gt;-->
<!--        <div class="event" v-for="event in timelineData" :key="event.time" @click="openLink(event.link)" v-bind:title="event.summary">-->
<!--  <div class="dot" v-bind:title="'发布时间:' + formatDate(event.time)"></div>-->
<!--&lt;!&ndash;  <p class="time">发布时间: {{ event.time }}</p>&ndash;&gt;-->
<!--          <p class="month">{{ formatMonth(event.time) }}</p>-->
<!--  <p class="name">{{ event.name }}</p>-->
<!--          <p class="summary">{{ event.summary }}</p>-->
<!--</div>-->

<!--        &lt;!&ndash; 更多的 'event' divs... &ndash;&gt;-->
<!--    </div>-->
<!--      &lt;!&ndash; 当 timelineData 数组为空时，显示环形进度条 &ndash;&gt;-->
<!--&lt;!&ndash;    <div class="loader"></div>&ndash;&gt;-->

<!--      <div style="text-align: center;align-items: center;padding-top: 20px" v-if="loading">-->
<!--        <div class="loadingdot"></div>-->
<!--      <div class="loadingdot"></div>-->
<!--      <div class="loadingdot"></div>-->

<!--        <p style="text-align: center;align-items: center;padding-top: 20px">新闻时间轴加载中···</p>-->
<!--      </div>-->

<!--</div>-->
    <div id="step2" style="padding: 35px;display: none"><p style="font-size: xx-large;">Step2:事理图谱</p><a-button @click="getEventData">生成图谱</a-button>
    <br>
    <div style="text-align: center"><a-button @click="showSubevents">显示子事件</a-button>
    <a-button @click="hideSubevents">隐藏子事件</a-button>
    <a-button @click="toggleTimeRelations">显示/隐藏时序关系</a-button>
<a-button @click="toggleCausalRelations">显示/隐藏因果关系</a-button></div></div>
    <div ref="network" id="network"></div>
  </div>
</template>

<script>
import { DataSet, Network } from 'vis-network/standalone';
import axios from 'axios';

export default {
  data() {
    return {
      eventloading:false,
      x:'',
      y:'',
      news:[], //新闻
      chains:[], //事件链
      dot:'',
      allData:[],
      sourceSet: [],
      loading:false,
      timelineData: [],
      selectedEventType: '',
      selectedEvent: null,
      nodes: new DataSet(),
      edges: new DataSet(),
      eventDataResponse: null,
      network: null,
      showTimeRelations: true, // 是否显示时序关系的边
    showCausalRelations: true, // 是否显示因果关系的边
    };
  },
  async mounted() {


    // 初始化图形
    const container = this.$refs.network;
    const data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    const options = {
  physics: {
    barnesHut: {
      springLength: 130,
      avoidOverlap: 0.05
    },
  },
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
window.addEventListener('scroll', this.updateLine);
window.addEventListener('resize', this.updateLine);
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



    // 计算箭头的位置和方向
    // var dots = document.querySelectorAll(".dot");
    // var searchTitle = this.formatDate(searchResults.data[0][0]);
    // var dotsWithSearchTitle = Array.from(dots).filter(dot => dot.title.includes(searchTitle));
    // this.dot = dotsWithSearchTitle
    // this.x = params.pointer.DOM.x;
    // this.y = params.pointer.DOM.y;
    // console.log(dotsWithSearchTitle)



// 初始更新线条位置
// this.updateLine();


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
  },
  methods: {
    openModal(event) {
      this.selectedEvent = event;
    },
    closeModal() {
      this.selectedEvent = null;
    },
  updateDotPosition() {
        if (this.dot) {
            var rect = this.dot.getBoundingClientRect();
            // 更新this.dot的位置信息
            this.dotTop = rect.top;
            this.dotLeft = rect.left;
        }
    },
    // 更新线条位置
updateLine() {
  console.log('更新线')
  // 创建 SVG 元素
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.style.position = "absolute";
svg.style.top = "0";
svg.style.left = "0";
svg.style.width = "100%";
svg.style.height = "100%";
svg.style.pointerEvents = "none";

// 创建线条元素
var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.style.stroke = "black";
line.style.strokeWidth = "3px";
line.style.strokeDasharray = "5,5"; // 设置为虚线

// 添加线条到 SVG
svg.appendChild(line);

// 添加 SVG 到页面
document.body.appendChild(svg);
console.log(this.x)
  var dotRect = this.dot[0].getBoundingClientRect();
  line.setAttribute("x1", this.x );
  line.setAttribute("y1", this.y+100 );
  line.setAttribute("x2", dotRect.left);
  line.setAttribute("y2", dotRect.top+10);
},

    loadData() {
      const step1 = document.getElementById('step1');
      step1.style.display = "block";
        this.eventloading = false;
        this.allData.forEach((event, index) => {
            setTimeout(() => {
                this.timelineData.push(event);
                this.$nextTick(() => {
                  const scrollContainer = document.querySelector('.tlcontainer');
                  scrollContainer.scrollTo(scrollContainer.scrollWidth, 0);
                    if (index === this.allData.length - 1) {


                    }
                });
            }, 2000 * index);
        });
        setTimeout(() => {

        const scrollContainer = document.querySelector('.tlcontainer');
        scrollContainer.scrollTo(0, 0);
        const step2 = document.getElementById('step2');
      step2.style.display = "block";
      const network = document.getElementById('network');
      network.style.display = "block";
    }, 2000 * this.allData.length);
    },
    formatDate(time) {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
    handleSelectChange() {
    this.getEventData();
    this.bingSearch();
  },
    async step1() {
     this.eventloading = true;
      const searchResults = await axios.get('/api/step1', {
    params: { event_topic: this.selectedEventType, count: "30" },
  });
      console.log(searchResults)
      // 使用搜索结果更新时间轴数据
      this.news.push(searchResults.data.news);
      this.chains.push(searchResults.data.chain);
      console.log(this.news);
      console.log(this.chains);
      this.allData = searchResults.data.results.map(result => ({
        time: result[0],  // 发布时间
        name: result[2],  // 标题
        summary: result[1],  // 简介
        index: result[3],
        source: result[4], //来源
        link: result[5],  // 新闻源网页链接
      }));
//       this.allData.sort((a, b) => {
//   // 将时间字符串转换为 Date 对象
//   const dateA = new Date(a.time);
//   const dateB = new Date(b.time);
//
//   // 按照时间顺序排序
//   return dateA - dateB;
// });
  this.loadData();
      return searchResults;
    },

//     async getEventData() {
//   // 获取事件数据
//       this.eventloading = true;
//   const response = await axios.get('/api/step2', {
//     params: { chains: JSON.stringify(this.chains) },
//   });
//   const eventData = response.data;
//
//   this.eventDataResponse = response;
//   // 更新节点和边
//   this.nodes.clear();
//   this.edges.clear();
//   const nodeSet = new Set(); // 使用Set来存储已添加的节点
//   for (const event of eventData.events) {
//     console.log(event)
//     // 如果subject不为'NON'且未被添加过，则添加subject节点
//     if (event.subject !== 'NON' && !nodeSet.has(event.subject)) {
//       this.nodes.add({ id: event.subject, label: event.subject, color: 'lightblue' , font: { size: 20 }});
//       nodeSet.add(event.subject);
//     }
//     // 如果predicate不为'NON'且未被添加过，则添加predicate节点
//     if (event.predicate !== 'NON') {
//     // 检查 event.news_index 是否为 false
//     if (event.news_index === false) {
//         // 如果为 false，将节点颜色设置为红色，并改变形状为三角形
//         this.nodes.add({ id: event.id, label: event.predicate, color: 'red', shape: 'triangle', font: { size: 30 } });
//     } else {
//         // 如果不为 false，保持原来的设置
//         this.nodes.add({ id: event.id, label: event.predicate, color: 'pink', font: { size: 30 } });
//     }
// }
//
//     // 如果object不为'NON'且未被添加过，则添加object节点
//     if (event.object !== 'NON' && !nodeSet.has(event.object)) {
//       this.nodes.add({ id: event.object, label: event.object, color: 'lightblue', font: { size: 20 } });
//       nodeSet.add(event.object);
//     }
//
//     // 如果subject和predicate都不为'NON'，则添加边
//     if (event.subject !== 'NON' && event.predicate !== 'NON') {
//       this.edges.add({ from: event.subject, to: event.id, color: 'lightgray' });
//     }
//     // 如果predicate和object都不为'NON'，则添加边
//     if (event.predicate !== 'NON' && event.object !== 'NON') {
//       this.edges.add({ from: event.id, to: event.object, color: 'lightgray' });
//     }
//   }
//
//   for (const relation of eventData.time_relations) {
//     const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
//     const toEvent = eventData.events.find(event => event.id === relation.event2_id);
//     if (fromEvent && toEvent) {
//       this.edges.add({
//       id: `time-relation-${relation.event1_id}-${relation.event2_id}`,
//         from: fromEvent.id,
//         to: toEvent.id,
//         color: '#c06c84',
//         arrows: 'to',
//         width: 5,
//       });
//     }
//   }
//
//   for (const relation of eventData.causal_relations) {
//     const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
//     const toEvent = eventData.events.find(event => event.id === relation.event2_id);
//     if (fromEvent && toEvent) {
//       this.edges.add({
//       id: `causal-relation-${relation.event1_id}-${relation.event2_id}`,
//         from: fromEvent.id,
//         to: toEvent.id,
//         color: '#355c7d',
//         dashes: [20, 20] ,
//         arrows:'to',
//         width: 5,
//       });
//     }
//   }
//   this.showTimeRelations = true;
//   this.showCausalRelations = true;
//   this.eventloading = false;
//   // 获取 timeline 容器中的所有 event 元素
// var eventElements = document.querySelectorAll('.event');
//
// // 遍历 eventData.events 的数据
// eventData.events.forEach(function(event) {
//     // 遍历每个事件的 news_index
//     event.news_index.forEach(function(index) {
//         // 找到对应索引的 event 元素并标记其背景颜色为浅蓝色
//         eventElements[index].style.backgroundColor = 'lightblue';
//         eventElements[index].style.borderRadius = '20px';
//     });
// });
// },

async getEventData() {
  // 获取事件数据
  this.eventloading = true;

  const eventData1 = {'topic': {'event_topic': 'topic'}, 'events': [{'id': 0, 'subject': '火锅店', 'predicate': '中毒', 'object': 'NON', 'news_index': ['腾讯新闻', 'ent.cnr.cn', '搜狐新闻', '百家号']}, {'id': 1, 'subject': '政府', 'predicate': '协调处理', 'object': '火锅店中毒事件', 'news_index': ['腾讯新闻', '搜狐新闻', '百家号']}, {'id': 2, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '社会关注', 'news_index': ['百家号', '搜狐新闻']}, {'id': 3, 'subject': '火锅店中毒事件', 'predicate': '警示', 'object': '食品安全', 'news_index': ['搜狐新闻', '百家号']}, {'id': 4, 'subject': '火锅店中毒事件', 'predicate': '善后工作', 'object': '进行中', 'news_index': ['腾讯新闻', '搜狐新闻']}, {'id': 5, 'subject': '火锅店中毒事件', 'predicate': '调查排查', 'object': 'NON', 'news_index': ['百家号']}, {'id': 6, 'subject': '火锅店中毒事件', 'predicate': '警示', 'object': '食客安全', 'news_index': ['百家号']}, {'id': 7, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '公众关注', 'news_index': ['搜狐新闻']}], 'subevents': [{'id': 0, 'subject': '火锅店', 'predicate': '发生', 'object': '一氧化碳中毒事件', 'event_id': 0}, {'id': 1, 'subject': '火锅店中毒事件', 'predicate': '导致', 'object': 'NON', 'event_id': 0}, {'id': 10, 'subject': '政府', 'predicate': '协调', 'object': '多部门处理火锅店中毒事件', 'event_id': 1}, {'id': 20, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '公众关注和担忧', 'event_id': 2}, {'id': 30, 'subject': '火锅店中毒事件', 'predicate': '提醒', 'object': '人们食品安全问题', 'event_id': 3}, {'id': 40, 'subject': '火锅店中毒事件', 'predicate': '善后工作', 'object': '进行中', 'event_id': 4}, {'id': 50, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '当地有关部门进行排查', 'event_id': 5}, {'id': 60, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '当地有关部门对所有餐饮场所进行排查', 'event_id': 6}, {'id': 70, 'subject': '火锅店中毒事件', 'predicate': '引发', 'object': '公众广泛关注和讨论', 'event_id': 7}], 'time_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}, {'event1_id': 0, 'event2_id': 4}, {'event1_id': 0, 'event2_id': 5}, {'event1_id': 0, 'event2_id': 6}, {'event1_id': 0, 'event2_id': 7}], 'causal_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}]}



  const eventData2 = {'topic': {'event_topic': 'topic'}, 'events': [{'id': 0, 'subject': '凉皮中毒事件', 'predicate': '发生', 'object': 'NON', 'news_index': ['腾讯新闻']}, {'id': 1, 'subject': '市场监管部门', 'predicate': '介入', 'object': 'NON', 'news_index': ['腾讯新闻', '百家号']}, {'id': 2, 'subject': '家属', 'predicate': '质疑', 'object': '凉皮质量', 'news_index': ['腾讯新闻', '光明网']}, {'id': 3, 'subject': '家属', 'predicate': '向媒体披露', 'object': '中毒细节', 'news_index': ['澎湃新闻']}, {'id': 4, 'subject': '市政府', 'predicate': '发布', 'object': '情况通告', 'news_index': ['百家号']}, {'id': 5, 'subject': '凉皮店', 'predicate': '查封', 'object': 'NON', 'news_index': ['新浪新闻', '百家号']}, {'id': 6, 'subject': '米酵菌酸中毒', 'predicate': '解释', 'object': 'NON', 'news_index': ['ent.cnr.cn']}], 'subevents': [{'id': 0, 'subject': '两名女子', 'predicate': '吃', 'object': '凉皮后中毒', 'event_id': 0}, {'id': 1, 'subject': '其中一人', 'predicate': '不幸身亡', 'object': 'NON', 'event_id': 0}, {'id': 2, 'subject': '另一人', 'predicate': '仍在', 'object': '接受抢救', 'event_id': 0}, {'id': 10, 'subject': '市场监督管理局', 'predicate': '证实', 'object': '中毒事件', 'event_id': 1}, {'id': 11, 'subject': '市场监督管理局', 'predicate': '对', 'object': '全市凉皮企业进行抽检', 'event_id': 1}, {'id': 20, 'subject': '家属', 'predicate': '怀疑', 'object': '凉皮变质', 'event_id': 2}, {'id': 21, 'subject': '家属', 'predicate': '称', 'object': '两人是米酵菌酸中毒', 'event_id': 2}, {'id': 30, 'subject': '家属', 'predicate': '向媒体披露', 'object': '中毒细节', 'event_id': 3}, {'id': 40, 'subject': '市政府', 'predicate': '发布', 'object': '情况通告', 'event_id': 4}, {'id': 50, 'subject': '全市凉皮店', 'predicate': '查封', 'object': 'NON', 'event_id': 5}, {'id': 60, 'subject': '医生', 'predicate': '解释', 'object': '两人是米酵菌酸中毒', 'event_id': 6}], 'time_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}, {'event1_id': 1, 'event2_id': 4}, {'event1_id': 4, 'event2_id': 5}], 'causal_relations': [{'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}, {'event1_id': 1, 'event2_id': 2}]};
  const eventData3 = {'topic': {'event_topic': 'topic'}, 'events': [{'id': 0, 'subject': '女孩', 'predicate': '吃', 'object': 'NON', 'news_index': ['中国网', '澎湃新闻', '腾讯新闻', '百家号', '网易', '新浪新闻']}, {'id': 1, 'subject': 'NON', 'predicate': '查封', 'object': 'NON', 'news_index': ['中国网', '澎湃新闻', '腾讯新闻', '百家号', '网易']}, {'id': 2, 'subject': '市场监督管理局', 'predicate': '对', 'object': '凉皮企业', 'news_index': ['中国网', '网易', '腾讯新闻', '百家号']}, {'id': 3, 'subject': '市场监督管理局', 'predicate': '调查', 'object': 'NON', 'news_index': ['网易', '百家号']}, {'id': 4, 'subject': '政府', 'predicate': '加强', 'object': 'NON', 'news_index': ['百家号']}, {'id': 5, 'subject': '市民', 'predicate': '关注', 'object': 'NON', 'news_index': ['腾讯新闻', '网易', '澎湃新闻', '百家号']}, {'id': 6, 'subject': '政府', 'predicate': '发布', 'object': 'NON', 'news_index': ['网易', '澎湃新闻']}, {'id': 7, 'subject': '监管部门', 'predicate': '确认', 'object': 'NON', 'news_index': ['腾讯新闻', '网易']}], 'subevents': [{'id': 0, 'subject': '女孩', 'predicate': '同行', 'object': '舅妈', 'event_id': 0}, {'id': 10, 'subject': '全市', 'predicate': '查封', 'object': 'NON', 'event_id': 1}, {'id': 11, 'subject': '禁止', 'predicate': '销售', 'object': 'NON', 'event_id': 1}, {'id': 20, 'subject': '市场监督管理局', 'predicate': '调查', 'object': 'NON', 'event_id': 2}, {'id': 30, 'subject': '市场监督管理局', 'predicate': '调查', 'object': 'NON', 'event_id': 3}, {'id': 40, 'subject': '政府', 'predicate': '加强', 'object': 'NON', 'event_id': 4}, {'id': 50, 'subject': '市民', 'predicate': '关注', 'object': 'NON', 'event_id': 5}, {'id': 60, 'subject': '政府', 'predicate': '发布', 'object': 'NON', 'event_id': 6}, {'id': 70, 'subject': '监管部门', 'predicate': '确认', 'object': 'NON', 'event_id': 7}], 'time_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}, {'event1_id': 0, 'event2_id': 4}, {'event1_id': 0, 'event2_id': 5}, {'event1_id': 0, 'event2_id': 6}, {'event1_id': 1, 'event2_id': 2}, {'event1_id': 1, 'event2_id': 3}, {'event1_id': 1, 'event2_id': 4}, {'event1_id': 1, 'event2_id': 5}, {'event1_id': 1, 'event2_id': 6}, {'event1_id': 2, 'event2_id': 3}, {'event1_id': 2, 'event2_id': 4}, {'event1_id': 2, 'event2_id': 5}, {'event1_id': 2, 'event2_id': 6}, {'event1_id': 3, 'event2_id': 4}, {'event1_id': 3, 'event2_id': 5}, {'event1_id': 3, 'event2_id': 6}, {'event1_id': 4, 'event2_id': 5}, {'event1_id': 4, 'event2_id': 6}, {'event1_id': 5, 'event2_id': 6}], 'causal_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}]};
  const eventData4 = {'topic': {'event_topic': 'topic'}, 'events': [{'id': 0, 'subject': '女子', 'predicate': '网购', 'object': '野生菌', 'news_index': ['新浪新闻', 'm.huanqiu.com']}, {'id': 1, 'subject': '女子', 'predicate': '操作', 'object': '未洗手', 'news_index': ['微博', 'www.gamersky.com', 'm.huanqiu.com', '百家号', '新浪网', '新浪新闻', 'news.cqnews.net']}, {'id': 2, 'subject': '女子', 'predicate': '嗦手指导致', 'object': '中毒', 'news_index': ['微博', 'm.huanqiu.com', '百家号', '新浪网', 'news.cqnews.net']}, {'id': 3, 'subject': '女子', 'predicate': '确诊', 'object': '中毒', 'news_index': ['微博', 'news.cqnews.net', '新浪新闻', '新浪网']}, {'id': 4, 'subject': '女子', 'predicate': '去', 'object': '医院就诊', 'news_index': ['微博', 'news.cqnews.net', '新浪网']}, {'id': 5, 'subject': '女子', 'predicate': '恢复', 'object': '健康', 'news_index': ['news.cqnews.net']}, {'id': 6, 'subject': '女子', 'predicate': '被切伤', 'object': '手指', 'news_index': ['百家号']}, {'id': 7, 'subject': '女子', 'predicate': '感染', 'object': '细菌', 'news_index': ['百家号']}], 'subevents': [{'id': 0, 'subject': '女子', 'predicate': '好奇', 'object': '味道', 'event_id': 0}, {'id': 1, 'subject': '女子', 'predicate': '网购', 'object': '1公斤见手青食用', 'event_id': 0}, {'id': 10, 'subject': '女子', 'predicate': '操作', 'object': '一直没洗手', 'event_id': 1}, {'id': 20, 'subject': '肌肉记忆', 'predicate': '嗦了下手指', 'object': 'NON', 'event_id': 2}, {'id': 21, 'subject': '导致', 'predicate': '轻微', 'object': '中毒', 'event_id': 2}, {'id': 30, 'subject': '女子', 'predicate': '确诊', 'object': '野生菌中毒', 'event_id': 3}, {'id': 40, 'subject': '女子', 'predicate': '去', 'object': '医院打了吊瓶', 'event_id': 4}, {'id': 50, 'subject': '女子', 'predicate': '已', 'object': '恢复健康', 'event_id': 5}, {'id': 60, 'subject': '女子', 'predicate': '手指', 'object': '被切伤', 'event_id': 6}, {'id': 70, 'subject': '细菌', 'predicate': '进入', 'object': '伤口引发感染', 'event_id': 7}], 'time_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 1, 'event2_id': 2}, {'event1_id': 2, 'event2_id': 3}, {'event1_id': 2, 'event2_id': 4}, {'event1_id': 3, 'event2_id': 5}, {'event1_id': 1, 'event2_id': 6}, {'event1_id': 1, 'event2_id': 7}], 'causal_relations': [{'event1_id': 1, 'event2_id': 2}, {'event1_id': 2, 'event2_id': 3}, {'event1_id': 2, 'event2_id': 7}]};
  const eventData5 = {'topic': {'event_topic': 'topic'}, 'events': [{'id': 0, 'subject': '家里', 'predicate': '报警称', 'object': '虫', 'news_index': ['腾讯新闻', '新浪网', '百家号']}, {'id': 1, 'subject': '中毒症状', 'predicate': '出现', 'object': 'NON', 'news_index': ['腾讯新闻', '百家号']}, {'id': 2, 'subject': '食用', 'predicate': '牛肝菌中毒', 'object': 'NON', 'news_index': ['腾讯新闻', 'news.hexun.com', '百家号']}, {'id': 3, 'subject': '救护行动', 'predicate': 'NON', 'object': 'NON', 'news_index': ['腾讯新闻']}, {'id': 4, 'subject': '警方', 'predicate': '警示', 'object': '食用野生蘑菇', 'news_index': ['news.hexun.com']}, {'id': 5, 'subject': '警方', 'predicate': '提醒', 'object': '烹饪蘑菇前清洗', 'news_index': ['news.hexun.com']}, {'id': 6, 'subject': '警方', 'predicate': '提醒', 'object': '避免生吃蘑菇', 'news_index': ['news.hexun.com']}], 'subevents': [{'id': 0, 'subject': '110', 'predicate': '接到', 'object': '报警电话', 'event_id': 0}, {'id': 1, 'subject': '民警', 'predicate': '到场', 'object': 'NON', 'event_id': 0}, {'id': 2, 'subject': '120', 'predicate': '急救人员', 'object': '到场', 'event_id': 0}, {'id': 3, 'subject': '民警', 'predicate': '秒懂', 'object': '季先生中毒幻觉', 'event_id': 0}, {'id': 10, 'subject': '季先生', 'predicate': '中毒幻觉', 'object': 'NON', 'event_id': 1}, {'id': 11, 'subject': '季先生', 'predicate': '不配合', 'object': '救治', 'event_id': 1}, {'id': 12, 'subject': '季先生妻子', 'predicate': '中毒症状', 'object': '出现', 'event_id': 1}, {'id': 20, 'subject': '季先生', 'predicate': '食用', 'object': '牛肝菌中毒', 'event_id': 2}, {'id': 21, 'subject': '季先生妻子', 'predicate': '食用', 'object': '牛肝菌中毒', 'event_id': 2}, {'id': 30, 'subject': '警方和医护人员', 'predicate': '抵达', 'object': '现场', 'event_id': 3}, {'id': 31, 'subject': '医护人员', 'predicate': '对', 'object': '季先生进行检查', 'event_id': 3}, {'id': 32, 'subject': '警方和医护人员', 'predicate': '配合', 'object': '将季先生送医院', 'event_id': 3}, {'id': 40, 'subject': '警方', 'predicate': '警示', 'object': '野生蘑菇危险性', 'event_id': 4}, {'id': 41, 'subject': '警方', 'predicate': '提醒', 'object': '烹饪蘑菇前清洗', 'event_id': 4}, {'id': 50, 'subject': '警方', 'predicate': '提醒', 'object': '清洗蘑菇', 'event_id': 5}, {'id': 51, 'subject': '警方', 'predicate': '提醒', 'object': '避免生吃蘑菇', 'event_id': 5}, {'id': 60, 'subject': '警方', 'predicate': '提醒', 'object': '避免生吃蘑菇', 'event_id': 6}, {'id': 61, 'subject': '警方', 'predicate': '提醒', 'object': '选择可信来源购买蘑菇', 'event_id': 6}], 'time_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 0, 'event2_id': 3}, {'event1_id': 1, 'event2_id': 2}, {'event1_id': 1, 'event2_id': 3}, {'event1_id': 2, 'event2_id': 3}], 'causal_relations': [{'event1_id': 0, 'event2_id': 1}, {'event1_id': 0, 'event2_id': 2}, {'event1_id': 1, 'event2_id': 2}]};
  this.eventDataResponse = [eventData1, eventData2];
  // 更新节点和边
  this.nodes.clear();
  this.edges.clear();
  const nodeSet = new Set(); // 使用Set来存储已添加的节点
  const edgeCount = {}; // 使用对象来存储边的计数

  const processEventData = (eventData, prefix) => {
    for (const event of eventData.events) {
      const nodeId = `${prefix}-${event.id}`;
      // 如果subject不为'NON'且未被添加过，则添加subject节点
      if (event.subject !== 'NON' && !nodeSet.has(event.subject)) {
        this.nodes.add({ id: event.subject, label: event.subject, color: 'lightblue' , font: { size: 20 }});
        nodeSet.add(event.subject);
      }
      // 如果predicate不为'NON'且未被添加过，则添加predicate节点
      if (event.predicate !== 'NON' && !nodeSet.has(event.predicate)) {
        // 检查 event.news_index 是否为 false
        if (event.news_index === false) {
          // 如果为 false，将节点颜色设置为红色，并改变形状为三角形
          this.nodes.add({ id: nodeId, label: event.predicate, color: 'red', shape: 'triangle', font: { size: 30 } });
        } else {
          // 如果不为 false，保持原来的设置
          this.nodes.add({ id: event.predicate, label: event.predicate, source: event.news_index, color: 'pink', font: { size: 30 } });
          nodeSet.add(event.predicate);
        }
      }

      // 如果object不为'NON'且未被添加过，则添加object节点
      if (event.object !== 'NON' && !nodeSet.has(event.object)) {
        this.nodes.add({ id: event.object, label: event.object, color: 'lightblue', font: { size: 20 } });
        nodeSet.add(event.object);
      }

      // 如果subject和predicate都不为'NON'，则添加边
      if (event.subject !== 'NON' && event.predicate !== 'NON') {
        const edgeId = `${event.subject}-${event.predicate}`;
        if (!edgeCount[edgeId]) {
          this.edges.add({ id: edgeId, from: event.subject, to: event.predicate, color: 'lightgray', label: '1' });
          edgeCount[edgeId] = 1;
        } else {
          edgeCount[edgeId]++;
          this.edges.update({ id: edgeId, label: String(edgeCount[edgeId]) });
        }
      }
      // 如果predicate和object都不为'NON'，则添加边
      if (event.predicate !== 'NON' && event.object !== 'NON') {
        const edgeId = `${event.predicate}-${event.object}`;
        if (!edgeCount[edgeId]) {
          this.edges.add({ id: edgeId, from: event.predicate, to: event.object, color: 'lightgray', label: '1' });
          edgeCount[edgeId] = 1;
        } else {
          edgeCount[edgeId]++;
          this.edges.update({ id: edgeId, label: String(edgeCount[edgeId]) });
        }
      }
    }

    // 添加关系边
    for (const relation of eventData.time_relations) {
      const edgeId = `time-relation-${prefix}-${eventData.events[relation.event1_id].predicate}-${eventData.events[relation.event2_id].predicate}`;
      if (!edgeCount[edgeId]) {
        this.edges.add({
          id: edgeId,
          from: eventData.events[relation.event1_id].predicate,
          to: eventData.events[relation.event2_id].predicate,
          color: '#c06c84',
          arrows: 'to',
          width: 5,
          label: '1'
        });
        edgeCount[edgeId] = 1;
      } else {
        edgeCount[edgeId]++;
        this.edges.update({ id: edgeId, label: String(edgeCount[edgeId]) });
      }
    }

    for (const relation of eventData.causal_relations) {
      const edgeId = `causal-relation-${prefix}-${eventData.events[relation.event1_id].predicate}-${eventData.events[relation.event2_id].predicate}`;
      if (!edgeCount[edgeId]) {
        this.edges.add({
          id: edgeId,
          from: eventData.events[relation.event1_id].predicate,
          to: eventData.events[relation.event2_id].predicate,
          color: '#355c7d',
          dashes: [20, 20],
          arrows:'to',
          width: 5,
          label: '1'
        });
        edgeCount[edgeId] = 1;
      } else {
        edgeCount[edgeId]++;
        this.edges.update({ id: edgeId, label: String(edgeCount[edgeId]) });
      }
    }
  };

  // 处理每个eventData
  processEventData(eventData1, 'eventData1');
  processEventData(eventData2, 'eventData2');
  processEventData(eventData3, 'eventData3');
  processEventData(eventData4, 'eventData4');
  processEventData(eventData5, 'eventData5');
  this.showTimeRelations = true;
  this.showCausalRelations = true;
  this.eventloading = false;
  // 创建一个Set来存储被关闭的新闻来源
const closedSources = new Set();
const sourceSet = new Set();
eventData1.events.forEach(event => {
  event.news_index.forEach(source => {
    sourceSet.add(source);
  });
});
eventData2.events.forEach(event => {
  event.news_index.forEach(source => {
    sourceSet.add(source);
  });
});
eventData3.events.forEach(event => {
  event.news_index.forEach(source => {
    sourceSet.add(source);
  });
});
eventData4.events.forEach(event => {
  event.news_index.forEach(source => {
    sourceSet.add(source);
  });
});
eventData5.events.forEach(event => {
  event.news_index.forEach(source => {
    sourceSet.add(source);
  });
});
// 保存this的引用
  const self = this;

  sourceSet.forEach(source => {
  const button = document.createElement('button');
  button.innerText = source;
  button.style.borderRadius = '12px'; // 设置圆角
  button.style.backgroundColor = '#F5F5DC'; // 设置背景颜色为米色
  button.style.borderLeft = '6px solid green'; // 设置左侧边缘为绿色
  button.style.color = 'black'; // 设置文本颜色
  button.style.padding = '15px 32px'; // 设置内边距
  button.style.textAlign = 'center'; // 设置文本对齐方式
  button.style.textDecoration = 'none'; // 移除文本装饰
  button.style.display = 'inline-block'; // 设置显示方式
  button.style.fontSize = '16px'; // 设置字体大小
  button.style.margin = '4px 2px'; // 设置外边距
  button.style.transitionDuration = '0.4s'; // 设置过渡效果的持续时间
  button.style.cursor = 'pointer'; // 设置鼠标样式

  // 设置鼠标悬停时的样式
  button.onmouseover = function() {
    button.style.backgroundColor = 'white';
    button.style.borderLeft = '6px solid green';
  }

  // 设置鼠标离开时的样式
  button.onmouseout = function() {
    if (closedSources.has(source)) {
      button.style.backgroundColor = '#F5F5DC';
      button.style.borderLeft = '6px solid green';
    } else {
      button.style.backgroundColor = 'white';
      button.style.borderLeft = '6px solid blue';
    }
  }

  button.addEventListener('click', () => {
    // 如果这个新闻来源已经被关闭，那么就移除它；否则，就添加它
    if (closedSources.has(source)) {
      closedSources.delete(source);
      button.style.backgroundColor = '#F5F5DC'; // 设置按钮为关闭状态的颜色
      button.style.borderLeft = '6px solid green'; // 设置左侧边缘为绿色
    } else {
      closedSources.add(source);
      button.style.backgroundColor = 'white'; // 设置按钮为打开状态的颜色
      button.style.borderLeft = '6px solid blue'; // 设置左侧边缘为蓝色
    }

    self.nodes.forEach(node => {
      // 检查node.source是否存在
      if (node.source) {
        // 检查这个节点的source字段是否只包含被关闭的新闻来源
        const onlyClosedSources = node.source.every(s => closedSources.has(s));
        self.nodes.update({ id: node.id, hidden: onlyClosedSources })
      }
    });

  });

  document.body.appendChild(button);


  });


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

<!--<style>-->
<!--#network {-->
<!--  width: 2000px;-->
<!--  height: 1000px;-->
<!--}-->
<!--</style>-->
<!--<style scoped>-->
<!--#timecontainer {-->
<!--    position: fixed;-->
<!--    right: 0;-->
<!--    top: 0;-->
<!--    width: 400px;-->
<!--    height: 100vh;-->
<!--    padding: 10px;-->
<!--    border-radius: 24px;-->
<!--    background-color: #f9f9f9d9;-->
<!--    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);-->
<!--    overflow-y: auto;-->
<!--}-->

<!--#timeline {-->
<!--    position: relative;-->
<!--    margin-left: 24px;-->
<!--}-->

<!--.event {-->
<!--    position: relative;-->
<!--    padding-left: 20px;-->
<!--    margin-bottom: 20px;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.event:before {-->
<!--    content: "";-->
<!--    position: absolute;-->
<!--    left: -10px;-->
<!--    top: 10px;-->
<!--    bottom: -10px;-->
<!--    width: 10px;-->
<!--    margin-left: 4px;-->
<!--    border-left: 2px dashed #283838-->

<!--}-->

<!--.dot {-->
<!--    position: absolute;-->
<!--    left: -10px;-->
<!--    width: 10px;-->
<!--    height: 10px;-->
<!--    border-radius: 50%;-->
<!--    background-color: #ffffff;  /* 设置点的颜色为透明 */-->
<!--    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */-->
<!--  transition: transform .2s;  /* 添加过渡效果 */-->
<!--  cursor: pointer;-->
<!--}-->
<!--.loadingdot {-->

<!--    left: 10px;-->
<!--    width: 10px;-->
<!--    height: 10px;-->
<!--    border-radius: 50%;-->
<!--    background-color: #ffffff;  /* 设置点的颜色为透明 */-->
<!--    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */-->
<!--    transition: transform .2s;  /* 添加过渡效果 */-->
<!--    cursor: pointer;-->
<!--    animation: jump 1s infinite;  /* 添加跳动动画 */-->
<!--  display: inline-block;-->
<!--  margin-right: 20px;-->
<!--}-->

<!--.loadingdot:nth-child(2) {-->
<!--    animation-delay: 0.2s;  /* 第二个点延迟1秒开始跳动 */-->
<!--}-->

<!--.loadingdot:nth-child(3) {-->
<!--    animation-delay: 0.4s;  /* 第三个点延迟2秒开始跳动 */-->
<!--}-->
<!--.loadingdot:nth-child(4) {-->
<!--    animation-delay: 0.6s;  /* 第三个点延迟2秒开始跳动 */-->
<!--}-->
<!--.loadingdot:nth-child(5) {-->
<!--    animation-delay: 0.8s;  /* 第三个点延迟2秒开始跳动 */-->
<!--}-->
<!--.loadingdot:nth-child(6) {-->
<!--    animation-delay: 1s;  /* 第三个点延迟2秒开始跳动 */-->
<!--}-->

<!--@keyframes jump {-->
<!--    0% { transform: translateY(0); }-->
<!--    50% { transform: translateY(-20px); }-->
<!--    100% { transform: translateY(0); }-->
<!--}-->
<!--.dot:hover {-->
<!--    transform: scale(2);  /* 当鼠标悬停时，放大点的大小 */-->
<!--}-->
<!--.time, .source, .summary {-->
<!--    display: none;-->
<!--}-->

<!--.event:hover .time, .event:hover .name, .event:hover .summary {-->
<!--    display: block;-->
<!--}-->
<!--.loader {-->
<!--    position: relative;-->
<!--    text-align: center;-->
<!--  align-items: center;-->
<!--    transform: translate(-50%, -50%);-->
<!--    border: 16px solid rgba(255, 255, 255, 0.1);  /* 半透明的白色 */-->
<!--    border-top: 16px solid #add8e6;  /* 蓝色 */-->
<!--    border-radius: 50%;-->
<!--    width: 120px;-->
<!--    height: 120px;-->
<!--    animation: spin 2s linear infinite;-->
<!--    backdrop-filter: blur(10px);  /* 添加毛玻璃效果 */-->
<!--}-->

<!--@keyframes spin {-->
<!--    0% { transform: rotate(0deg); }-->
<!--    100% { transform: rotate(360deg); }-->
<!--}-->
<!--p.summary{-->
<!--  font-weight: lighter;-->
<!--}-->
<!--p.name{-->
<!--  font-weight: bolder;-->
<!--  font-size: 19px;-->
<!--}-->
<!--</style>-->

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
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
    overflow-y: auto;
}

/*#timeline {*/
/*    position: relative;*/
/*    margin-left: 24px;*/
/*}*/

.event {
    position: relative;
    padding-left: 20px;
    /*margin-bottom: 20px;*/
  cursor: pointer;
}


.event.bottom:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 10px;
    bottom: -10px;
    width: 10px;
    margin-left: 4px;
    border-left: 2px solid #283838;
    height: 0;
    animation: grow-down 2s forwards;
}

@keyframes grow-down {
    to {height: 200px;}
}
.event.top:before {
    content: "";
    position: absolute;
    left: 0px;
    top: auto;
    bottom: 0px;
    width: 10px;
    margin-left: 4px;
    border-left: 2px solid #283838;
    height: 0;
    animation: grow-down 2s forwards;
    transform-origin: bottom;
    /*transform: scaleY(-1);*/
}

@keyframes grow-down {
    to {height: 200px;}
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
.dot::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    width: 0;
    height: 2px;
    border-top: 2px dashed #1890ff;
    animation: grow-right 2s forwards;
  animation-delay: 0.5s;
}

@keyframes grow-right {
    to {width: 320px;}
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
  margin-right: 10px;
  margin-left: 10px;
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
    /*display: none;*/
  padding: 10px;
}

.event:hover .time, .event:hover .name, .event:hover .summary {
  overflow: hidden;
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
  overflow: auto;
}
p.name{
  font-weight: bolder;
  font-size: 19px;
}
p.month{
  font-weight: bolder;
  font-size: 18px;
  position: absolute;
  left: -65px;
}
.event.top .month {
  top: 220px;
}
.event.bottom .month {
  top: -35px;
}
#timeline {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
}

.event {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    margin-right: 8px;
    width: 320px;  /* 设置事件的宽度 */
    height: 200px;  /* 设置事件的高度 */
    position: relative;
}

.event.placeholder {
    visibility: hidden;  /* 隐藏占位元素 */
}


.dot {
    position: absolute;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 2px solid #1890ff;
    transition: transform .2s;
    cursor: pointer;
}

/*.dot::before {*/
/*    content: "";*/
/*    position: absolute;*/
/*    left: 50%;*/
/*    width: 2px;*/
/*    background-color: #283838;*/
/*    border-left: 2px dashed #283838;*/
/*    animation: grow-down 2s forwards;*/
/*}*/

.dot::after {
    content: "";
    position: absolute;
    left: 100%;
    width: 100%;
    height: 2px;
    border-top: 2px dashed #1890ff;
    animation: grow-right 1s forwards 1s;
}

.event.top .dot {
    top: 100%;
}

.event.top .dot::before {
    top: 100%;
}

.event.top .dot::after {
    top: 50%;
}

.event.bottom .dot {
    top: 0;
}

.event.bottom .dot::before {
    top: 100%;
}

.event.bottom .dot::after {
    top: 50%;
}
.event.bottom {
  padding-top: 90px;
}
.tlcontainer {
  /* 设置滚动动画的持续时间为 2 秒 */
  /*padding-left: 4rem;*/
  transition: scroll-left 2s;
}
/* 隐藏滚动条的箭头 */
::-webkit-scrollbar-button {
  display: none;
}

/* 设置滚动条的宽度 */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  background: #888; /* 滑块的颜色 */
  border-radius: 5px; /* 滑块的圆角大小 */
}

/* 当鼠标悬停在滚动条上时，改变滑块的颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
<style>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: fit-content;
}
</style>