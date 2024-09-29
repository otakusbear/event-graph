<template>
  <div>
    <!--width,height 画布的宽度，高度。 可以是百分比或像素，一般在dom元素上设置 -->
    <div id="network_id" class="network" style="height:80vh"></div>
    <a-modal v-model:visible="visible" title="请输入节点名称" :cancel-button-props="{ style: { display: 'none' } }" @ok="handleOk" :closable="false">
      <a-input v-model:value="value" placeholder="请输入节点名" />
    </a-modal>
  </div>
</template>
<script>
import Vis from "vis";
import { useStore } from 'vuex';
import { computed } from 'vue';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import axios from 'axios';
import { getCurrentInstance } from 'vue';

export default {
    setup() {
    const instance = getCurrentInstance();
    const verbMap = new Map();
  const store = useStore();
  const triples = computed(() => store.state.eventTriples);
  const events = computed(() => store.state.selectEvents);
  const nodesArray = reactive([]);
  const edgesArray = reactive([]);
  const nodeMap = new Map();

  onMounted(async () => {
    // Convert triples to pairs

    const event_pairs = computed(() => store.state.eventPairs);
    const double_event_pairs = computed(() => store.state.doubleEventPairs);
    // Get temporal and hierarchical relations between pairs
    const time_relations = computed(() => store.state.timeRelations);
    const level_relations = computed(() => store.state.levelRelations);
    console.log(double_event_pairs.value);
    console.log(event_pairs.value);
    console.log([time_relations.value, level_relations.value]);
    // Create edges between different triples based on their temporal and hierarchical relations
    for (let i = 0; i < event_pairs.value.length; i++) {
      const [sourceVerb, targetVerb] = event_pairs.value[i];
      const timeRelation = time_relations.value[i];
      const levelRelation = level_relations.value[i];
      console.log(targetVerb);
      // Get the source and target verb nodes
      const sourceVerbNode = nodeMap.get(verbMap.get(sourceVerb));
      console.log(sourceVerbNode);
      console.log(verbMap);
      const targetVerbNode = nodeMap.get(verbMap.get(targetVerb));
      console.log(targetVerbNode);
      // Create an edge based on the temporal or hierarchical relation
  if (timeRelation === '前') {
    edgesArray.push({
      from: sourceVerbNode.id,
      to: targetVerbNode.id,
      color: { color: 'blue' },
      arrows: 'to'
    });
  }
  if (timeRelation === '后') {
    edgesArray.push({
      from: targetVerbNode.id,
      to: sourceVerbNode.id,
      color: { color: 'blue' },
      arrows: 'to'
    });
  }
  if (levelRelation === '父') {
    edgesArray.push({
      from: sourceVerbNode.id,
      to: targetVerbNode.id,
      color: { color: 'red' },
      arrows: 'to'
    });
  }
  if (levelRelation === '子') {
    edgesArray.push({
      from: targetVerbNode.id,
      to: sourceVerbNode.id,
      color: { color: 'red' },
      arrows: 'to'
    });
}

      console.log(edgesArray)
    }
    instance.proxy.resetAllNodes();


  });

  for (let i = 0; i < triples.value.length; i++) {
    const [subject, verb, object] = triples.value[i];
    const event=events.value[i];

  // Check if the subject is not 'NON'
  let subjectNode;
  if (subject !== 'NON') {
    // Check if the subject node has already been added
    subjectNode = nodeMap.get(subject);
    if (!subjectNode) {
      // Create a new subject node
      subjectNode = { id: nodesArray.length, label: subject, color: { background: "pink" } };
      nodesArray.push(subjectNode);
      nodeMap.set(subject, subjectNode);
    }
  }

    // Check if the verb node has already been added
    let verbNode = nodeMap.get(verb);
    if (!verbNode) {
      // Create a new verb node
      verbNode = { id: nodesArray.length, color: { background: "lightblue" }, font: { size: 68 }};
      nodesArray.push(verbNode);
      nodeMap.set(verb, verbNode);
      // Create a new text node for the verb
    const verbTextNode = { id: nodesArray.length + textNodesArray.length, label: verb, shape: 'text', x: verbNode.x, y: verbNode.y + 30 };
    textNodesArray.push(verbTextNode);
  }
    }
     // Check if the object is not 'NON'
  let objectNode;
  if (object !== 'NON') {
    // Check if the object node has already been added
    objectNode = nodeMap.get(object);
    if (!objectNode) {
      // Create a new object node
      objectNode = { id: nodesArray.length, label: object, color: { background: "pink" }};
      nodesArray.push(objectNode);
      nodeMap.set(object, objectNode);
    }
  }

  // Create edges between the subject, verb, and object nodes
  if (subject !== 'NON') {
    edgesArray.push({ from: subjectNode.id, to: verbNode.id, dashes: true });
  }
  if (object !== 'NON') {
    edgesArray.push({ from: verbNode.id, to: objectNode.id, dashes: true });
  }

    // Update the verb map
const key = event;
verbMap.set(key, verb);
console.log(verbMap)
console.log(nodeMap)
  }

  return {
    nodesArray,
    edgesArray,
  };
},
  data() {
    return {
      name:'',
      value:'',
      visible: false,
      nodes: [],
      edges: [],
      textNodesArray: [],
      // network:null,
      container: null,
      //   节点数组
      nodesArray: this.nodesArray,
      //   关系线数组
      edgesArray: this.edgesArray,
      options: {},
      data: {}
    };
  },
  methods: {
    init() {
      let _this = this;
      //1.创建一个nodes数组
      _this.nodes = new Vis.DataSet(_this.nodesArray);
      //2.创建一个edges数组
      _this.edges = new Vis.DataSet(_this.edgesArray);
      _this.container = document.getElementById("network_id");
      _this.data = {
        nodes: _this.nodes,
        edges: _this.edges
      };
      _this.options = {
        autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
        locale: "cn", //语言设置：工具栏显示中文
        //设置语言
        locales: {
          cn: {
            //工具栏中文翻译
            edit: "编辑",
            del: "删除当前节点或关系",
            back: "返回",
            addNode: "添加节点",
            addEdge: "添加连线",
            editNode: "编辑节点",
            editEdge: "编辑连线",
            addDescription: "点击空白处可添加节点",
            edgeDescription: "点击某个节点拖拽连线可连接另一个节点",
            editEdgeDescription: "可拖拽连线改变关系",
            createEdgeError: "无法将边连接到集群",
            deleteClusterError: "无法删除集群.",
            editClusterError: "无法编辑群集'"
          }
        },

        // 设置节点样式
        nodes: {
          shape: "circle",
          size: 50,
          font: {
            //字体配置
            size: 32
          },
          color: {
            // border: "#2B7CE9", //节点边框颜色
            background: "#97C2FC", //节点背景颜色
            highlight: {
              //节点选中时状态颜色
              border: "#2B7CE9",
              background: "#D2E5FF"
            },
            hover: {
              //节点鼠标滑过时状态颜色
              border: "#2B7CE9",
              background: "#D2E5FF"
            }
          },
          borderWidth: 0, //节点边框宽度，单位为px
          borderWidthSelected: 2 //节点被选中时边框的宽度，单位为px
        },
        // 边线配置
        edges: {
          width: 1,
          length: 260,
          color: {
            color: "#848484",
            highlight: "#848484",
            hover: "#848484",
            inherit: "from",
            opacity: 1.0
          },
          shadow: true,
          smooth: {
            //设置两个节点之前的连线的状态
            enabled: true //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
          },
          arrows: { to: true } //箭头指向to
        },
        //计算节点之前斥力，进行自动排列的属性
        physics: {
          enabled: true, //默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
          barnesHut: {
            gravitationalConstant: -4000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.05
          }
        },
        //用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
        interaction: {
          hover: true,
          dragNodes: true, //是否能拖动节点
          dragView: true, //是否能拖动画布
          hover: true, //鼠标移过后加粗该节点和连接线
          multiselect: true, //按 ctrl 多选
          selectable: true, //是否可以点击选择
          selectConnectedEdges: true, //选择节点后是否显示连接线
          hoverConnectedEdges: true, //鼠标滑动节点后是否显示连接线
          zoomView: true //是否能缩放画布
        },
        //操作模块:包括 添加、删除、获取选中点、设置选中点、拖拽系列、点击等等
        manipulation: {
          enabled: true, //该属性表示可以编辑，出现编辑操作按钮
          addNode: function(nodeData,callback) {
            nodeData.id=_this.nodes.length;
            callback(nodeData);
          },
          // addNode:true,
          addEdge: function(edgeData,callback) {
            if (edgeData.from === edgeData.to) {
              var r = confirm("Do you want to connect the node to itself?");
              if (r === true) {
                callback(edgeData);
              }
            }
            else {
              callback(edgeData);
            }
          },
          editNode: function(data,callback){
            _this.visible = true;
            data.label=_this.value;
            callback(data)

          },
          editEdge: true,
          deleteNode: true,
          deleteEdge: true
        },
      };

      _this.network = new Vis.Network(
        _this.container,
        _this.data,
        _this.options
      );
    },
    handleOk(){
      this.visible = false;
    },
    resetAllNodes() {
      let _this = this;
      _this.nodes.clear();
      _this.edges.clear();
      _this.nodes.add(_this.nodesArray);
      _this.edges.add(_this.edgesArray);
      _this.data = {
        nodes: _this.nodes,
        edges: _this.edges
      };
      //   network是一种用于将包含点和线的网络和网络之间的可视化展示
      _this.network = new Vis.Network(
        _this.container,
        _this.data,
        _this.options
      );
    },
    resetAllNodesStabilize() {
      let _this = this;
      _this.resetAllNodes();
      _this.network.stabilize();
    }
  },

  mounted() {
    this.init();
    // 点击事件
    this.network.on("click", params => {

      // nodes.update({id:params.nodes[0], label:this.value});
    });
    // 点击鼠标右键事件
    this.network.on("oncontext", params => {

    });
  }
};
</script>
<style>
</style>