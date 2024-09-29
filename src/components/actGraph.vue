<template>
  <div style="overflow: hidden;">
    <div id="searchbar" style="position: absolute; z-index: 1; width: 100%;left: 50%; top: 50%; transform: translate(-50%, -50%); transition: top 0.5s;"><div style="text-align: center"><input style="font-size: 18px;height: 50px;width: 320px;border-radius: 15px 0 0 15px;border: 1px solid #1984ff" v-model="selectedEventType" @keyup.enter="handleSelectChange" />
    <a-button style="border-radius: 0 15px 15px 0;height: 52px;background-color: #1f8ded" @click="handleSelectChange"><span style="color: #ffffff;font-size: 18px">生成图谱</span></a-button></div>
    <br>
    <div id="buttonbar" style="text-align: center;display: none"><a-button @click="showSubevents">显示子事件</a-button>
    <a-button @click="hideSubevents">隐藏子事件</a-button>
    <a-button @click="toggleTimeRelations">显示/隐藏时序关系</a-button>
<a-button @click="toggleCausalRelations">显示/隐藏因果关系</a-button></div>
    </div>
    <div style="z-index: 1;left: 50%;top: 50%; transform: translate(-50%, -50%); text-align: center;align-items: center;padding-top: 50px;position:absolute;width: 200px;height: 150px;background-color: #f9f9f9d9;border-radius: 10px;box-shadow: 0px 0px 10px rgba(0,0,0,0.2);" v-if="eventloading">
        <div class="loadingdot"></div>
      <div class="loadingdot"></div>
      <div class="loadingdot"></div>

        <p style="text-align: center;align-items: center;padding-top: 20px">事理图谱加载中···</p>
      </div>
<!--    <div ref="network" id="network"></div>-->
    <div class="tlcontainer" style="position:absolute;top: 40%;left: 10%;width:80%;height:50%;overflow-x: auto;overflow-y: hidden;scroll-behavior: smooth;">
      <div id="timeline" v-if="timelineData.length > 0">
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event top" v-if="event.name.length % 2 === 0" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>

            </div>
            <div class="event placeholder" v-else></div>
           <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">
             <h3>相关真实新闻</h3>
      <div class="modal-content">
        <div v-for="(item, index) in event.summary" class="event top" @click.stop="openLink(event.link[index])" v-bind:title="item">
          <div class="dot"></div>
          <p class="summary">{{ item }}</p>
          <p class="source">新闻来源:{{ event.source[index] }}</p>
        </div>
      </div>
    </div>
        </div>
    </div>
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event bottom" v-if="event.name.length % 2 === 1" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>

            </div>
            <div class="event placeholder" v-else></div>
          <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">
            <h3>相关真实新闻</h3>
      <div class="modal-content">
        <div v-for="(item, index) in event.summary" class="event top" @click.stop="openLink(event.link[index])" v-bind:title="item">
          <div class="dot"></div>
          <p class="summary">{{ item }}</p>
          <p class="source">新闻来源:{{ event.source[index] }}</p>
        </div>
      </div>
    </div>
        </div>
    </div>
</div>


    </div>
    <div id="timecontainer" style="z-index:2;display: block;" @scroll="updateLine">
      <h3 style="text-align: center;font-size: xx-large;font-weight: bolder;">事件新闻时间轴</h3>
      <div id="timeline" v-if="timelineData.length > 0">
    <div class="event" v-for="event in timelineData" :key="event.time" @click="openLink(event.link)" v-bind:title="event.summary" :class="{'top': event.name.length % 2 === 1, 'bottom': event.name.length % 2 === 0}">
        <div class="dot" v-bind:title="'发布时间:' + formatDate(event.time)"></div>
<!--  <p class="time">发布时间: {{ event.time }}</p>-->
          <p class="month">{{ formatMonth(event.time) }}</p>
  <p class="name">{{ event.name }}</p>
          <p class="summary">{{ event.summary }}</p>
    </div>
</div>

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
      eventloading:false,
      nodeId:null,
      x:'',
      y:'',
      dot:'',
      uniqueId: '',
      allData:[],
      loading:false,
      timelineData: [],
      selectedEventType: '',
      selectedEvent: null,
      nodes: new DataSet(),
      edges: new DataSet(),
      eventDataResponse: {
        events: [],
        subevents: [],
        time_relations: [],
        causal_relations: []
    },
      network: null,
      showTimeRelations: true, // 是否显示时序关系的边
    showCausalRelations: true, // 是否显示因果关系的边
    };
  },
//   computed: {
//     filteredTopEvents() {
//         return this.timelineData.filter(event => event.name.length % 2 === 0);
//     },
//     filteredBottomEvents() {
//         return this.timelineData.filter(event => event.name.length % 2 === 1);
//     }
// },
  async mounted() {


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
      // 创建一个HTML元素作为弹窗
var popup = document.createElement("div");
popup.style.display = "none";  // 初始时隐藏弹窗
    popup.style.position = "absolute";  // 采用绝对位置
popup.style.borderRadius = "10px";  // 设置圆角
popup.style.backgroundColor = "#f9f9f9";  // 设置背景颜色
popup.style.padding = "10px";  // 设置内边距
popup.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.2)";  // 设置阴影
document.body.appendChild(popup);  // 将弹窗添加到页面中
    function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};
    var uniqueId = 'id-' + Math.random().toString(36).substr(2, 16);
    console.log(uniqueId)
    this.uniqueId = uniqueId;


window.addEventListener('scroll', () => {
    var scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollupdate(scrollOffset);
});

window.addEventListener('resize',this.updateLine);
// 当点击弹窗以外的地方时，隐藏弹窗
window.addEventListener("click", function(event) {
    if (event.target != popup) {
        popup.style.display = "none";
    }
});
var self = this;
this.network.on('zoom', function (params) {
  if (self.nodeId!=null){
    self.updateLine();
  }
});
this.network.on("dragStart", function(params) {
    if (self.nodeId!=null){
    self.updateLine();
  }
});

this.network.on("dragEnd", function(params) {
    if (self.nodeId!=null){
    self.updateLine();
  }
});


    this.network.on("click", (params) =>  {

    if (params.nodes.length > 0) {
      document.body.style.cursor = 'wait';
        var nodeId = params.nodes[0];
        this.nodeId = this.network.getNodeAt(params.pointer.DOM);
        console.log(params)
      console.log(this.eventDataResponse.events)
        let wordFrequency = {};
this.eventDataResponse.events.forEach(event => {
    let subject = event['subject'];
    let object = event['object'];
    if(subject !== 'NON') wordFrequency[subject] = (wordFrequency[subject] || 0) + 1;
    if(object !== 'NON') wordFrequency[object] = (wordFrequency[object] || 0) + 1;
});
let maxFrequencyWord = Object.keys(wordFrequency).reduce((a, b) => wordFrequency[a] > wordFrequency[b] ? a : b);

        var subject = this.eventDataResponse.events.find(event => event.id === nodeId)['subject'] !== 'NON' ? this.eventDataResponse.events.find(event => event.id === nodeId)['subject'] : maxFrequencyWord;
var object = this.eventDataResponse.events.find(event => event.id === nodeId)['object']

var label = '';
// if(subject !== maxFrequencyWord && object !== maxFrequencyWord) {
//     label += maxFrequencyWord;
// }
label += subject;
label += this.eventDataResponse.events.find(event => event.id === nodeId)['predicate'];
label += object;


        // var label = this.eventDataResponse.events.find(event => event.id === nodeId)['event_desc']
      this.query = label;
      console.log(label)
        // 使用Bing搜索API来搜索label
        this.bingSingleSearch().then(searchResults => {



    // 计算箭头的位置和方向
    var dots = document.querySelectorAll(".dot");
    var searchTitle = this.formatDate(searchResults.data[0][0]);
    var dotsWithSearchTitle = Array.from(dots).filter(dot => dot.title.includes(searchTitle));
    if (this.dot){
      this.dot.forEach(function(dot) {
    var eventElement = dot.parentElement; // 获取dot元素的父元素
    eventElement.style.backgroundColor = ""; // 设置背景色为高亮（例如：黄色）
    eventElement.style.borderRadius = ""; // 设置为圆角矩形
    eventElement.style.boxShadow = "";
    eventElement.style.paddingBottom = "";
    eventElement.style.paddingTop = "";
});
    };
    this.dot = dotsWithSearchTitle
    this.x = params.pointer.DOM.x;
    this.y = params.pointer.DOM.y;
    console.log(dotsWithSearchTitle)
    this.dot.forEach(function(dot) {
    var eventElement = dot.parentElement; // 获取dot元素的父元素
    eventElement.style.backgroundColor = "#fcd3d3"; // 设置背景色为高亮（例如：黄色）
    eventElement.style.borderRadius = "15px"; // 设置为圆角矩形
    eventElement.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.7)";
    eventElement.style.paddingBottom = "2px";
    eventElement.style.paddingTop = "10px";
});



// 初始更新线条位置
this.updateLine();


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
                <p>新闻来源: ${searchResults.data[0][4]}</p>
                <p>真实性: ${searchResults.data[0][3]}</p>
                <p>标题: ${searchResults.data[0][2]}</p>
                <p>简介: ${searchResults.data[0][1]}</p>
                <p><a href="${searchResults.data[0][5]}" target="_blank">新闻源网页</a></p>
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

    if (this.nodeId!=null) {
        var nodePosition = this.network.getPositions([this.nodeId]);
        var domPosition = this.network.canvasToDOM(nodePosition[this.nodeId]);
        var scale = this.network.getScale();
        console.log(domPosition)
      console.log(this.nodeId)
        this.x = domPosition.x + 23*this.nodes.get(this.nodeId).label.length*scale;
        this.y = domPosition.y;
    }
  // 删除旧的 SVG 元素
  var oldSvg = document.getElementById("svg");
  if (oldSvg) {
    oldSvg.parentNode.removeChild(oldSvg);
  }

  // 创建新的 SVG 元素
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "svg";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = 2;

  // 创建线条元素
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.style.stroke = "grey";
  line.style.strokeWidth = "3px";
  line.style.strokeDasharray = "5,5"; // 设置为虚线

  // 添加线条到 SVG
  svg.appendChild(line);

  // 添加 SVG 到页面
  document.body.appendChild(svg);

  var dotRect = this.dot[0].getBoundingClientRect();
  line.setAttribute("x1", this.x );
  line.setAttribute("y1", this.y );
  line.setAttribute("x2", dotRect.left);
  line.setAttribute("y2", dotRect.top+3);
},
    scrollupdate(offset) {

  // 删除旧的 SVG 元素
  var oldSvg = document.getElementById("svg");
  if (oldSvg) {
    oldSvg.parentNode.removeChild(oldSvg);
  }

  // 创建新的 SVG 元素
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "svg";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = 2;

  // 创建线条元素
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.style.stroke = "grey";
  line.style.strokeWidth = "3px";
  line.style.strokeDasharray = "5,5"; // 设置为虚线

  // 添加线条到 SVG
  svg.appendChild(line);

  // 添加 SVG 到页面
  document.body.appendChild(svg);

  var dotRect = this.dot[0].getBoundingClientRect();
  line.setAttribute("x1", this.x );
  line.setAttribute("y1", this.y );
  line.setAttribute("x2", dotRect.left);
  line.setAttribute("y2", dotRect.top+3+offset);
},
    loadData() {
        this.loading = true;
        this.allData.forEach((event, index) => {
            setTimeout(() => {
                this.timelineData.push(event);
                this.$nextTick(() => {
                  const scrollContainer = document.querySelector('.tlcontainer');
                  scrollContainer.scrollTo(scrollContainer.scrollWidth, 0);
                    if (index === this.allData.length - 1) {
                        this.loading = false;
                        this.eventloading = false;
                    }
                });
            }, 2000 * index);
        });
        setTimeout(() => {
        const scrollContainer = document.querySelector('.tlcontainer');
        scrollContainer.scrollTo(0, 0);
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
  this.eventloading = true;
      this.timelineData = [];
      this.allData = [];
      const searchResults = await axios.get('/api/bing', {
    params: { event_topic: this.selectedEventType, count: "20" ,uniqueId: this.uniqueId},
  });
      console.log(searchResults)
      // 使用搜索结果更新时间轴数据
      this.allData = searchResults.data.map(result => ({
        time: result[0],  // 发布时间
        name: result[2],  // 标题
        source: result[4], //来源
        summary: result[1],  // 简介
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
    async bingSingleSearch() {
      const searchResults = await axios.get('/api/faiss', {
    params: { event_topic: this.query, count: 1, uniqueId: this.uniqueId},
  });
      console.log(searchResults)
      return searchResults;
    },
    handleSelectChange() {
    if (!this.selectedEventType) {
        alert('请输入检索词');
        return;
    }
    else {
      let element = document.getElementById('searchbar');
      element.style.top = '120px';
      let button = document.getElementById('buttonbar');
      button.style.display = 'block';
    this.getChunk();
    this.bingSearch();
    }
  },
    async getChunk(){
    this.eventDataResponse = {
        events: [],
        subevents: [],
        time_relations: [],
        causal_relations: []
    },
    this.eventloading = true;
    const response = await fetch(`/api/get_chunk?event_topic=${encodeURIComponent(this.selectedEventType)}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'text/event-stream',
  },
});

const reader = response.body.getReader();
// 更新节点和边
  this.nodes.clear();
  this.edges.clear();
  const nodeSet = new Set(); // 使用Set来存储已添加的节点
let i = 0;
let k = 0;
let buffer = "";
let subevents = [];
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  // 将新的内容添加到缓冲区
  buffer += new TextDecoder().decode(value);
  // 检查缓冲区中是否有完整的事件

    const match = buffer.match(/\{'event':.*?\}(?=, \{'event':|\]|$)/s);

    if (match) {
      // 如果有完整的事件，解析它并用它生成节点
      const event = JSON.parse(match[0].replace(/'/g, "\""));
      const event_buffer = {
  'id': event.index,
  'subject': event.event_triple[0],
  'predicate': event.event_triple[1],
  'object': event.event_triple[2]
};
this.eventDataResponse.events.push(event_buffer)

for (let j = 0; j < event.subevent_triple.length; j++) {
  let subevent_buffer = {
    'event_id': event.index,
    'id': k,
    'subject': event.subevent_triple[j][0],
    'predicate': event.subevent_triple[j][1],
    'object': event.subevent_triple[j][2]
  };
  k++;
  this.eventDataResponse.subevents.push(subevent_buffer);
}

      i++;
      console.log(event);
      // 如果subject不为'NON'且未被添加过，则添加subject节点
    if (event.event_triple[0] !== 'NON' && !nodeSet.has(event.event_triple[0])) {
      this.nodes.add({ id: event.event_triple[0], label: event.event_triple[0], color: 'lightblue' , font: { size: 20 }});
      nodeSet.add(event.event_triple[0]);
    }
    // 如果predicate不为'NON'且未被添加过，则添加predicate节点
    if (event.event_triple[1] !== 'NON') {
      this.nodes.add({ id: event.index, label: event.event_triple[1], color: 'pink', font: { size: 30 } });

    }
    // 如果object不为'NON'且未被添加过，则添加object节点
    if (event.event_triple[2] !== 'NON' && !nodeSet.has(event.event_triple[2])) {
      this.nodes.add({ id: event.event_triple[2], label: event.event_triple[2], color: 'lightblue', font: { size: 20 } });
      nodeSet.add(event.event_triple[2]);
    }

    // 如果subject和predicate都不为'NON'，则添加边
    if (event.event_triple[0] !== 'NON' && event.event_triple[1] !== 'NON') {
      this.edges.add({ from: event.event_triple[0], to: event.index, color: 'lightgray' });
    }
    // 如果predicate和object都不为'NON'，则添加边
    if (event.event_triple[1] !== 'NON' && event.event_triple[2] !== 'NON') {
      this.edges.add({ from: event.index, to: event.event_triple[2], color: 'lightgray' });
    }

      // 从缓冲区中删除已处理的事件
      buffer = buffer.slice(match[0].length);
      if (this.nodeId!=null){
    this.updateLine();
  }
    }

}
console.log(buffer)
const matchtime = buffer.match(/'time_relation': (\[\[.*?\]\])/);
if (matchtime) {
  const time_relations = JSON.parse(matchtime[1]);
  console.log(time_relations);
  for (const relation of time_relations) {
      this.edges.add({
      id: `time-relation-${relation[0]}-${relation[1]}`,
        from: relation[0],
        to: relation[1],
        color: '#c06c84',
        arrows: 'to',
        width: 5,
      });
      let time_buffer = {
    'event1_id': relation[0],
    'event2_id': relation[1]
  };
    this.eventDataResponse.time_relations.push(time_buffer);
  }
}
const matchcausal = buffer.match(/'causal_relation': (\[\[.*?\]\])/);
if (matchcausal) {
  const causal_relations = JSON.parse(matchcausal[1]);
  console.log(causal_relations);
  for (const relation of causal_relations) {
      this.edges.add({
      id: `causal-relation-${relation[0]}-${relation[1]}`,
        from: relation[0],
        to: relation[1],
        color: '#355c7d',
        dashes: [20, 20] ,
        arrows: 'to',
        width: 5,
      });
let causal_buffer = {
    'event1_id': relation[0],
    'event2_id': relation[1]
  };
    this.eventDataResponse.causal_relations.push(causal_buffer);
  }
  if (this.nodeId!=null){
    this.updateLine();
  }
}
  this.showTimeRelations = true;
  this.showCausalRelations = true;
// this.eventloading = false;
    },
    async getEventData() {
  // 获取事件数据
      this.eventloading = true;
      this.timer = setInterval(this.updateGraph, 1000); // 每秒更新一次
  const response = await axios.get('/api/stream_gen', {
    params: { event_topic: this.selectedEventType },
  });

  const eventData = response.data;
  this.eventDataResponse = eventData;
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
  this.eventloading = false;
},
async showSubevents() {
    // 获取事件数据
    const eventData = this.eventDataResponse;

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
  const eventData = this.eventDataResponse;

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
    const eventData = this.eventDataResponse;

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
    const eventData = this.eventDataResponse;

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
    align-items: center;
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
  width: 80%;
}
</style>