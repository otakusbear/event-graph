<template>
  <div>
      <input type="range" min="0" max="0.6" step="0.01" v-model.number="threshold" @change="getCluster">
    </div>
    <div>
      <span>{{ threshold }}</span>
    </div>
  <transition-group name="bubble" tag="div">
      <div v-for="bubble in bubbles" :key="bubble.id" class="bubble" @click="splitBubble(bubble)">
        {{ bubble.text }}
      </div>
    </transition-group>
  <div id="visualization"></div>
</template>

<script>
import axios from 'axios';
import { DataSet, Network } from 'vis-network/standalone';

export default {
  name: 'Graph',
  data() {
    return {
      threshold: 0.4,
      parent: '',
      index: null,
      expandedNodes: new Set(),
      translatedNodes: new Set(),
      nodesData: [

      ],
      edgesData: [],
      subNodes: {

      },
      bubbles: [
        { id: 'timeline', text: 'timeline' },
        { id: 'crisis', text: 'crisis' },
        { id: 'entities', text: 'entities' }
      ],
      subBubbles: {
        timeline: ['egypt', 'iraq', 'finan', 'bpoil', 'h1n1', 'haiti', 'mj', 'libya', 'syria'],
        crisis: ['egypt', 'yemen', 'libya', 'syria'],
        entities: ['Al_Gore', 'Angela_Merkel', 'Ariel_Sharon', 'Arnold_Schwarzenegger', 'Bashar_al-Assad', 'Bill_Clinton', 'Charles_Taylor', 'Chris_Brown', 'David_Beckham', 'David_Bowie', 'Dilma_Rousseff', 'Dmitry_Medvedev', 'Dominique_Strauss-Kahn', 'Edward_Snowden', 'Ehud_Olmert', 'Enron', 'Hamid_Karzai', 'Hassan_Rouhani', 'Hu_Jintao', 'Jacob_Zuma', 'John_Boehner', 'John_Kerry', 'Julian_Assange', 'Lance_Armstrong', 'Mahmoud_Ahmadinejad', 'Marco_Rubio', 'Margaret_Thatcher', 'Michael_Jackson', 'Michelle_Obama', 'Mitt_Romney', 'Morgan_Tsvangirai', 'Nawaz_Sharif', 'Nelson_Mandela', 'Osama_bin_Laden', 'Oscar_Pistorius', 'Phil_Spector', 'Prince_William', 'Robert_Mugabe', 'Rupert_Murdoch', 'Saddam_Hussein', 'Sarah_Palin', 'Silvio_Berlusconi', 'Steve_Jobs', 'Taliban', 'Ted_Cruz', 'Tiger_Woods', 'WikiLeaks']
      }
    };
  },
  mounted() {
    this.createNetwork();
  },
  methods: {
    updateNetwork(list) {
    // 获取当前网络中的节点和边
    const nodes = this.network.body.data.nodes.get();
    const edges = this.network.body.data.edges.get();
    console.log(nodes)
      console.log(edges)
    // 发送POST请求到后端
    axios.post('/api/update', { nodes, edges, list })
      .then(response => {
        // 使用返回的节点和边数据更新网络
        this.network.body.data.nodes.update(response.data.nodes);
        this.network.body.data.edges.update(response.data.edges);
      });
  },
    createNetwork() {
      const nodes = new DataSet(this.nodesData);
      const edges = new DataSet(this.edgesData);
      console.log(this.nodesData)
      console.log(this.edgesData)
      const container = document.getElementById('visualization');
      const data = { nodes, edges };
      const options = {
        edges: {
          arrows: { to: { enabled: true, type: 'arrow' } },
          width: 4,
        },
        nodes: {
          font: { multi:true },
          color: "#7BE141",
          shape: "dot",
        },
        physics: {
          barnesHut: {
            springLength: 200,
            avoidOverlap: 0.05
          },
        },
      };

      const network = new Network(container, data, options);
      console.log(network)
      // Initially show only nodes connected by green edges
      const greenEdges = this.edgesData.filter(edge => edge.color === 'green');
      const greenNodeIds = new Set(greenEdges.flatMap(edge => [edge.from, edge.to]));
      nodes.forEach(node => {
        node.hidden = !greenNodeIds.has(node.id);
        nodes.update(node);
      });

      network.on('click', params => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          // Show nodes connected by black edges when a node is clicked
          if (this.expandedNodes.has(nodeId)) {
            // Hide nodes connected by black edges when a node is clicked again
            this.hideConnectedNodes(nodeId, nodes);
            this.expandedNodes.delete(nodeId);
          } else {
            // Show nodes connected by black edges when a node is clicked
            this.showConnectedNodes(nodeId, nodes);
            this.expandedNodes.add(nodeId);
          }
          const node = nodes.get(nodeId);
          if (!this.translatedNodes.has(nodeId)) {  // 新增：只有当节点还没有被翻译过时，才调用翻译API
      axios.post('/api/translate', { src: node.label })
        .then(response => {
          node.label += '\n' + response.data;
          nodes.update(node);
        });
      this.translatedNodes.add(nodeId);  // 新增：将节点添加到已翻译节点的集合中
    }
          }
      });
    },
    showConnectedNodes(nodeId, nodes, visited = new Set()) {
  if (visited.has(nodeId)) {
    return;
  }
  visited.add(nodeId);

  const blackEdges = this.edgesData.filter(edge => edge.color === 'black' && (edge.from === nodeId || edge.to === nodeId));
  const blackNodeIds = new Set(blackEdges.flatMap(edge => [edge.from, edge.to]));
  nodes.forEach(node => {
    if (blackNodeIds.has(node.id)) {
      node.hidden = false;
      nodes.update(node);
      this.showConnectedNodes(node.id, nodes, visited);
    }
  });
},
    hideConnectedNodes(nodeId, nodes, visited = new Set()) {
      if (visited.has(nodeId)) {
        return;
      }
      visited.add(nodeId);

      const blackEdges = this.edgesData.filter(edge => edge.color === 'black' && (edge.from === nodeId || edge.to === nodeId));
      const blackNodeIds = new Set(blackEdges.flatMap(edge => [edge.to]));
      nodes.forEach(node => {

        if (blackNodeIds.has(node.id)) {

          node.hidden = true;
          nodes.update(node);
          this.hideConnectedNodes(node.id, nodes, visited);
        }
      });
    },
    splitBubble(bubble) {
      if (this.subBubbles[bubble.id]) {
        this.bubbles = this.subBubbles[bubble.id].map((text, index) => ({
          id: `${bubble.id}-${index}`,
          text
        }));
      } else if (bubble.id.includes('-')) {
        const [parent, index] = bubble.id.split('-');
        this.parent = parent;
        this.index = index;
        // Call your API here with `${parent}/${this.subBubbles[parent][index]}/` as the data_path
        axios.post('/api/clusterTL', { data_path: `${parent}/${this.subBubbles[parent][index]}/` , threshold: this.threshold})
              .then(response => {
                const graphData = response.data;
                this.nodesData = graphData.nodes;
                this.edgesData = graphData.links;
                console.log(graphData.nodes)
                console.log(graphData.links)
                this.createNetwork();
              });
      }
    },
    getCluster() {
      axios.post('/api/clusterTL', { data_path: `${this.parent}/${this.subBubbles[this.parent][this.index]}/` , threshold: this.threshold})
              .then(response => {
                const graphData = response.data;
                this.nodesData = graphData.nodes;
                this.edgesData = graphData.links;
                this.createNetwork();
              });
    }
  }
}
</script>

<style>
#visualization {
  width: 2000px;
  height: 1000px;
}
</style>
<style scoped>
.bubble {
  display: inline-block;
  margin: 1em;
  padding: 1em;
  border-radius: 50%;
  background-color: #7BE141;
  color: white;
  cursor: pointer;
    transition: transform .8s ease-out, opacity .8s ease-out;
}

.bubble-leave-active {
  position: absolute;
}

.bubble-enter, .bubble-leave-to {
  transform: scale(1.5);
  opacity: 0;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

</style>