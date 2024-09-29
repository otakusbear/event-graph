<template>
  <div id="app">
    <div id="left">
      <div class="bubble" v-for="bubble in bubbles" :key="bubble.id" @click="clickBubble(bubble)">
        {{ bubble.text }}
        <div v-if="currentBubble === bubble.id">
          <div class="sub-bubble" v-for="subBubble in subBubbles[bubble.id]" :key="subBubble" @click.stop="clickSubBubble(bubble.id, subBubble)">
            {{ subBubble }}
          </div>
        </div>
      </div>
      <div class="item" v-for="item in items" :key="item[0]" draggable="true" @dragstart="dragStart(item)">
        {{ item[0] }}
        <ul>
          <li v-for="text in item[1]" :key="text">{{ text }}</li>
        </ul>
      </div>
    </div>
    <div id="right" @dragover.prevent @drop="drop">
      <div id="visualization" style="height: 100%"></div>
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  height: 100vh;
}

#left {
  flex: 1;
  overflow: auto;
}

#right {
  /*flex: 1;*/
  /*display: flex;*/
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 12px;
}

#right h1 {
  margin-bottom: 20px;
}
.bubble, .sub-bubble, .item {
  border-radius: 12px;
  padding: 10px;
  margin: 10px;
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
}

.bubble:hover, .sub-bubble:hover, .item:hover {
  background-color: #e0e0e0;
}
</style>

<script>
import axios from 'axios';
import { DataSet, Network } from 'vis-network/standalone';

export default {
  name: 'App',
  data() {
    return {
      bubbles: [
        { id: 'timeline', text: 'timeline' },
        { id: 'crisis', text: 'crisis' },
        { id: 'entities', text: 'entities' }
      ],
      subBubbles: {
        timeline: ['egypt', 'iraq', 'finan', 'bpoil', 'h1n1', 'haiti', 'mj', 'libya', 'syria'],
        crisis: ['egypt', 'yemen', 'libya', 'syria'],
        entities: ['Al_Gore', 'Angela_Merkel', 'Ariel_Sharon', 'Arnold_Schwarzenegger', 'Bashar_al-Assad', 'Bill_Clinton', 'Charles_Taylor', 'Chris_Brown', 'David_Beckham', 'David_Bowie', 'Dilma_Rousseff', 'Dmitry_Medvedev', 'Dominique_Strauss-Kahn', 'Edward_Snowden', 'Ehud_Olmert', 'Enron', 'Hamid_Karzai', 'Hassan_Rouhani', 'Hu_Jintao', 'Jacob_Zuma', 'John_Boehner', 'John_Kerry', 'Julian_Assange', 'Lance_Armstrong', 'Mahmoud_Ahmadinejad', 'Marco_Rubio', 'Margaret_Thatcher', 'Michael_Jackson', 'Michelle_Obama', 'Mitt_Romney', 'Morgan_Tsvangirai', 'Nawaz_Sharif', 'Nelson_Mandela', 'Osama_bin_Laden', 'Oscar_Pistorius', 'Phil_Spector', 'Prince_William', 'Robert_Mugabe', 'Rupert_Murdoch', 'Saddam_Hussein', 'Sarah_Palin', 'Silvio_Berlusconi', 'Steve_Jobs', 'Taliban', 'Ted_Cruz', 'Tiger_Woods', 'WikiLeaks']
      },
      currentBubble: null,
      items: [],
      draggedItem: null,
      nodesData: [

      ],
      edgesData: [],
      network:null,
    };
  },
  mounted() {
  this.createNetwork();
},

  methods: {
    clickBubble(bubble) {
      this.currentBubble = bubble.id;
    },
    clickSubBubble(bubbleId, subBubble) {
      axios.post('/api/readtl', { path: `${bubbleId}/${subBubble}/` })
        .then(response => {
          this.items = response.data;
        });
    },
    dragStart(item) {
      this.draggedItem = item;
    },
    drop() {
  // 检查this.network是否已经被初始化

  const nodes = this.network.body.data.nodes.get();
  const edges = this.network.body.data.edges.get();

  axios.post('/api/concat', { nodes: nodes, edges: edges, item: this.draggedItem })
    .then(response => {
      console.log(response.data)
      // this.nodesData = response.data.nodes;
      // this.edgesData = response.data.edges;
      this.network.body.data.nodes.update(response.data.nodes);
      this.network.body.data.edges.update(response.data.edges);
      // this.createNetwork();

    });

  this.draggedItem = null;
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
          hidden: false
        },
        physics: {
          barnesHut: {
            springLength: 200,
            avoidOverlap: 0.05
          },
        },
      };

      const network = new Network(container, data, options);
      this.network = network;
      network.fit()
      console.log(network)
      // Initially show only nodes connected by green edges

    },
  }
}
</script>
