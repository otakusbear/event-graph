<!--<template>-->
<!--  <div id="viz"></div>-->
<!--</template>-->

<!--<script>-->
<!--import neo4j from 'neo4j-driver';-->
<!--import NeoVis from 'neovis.js';-->
<!--export default {-->
<!--  name: 'NeoVisComponent',-->
<!--  async mounted() {-->
<!--    const driver = neo4j.driver(-->
<!--      "neo4j+s://dbd88787.databases.neo4j.io",-->
<!--      neo4j.auth.basic("neo4j", "LyOENqyLIEJwnbL1g9dVTZPD1yBE2TWSiodFaRAHdFw")-->
<!--    );-->
<!--    const session = driver.session();-->
<!--    let result;-->
<!--    try {-->
<!--      result = await session.run("MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 25");-->
<!--      result.records.forEach(record => {-->
<!--        console.log(record.get('n'));-->
<!--        console.log(record.get('r'));-->
<!--        console.log(record.get('m'));-->
<!--      });-->
<!--    } finally {-->
<!--      await session.close();-->
<!--    }-->
<!--    // on application exit:-->
<!--    await driver.close();-->
<!--    const config = {-->
<!--  container_id: 'viz', // 指定容器ID-->
<!--  neo4j: {-->
<!--        serverUrl:"neo4j://dbd88787.databases.neo4j.io",-->
<!--        serverUser:"neo4j",-->
<!--        serverPassword:"LyOENqyLIEJwnbL1g9dVTZPD1yBE2TWSiodFaRAHdFw",-->
<!--        driverConfig: {-->
<!--            encrypted:"ENCRYPTION_ON",-->
<!--            trust:"TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"-->
<!--            }-->
<!--    },-->
<!--      initialCypher: "MATCH p=(:Dataset) RETURN p"-->
<!--};-->
<!--const viz = new NeoVis(config);-->
<!--viz.render();-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--#viz {-->
<!--  width: 800px;-->
<!--  height: 600px;-->
<!--}-->
<!--</style>-->


<template>
  <div id="viz"></div>
</template>

<script>
import NeoVis from 'neovis.js';
export default {
  data:function(){
    return{}
  },
  mounted() {
    this.$nextTick(() => {
    this.draw();
  });
  },
  methods:{
        draw:function(){
          console.log("lalallalalalal");
           var config = {
                containerId: "viz",
                  neo4j: {
        serverUrl:"neo4j://dbd88787.databases.neo4j.io",
        serverUser:"neo4j",
        serverPassword:"LyOENqyLIEJwnbL1g9dVTZPD1yBE2TWSiodFaRAHdFw",
        driverConfig: {
            encrypted:"ENCRYPTION_ON",
            trust:"TRUST_SYSTEM_CA_SIGNED_CERTIFICATES"
            }
    },
                labels: {
                    Entity: {
                        label: "name",
                    },
                  Predicate: {
                        label: "name",
                    }
                },

                initialCypher: "MATCH p=()-[:Causal_Relation]->() RETURN p LIMIT 25"
            };

            var viz = new NeoVis(config);
            viz.render();
            console.log(viz)
      }},
    }
</script>

<style scoped>
 #viz {
                width: 900px;
                height: 700px;
                border: 1px solid lightgray;
                font: 22pt arial;
            }
</style>