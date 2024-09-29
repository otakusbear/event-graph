<template>
  <Nar></Nar>
  <div class="container">
    <div class="left" :class="{ collapsed: isCollapsed }" >
      <button class="collapse-button" @click="isCollapsed = !isCollapsed">{{ isCollapsed ? '→' : '←' }}</button>
      <div class="content">
      <ul>
        <li v-for="event in events.slice(0, 20)" :key="event.id" @click="showEventDetails(event)">
          <h3>{{ event.topic }}</h3>
          <p>{{ event.name }}</p>
        </li>
      </ul>
      </div>
    </div>
    <div class="center" id="network"></div>
    <div class="right" :class="{ collapsed: rightCollapsed }">
      <button class="collapse-right-button" @click="rightCollapsed = !rightCollapsed">{{ rightCollapsed ? '←' : '→' }}</button>
      <div class="content">
        <ExampleComponent v-if="eventDetails.topic" :event="eventDetails" :isEmbedded="true" />
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import Nar from './Nar.vue';
import ExampleComponent from './Example.vue';
export default {
  data() {
    return {
      allNodes: [],
      allEdges: [],
      nodes: [],
      edges: [],
      selectedNode: null,
      events: [],
      eventDetails: {},
      isCollapsed: false,
      rightCollapsed: false,
    };
  },
  components: { Nar, ExampleComponent },
  async mounted() {
    const nodesResponse = await axios.get('/api/nodes');
    const edgesResponse = await axios.get('/api/edges');
    this.allNodes = nodesResponse.data;
    this.allEdges = edgesResponse.data;
    this.nodes = this.allNodes.sort((a, b) => b['weight:int'] - a['weight:int']).slice(0, 10);
    this.edges = this.allEdges.filter(edge =>
      this.nodes.find(node => node['name:string'] === edge[':START_ID']) &&
      this.nodes.find(node => node['name:string'] === edge[':END_ID'])
    );

    // Create an array of nodes and edges for vis-network
    const nodes = new DataSet(this.nodes.map(node => ({id: node['name:string'], label: node['name:string']})));
    const edges = new DataSet(this.edges.map(edge => {
  const weight = edge['weight:int'];
  return {
    from: edge[':START_ID'],
    to: edge[':END_ID'],
    label: String(weight),
    color: {
      color: `rgba(0, 0, 0, ${weight / 100})`,  // The color depth is determined by the weight
      highlight: `rgba(0, 0, 0, ${weight / 100})`
    },
    width: weight  // The thickness is determined by the weight
  };
}));


    // Create a network
    const container = document.getElementById('network');
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
      edges:{
        arrows: 'to'
      }
    };
    const network = new Network(container, data, options);

    // Add event listeners
    network.on("click", params => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        this.selectedNode = this.nodes.find(node => node['name:string'] === nodeId);
        this.expandNode();
      }
    });
  },
  methods: {
  async expandNode() {
    // Get the edges connected to the selected node
    const connectedEdges = this.allEdges.filter(edge =>
      edge[':START_ID'] === this.selectedNode['name:string'] || edge[':END_ID'] === this.selectedNode['name:string']
    );

    // Get the nodes connected to the selected node
    const connectedNodesNames = new Set(connectedEdges.map(edge => edge[':START_ID'] === this.selectedNode['name:string'] ? edge[':END_ID'] : edge[':START_ID']));
    const connectedNodes = this.allNodes.filter(node => connectedNodesNames.has(node['name:string']));

    // Clear the network
    const container = document.getElementById('network');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Update the nodes and edges
    this.nodes = [this.selectedNode, ...connectedNodes];
    this.edges = connectedEdges;
    // Get the event details
    const eventResponse = await axios.get(`/api/event/${this.selectedNode['name:string']}`);
    this.events = eventResponse.data;
    // Update the network
    const nodes = new DataSet(this.nodes.map(node => ({id: node['name:string'], label: node['name:string']})));
    const edges = new DataSet(this.edges.map(edge => ({from: edge[':START_ID'], to: edge[':END_ID'], label: String(edge['weight:int'])})));
    const data = {nodes: nodes, edges: edges};
    const network = new Network(container, data, {});
    // Add event listeners
    network.on("click", params => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        this.selectedNode = this.nodes.find(node => node['name:string'] === nodeId);
        this.expandNode();
      }
    });
  },
    showEventDetails(event) {
    console.log(event)
    const store = this.$store;
      this.eventDetails = event;
      store.commit('getTitle',this.eventDetails.topic);
      this.$forceUpdate();
    },
},

};
</script>
<style scoped>
.container {
  display: flex;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}
.left, .center, .right {
  flex: 1;
}
.left, .right {
  flex: 0 0 30%;
  position: relative;
  background-color: #f0f0f0;
  transition: width 0.3s ease;
  overflow: visible;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .25);
}

.left .content {
  overflow: auto;
  max-height: 90vh;
  border-radius: 10px;
  background-color: white;
}
.right .content {
  overflow: auto;
  max-height: 90vh;
}
.left.collapsed, .right.collapsed {
  max-width: 0px;
}
.left ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.left li {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  transition: background-color 0.3s ease;
}
.left li:hover {
  background-color: #ddd;
  cursor: pointer;
}
.left h3 {
  font-size: 1.2em;
  font-weight: bold;
  color: #9370DB;
}
.collapse-button {
  position: absolute;
  z-index: 10;
  top: 0;
  right: -30px;
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  transition: right 0.3s ease;
}
.collapse-right-button {
  position: absolute;
  z-index: 10;
  top: 0;
  left: -30px;
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  transition: right 0.3s ease;
}
.collapse-button:hover {
  /*right: 0;*/
}
#network {
  height: 70em;
  width: auto;
}
</style>