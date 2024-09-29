<template>
  <Nar></Nar>
  <div class="button-area">
    <button class="icon-button">
      <i class="fa-solid fa-car-crash fa-2xl" style="color: #5db8fd;"></i>
      <span style="margin-top: 20px;">事故灾难</span>
    </button>
    <button class="icon-button">
      <i class="fa-solid fa-hospital fa-2xl" style="color: #FFD43B;"></i>
      <span style="margin-top: 20px;">公共卫生</span>
    </button>
    <button class="icon-button">
      <i class="fa-solid fa-shield-alt fa-2xl" style="color: #31d69c;"></i>
      <span style="margin-top: 20px;">社会安全</span>
    </button>
    <button class="icon-button">
      <i class="fa-solid fa-house-crack fa-2xl" style="color: #fd5353;"></i>
      <span style="margin-top: 20px;">自然灾害</span>
    </button>
    <button class="icon-button">
      <i class="fa-solid fa-ellipsis fa-2xl"></i>
      <span style="margin-top: 20px;">其他</span>
    </button>
  </div>
  <div class="container">
    <div class="header" style="font-size: 24px;text-align: center">事理图谱</div>
    <div class="chart" style="text-align: center" id="chart"></div>
  </div>

</template>

<script>
import Nar from './Nar.vue';
import data from '@/components/static/json/data.json'
import pattern from '@/components/static/json/pattern.json'
import * as d3 from 'd3'
import axios from "axios";
import { DataSet, Network } from 'vis-network/standalone';
import {useStore} from "vuex";
// import Graph2 from "./Graph2";
export default {
  name: 'CirclePacking',
  data() {
    return {
      nodes:new DataSet(),
      edges:new DataSet(),
      data: null,
      select_type:null,//
      offset:0,
    }
  },
  components: { Nar },
  mounted() {
    this.loadData()
  },
  methods: {
    async hidePopupWindow() {
  // 获取悬浮窗口元素
  const popupWindow = document.getElementById('popupWindow');
  if (popupWindow) {
    // 移除悬浮窗口元素
    document.body.removeChild(popupWindow);
  }
},

    async openPopupWindow(d) {
  // 创建一个新的 div 元素作为悬浮窗口
  const popupWindow = document.createElement('div');
  popupWindow.id = 'popupWindow';
  popupWindow.style.position = 'fixed';
  popupWindow.style.zIndex = '10';
  popupWindow.style.background = 'transparent';
popupWindow.style.top = '4%';  // 设置宽度
      popupWindow.style.left = '33%';  // 设置宽度
  popupWindow.style.borderRadius = '50%';  // 设置为圆形
  popupWindow.style.width = '700px';  // 设置宽度
  popupWindow.style.height = '700px';  // 设置高度
  // popupWindow.style.padding = '10px';
      popupWindow.style.overflow = 'hidden';
  popupWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  document.body.appendChild(popupWindow);

  // 创建一个新的 div 元素作为 vis-network 的容器
  const networkContainer = document.createElement('div');
  networkContainer.style.width = '700px';
  networkContainer.style.height = '700px';
  networkContainer.style.borderRadius = '50%';
  popupWindow.appendChild(networkContainer);
  // 创建一个新的 div 元素作为关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.style.position = 'absolute';
  closeButton.style.bottom = '10px'; // 靠近底部
  closeButton.style.left = '50%';
  closeButton.style.transform = 'translateX(-50%)';
  closeButton.style.cursor = 'pointer'; // 鼠标悬停时显示指针
  closeButton.style.zIndex = '11'; // 确保按钮在popupWindow之上
      closeButton.style.borderRadius = '8px';
  popupWindow.appendChild(closeButton);

  // 为关闭按钮添加点击事件监听器
  closeButton.addEventListener('click', function() {
    popupWindow.style.display = 'none'; // 隐藏悬浮窗口
  });
//     // 创建一个新的 div 元素作为按钮的容器
//   const buttonContainer = document.createElement('div');
//   buttonContainer.style.display = 'flex';
//   buttonContainer.style.justifyContent = 'space-between';
//   buttonContainer.style.position = 'absolute';
//   buttonContainer.style.bottom = '50%';  //
// buttonContainer.style.transform = 'translateY(50%)';  //
//   buttonContainer.style.left = '10px';
//   buttonContainer.style.right = '10px';
//   popupWindow.appendChild(buttonContainer);
//
//   // 创建左箭头按钮
// const leftButton = document.createElement('button');
// leftButton.style.border = 'none';  // 移除按钮的默认样式
// leftButton.style.background = 'transparent';  // 移除按钮的默认样式
// const leftIcon = document.createElement('i');
// leftIcon.classList.add('fas', 'fa-chevron-circle-left');  // 使用 Font Awesome 的左箭头图标
// leftIcon.style.fontSize = '50px';  // 增大图标的大小
// leftButton.appendChild(leftIcon);
//   leftButton.style.color = 'white';
//   leftButton.style.fontSize = '2em';
//   leftButton.style.cursor = 'pointer';
//   leftButton.style.transition = 'transform 0.3s ease';
//   leftButton.onmouseover = function() {
//     this.style.transform = 'scale(1.2)';
//   };
//   leftButton.onmouseout = function() {
//     this.style.transform = 'scale(1)';
//   };
//   leftButton.onclick = async () => {
//     this.offset -= 1;  // 更新 offset 参数
//     await this.getEventData(this.offset);
//     this.network.setData({
//       nodes: this.nodes,
//       edges: this.edges
//     });
//   };
//   buttonContainer.appendChild(leftButton);
//   //创建详情按钮
// const detailsButtonContainer = document.createElement('div');
// detailsButtonContainer.style.position = 'absolute';
// detailsButtonContainer.style.bottom = '10px';  // Adjust this value to position the button
// detailsButtonContainer.style.left = '50%';
// detailsButtonContainer.style.transform = 'translateX(-50%)';
// popupWindow.appendChild(detailsButtonContainer);
// // 在创建 detailsButton 之前
// const store = this.$store;
// // Create the details button
// const detailsButton = document.createElement('button');
// detailsButton.style.background = 'transparent';  // 移除按钮的默认样式
//       detailsButton.style.border = 'none';  // 移除按钮的默认样式
// // detailsButton.textContent = 'Details';
// const detailIcon = document.createElement('i');
// detailIcon.classList.add('fas', 'fa-magnifying-glass-chart');  // 使用 Font Awesome 的左箭头图标
// detailIcon.style.fontSize = '50px';  // 增大图标的大小
// detailsButton.appendChild(detailIcon);
// detailsButton.style.color = 'white';
// detailsButton.style.fontSize = '2em';
// detailsButton.style.cursor = 'pointer';
// detailsButton.style.transition = 'transform 0.3s ease';
// detailsButton.onmouseover = function() {
//   this.style.transform = 'scale(1.2)';
// };
// detailsButton.onmouseout = function() {
//   this.style.transform = 'scale(1)';
// };
// detailsButton.onclick = () => {
//   // Navigate to the Vue page and pass the current event as a parameter
//   // Replace 'YourVuePage' with the actual path to your Vue page
//   this.hidePopupWindow();
//     console.log(this.eventDataResponse.data.topic.event_topic)
//     store.commit('getTitle',this.eventDataResponse.data.topic.event_topic);
//   window.location.href = `#/example?event=${encodeURIComponent(JSON.stringify(this.eventDataResponse.data.topic.event_topic))}`;
// };
// detailsButtonContainer.appendChild(detailsButton);
//   // 创建右箭头按钮
// const rightButton = document.createElement('button');
// rightButton.style.border = 'none';  // 移除按钮的默认样式
// rightButton.style.background = 'transparent';  // 移除按钮的默认样式
// const rightIcon = document.createElement('i');
// rightIcon.classList.add('fas', 'fa-chevron-circle-right');  // 使用 Font Awesome 的右箭头图标
// rightIcon.style.fontSize = '50px';  // 增大图标的大小
// rightButton.appendChild(rightIcon);
//   rightButton.style.color = 'white';
//   rightButton.style.fontSize = '2em';
//   rightButton.style.cursor = 'pointer';
//   rightButton.style.transition = 'transform 0.3s ease';
//   rightButton.onmouseover = function() {
//     this.style.transform = 'scale(1.2)';
//   };
//   rightButton.onmouseout = function() {
//     this.style.transform = 'scale(1)';
//   };
//   rightButton.onclick = async () => {
//     this.offset += 1;  // 更新 offset 参数
//     await this.getEventData(this.offset);
//     this.network.setData({
//       nodes: this.nodes,
//       edges: this.edges
//     });
//   };
//   buttonContainer.appendChild(rightButton);
  // 调用 getEventData 函数获取事件数据
  await this.loadEventGraphData();

  // 使用 vis-network 创建图谱
  const data = {
    nodes: this.nodes,
    edges: this.edges
  };
  const options = {};  // 你可以在这里设置 Network 的选项
  this.network = new Network(networkContainer, data, options);
},
    async loadEventGraphData() {

  const eventData = pattern[this.select_type];

console.log(eventData)

  // 更新节点和边
  this.nodes.clear();
  this.edges.clear();
  const nodeSet = new Set(); // 使用Set来存储已添加的节点
  for (const event of eventData.events) {
    console.log(event.event_desc)
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
    if (event.event_triple[1] !== 'NON' && event.event_triple[1] !== 'NON') {
      this.edges.add({ from: event.event_triple[0], to: event.index, color: 'lightgray' });
    }
    // 如果predicate和object都不为'NON'，则添加边
    if (event.event_triple[1] !== 'NON' && event.event_triple[2] !== 'NON') {
      this.edges.add({ from: event.index, to: event.event_triple[2], color: 'lightgray' });
    }
  }

  for (const relation of eventData.time_relation) {
    const fromEvent = eventData.events.find(event => event.index === relation[0]);
    const toEvent = eventData.events.find(event => event.index === relation[1]);
    if (fromEvent && toEvent) {
      this.edges.add({
      id: `time-relation-${relation[0]}-${relation[1]}`,
        from: fromEvent.index,
        to: toEvent.index,
        color: '#c06c84',
        arrows: 'to',
        width: 5,
      });
    }
  }

  for (const relation of eventData.causal_relation) {
    const fromEvent = eventData.events.find(event => event.id === relation[0]);
    const toEvent = eventData.events.find(event => event.id === relation[1]);
    if (fromEvent && toEvent) {
      this.edges.add({
      id: `causal-relation-${relation[0]}-${relation[1]}`,
        from: fromEvent.index,
        to: toEvent.index,
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
async getEventData(offset=0) {
  // 获取事件数据
  const response = await axios.get('/api/type-data', {
    params: { event_topic: this.select_type , offset: offset },
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


  // 在你的函数中使用这个数据
  loadData() {
    this.data = data
    this.drawChart()
}
,

    drawChart() {
      // const width = 1000
      // const height = 1000
      let focus=null
      let view=null
      const svg = d3.select("#chart")
        .append("svg")
        .style("width", "80%")
        .style("overflow", "visible")
        .style("cursor","pointer")
        .on("click", () => zoom(root));
      // 获取SVG的宽度，并将其设置为高度
      const width = svg.node().getBoundingClientRect().width;
      const height = width
      svg.style("height", width + "px");
      // 当窗口大小改变时，重新设置SVG的高度
      window.addEventListener('resize', () => {
        const svg = d3.select("#chart svg");
        const width = svg.node().getBoundingClientRect().width;
        svg.style("height", width + "px");
      });
      const pack = d3.pack()
        .size([width, height])
        .padding(2)

      const root = d3.hierarchy(this.data)
        .sum(d => d.size)
        .sort((a, b) => b.value - a.value);

      focus = root;
      const nodes = pack(root).descendants();

      view = [root.x, root.y, root.r * 2];

      const color = d3.scaleSequential(d3.interpolateBlues)  // 创建一个蓝色色系的颜色比例尺
  .domain([0, 3]);  // 设置颜色比例尺的定义域为[0, 3]

const circle = svg.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("class", d => d.parent ? d.children ? "node" : "node node--leaf" : "node node--root")
  .style("fill", d => color(3-d.depth))  // 使用颜色比例尺根据节点的深度设置颜色
  .on("click", (event, d) => {
    if (focus !== d) zoom(d), event.stopPropagation();
    this.hidePopupWindow();
    if (d.depth === 2&&this.select_type!==d.data.name) {
      this.select_type=d.data.name;
      console.log(this.select_type)
    this.openPopupWindow(d);
  }
  })
  .on("mouseover", function(event, d) {  // 修改这一行
    d3.select(this).style("stroke", "#999").style("stroke-width", "4px");
    tooltip.style("visibility", "visible")
      .text(`${d.data.name} 在语料库中共有${d.value}条数据 , 占总体的${Math.round(100 * d.value / root.value)}%`)
      .style("left", (event.pageX + 10) + "px")  // 修改这一行
      .style("top", (event.pageY - 10) + "px");  // 修改这一行
  })
  .on("mouseout", function() {  // 添加这一行
    d3.select(this).style("stroke", null);
    tooltip.style("visibility", "hidden");// 添加这一行
  });  // 添加这一行
      // 遍历nodes数组，为每个节点对应的按钮添加点击事件
nodes.forEach((node, n) => {
  // 找到对应的按钮
  const buttons = Array.from(document.querySelectorAll('.icon-button span'));
  const span = buttons.find(span => span.textContent === node.data.name);

  // 如果找到了对应的span元素，再获取其父元素（即对应的按钮）
  if (span) {
    const button = span.parentNode;

    // 为按钮添加点击事件
    button.addEventListener('click', () => {
      if (focus !== node) zoom(node);
      this.hidePopupWindow();
      if (node.depth === 2) {
        this.select_type = node.data.name;
        console.log(this.select_type)
        this.openPopupWindow(node);
      }
    });
  }
});

const tooltip = d3.select("body").append("div")  // 添加这一行
    .data(nodes)
  .style("position", "absolute")  // 添加这一行
  .style("z-index", "10")  // 添加这一行
  .style("visibility", "hidden")  // 添加这一行
  .style("background", "white")  // 添加这一行
  .style("border-radius", "5px")  // 添加这一行
  .style("padding", "10px")  // 添加这一行
  .style("box-shadow", "0 0 10px rgba(0,0,0,0.5)") // 添加这一行
  .text(d => `${d.data.name} (${d.value} , ${Math.round(100 * d.value / root.value)}%)`);  // 添加这一行
const text = svg.selectAll("text")
  .data(nodes)
  .enter().append("text")
  .attr("class", "label")
  .style("fill-opacity", d => d.parent === root ? 1 : 0)
  .style("display", d => d.parent === root ? "inline" : "none")
    .style("text-anchor", "middle")  // 添加这一行
  .text(d => `${d.data.name} `);  // 修改这一行


      zoomTo([root.x, root.y, root.r * 2]);

      function zoomTo(v) {
        const k = width / v[2];
        const x = width / 2 - v[0] * k;  // 修改这一行
        const y = height / 2 - v[1] * k;  // 修改这一行

        view = v;

        circle.attr("transform", d => `translate(${(d.x * k + x)},${(d.y * k + y)})`)  // 修改这一行
              .attr("r", d => d.r * k);

        text.attr("transform", d => `translate(${(d.x * k + x)},${(d.y * k + y)})`)  // 修改这一行
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .style("display", d => d.parent === focus ? "inline" : "none");
      }

      function zoom(d) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(750)
            .tween("zoom", d => {
              const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
              return t => zoomTo(i(t));
            });

        text
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
    }
  }
}
</script>

<style scoped>
.node {
  cursor: pointer;
}

.node:hover {
  stroke: #ffffff;
  stroke-width: 1.5px;
}

.node--leaf {
  fill: white;
}

.label {
  font: 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}

.label,
.node--root,
.node--leaf {
  pointer-events: none;
}
</style>
<style scoped>
.button-area {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px; /* 根据需要调整 */
}
.icon-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 100px;
}
.icon-button {
  background-color: white;
  border: none;
  border-radius: 10px; /* 圆角大小 */
  padding: 10px 20px; /* 按钮内边距 */
  cursor: pointer;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.icon-button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 鼠标悬停时阴影效果 */
}

.font-awesome-icon {
  color: #333; /* 图标颜色 */
}
.container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.29); /* 添加阴影 */
  position: relative; /* 添加相对定位 */
}
.header {
  background-color: #8888ff;
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 24px;
  text-align: center;
  width: auto; /* 设置宽度自适应 */
  position: absolute; /* 设置绝对定位 */
  top: -10px; /* 设置顶部位置 */
  left: 10px; /* 设置左侧位置 */
}
.chart {
  text-align: center;
}
.chart svg {
  width: 100%; /* 设置宽度为100% */
  height: 100%; /* 设置高度为100% */
}
</style>