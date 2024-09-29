<template>
    <v-chart class="chart" :option="option" autoresize @click="handleClick"/>
  </template>
  
  <script setup>
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { GraphChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GraphicComponent,
  } from 'echarts/components';
  import VChart, { THEME_KEY } from 'vue-echarts';
  import { ref, provide } from 'vue';
  
  use([
    CanvasRenderer,
    GraphChart,
    TitleComponent,
    TooltipComponent,
    GraphicComponent,
  ]);
  
  provide(THEME_KEY, 'light');
  
  const option = ref({
    title: {
      text: '事件链',
      left: 'center',
    },
    color:["#F08080","#E6E6FA"],
    tooltip: {},
    // legend: [{
    //     show:true,
    //     orient: 'vertical',
    //     left: 'left',
    //     data: ['实体', '论元'],
    // }],
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 40,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      categories:[
        {name:"实体",symbolSize:40},
        {name:"论元",symbolSize:30}
      ],
      data: [
        {
          name: '抵达',
          id:1,
          x: 100,
          y: 300,
          category:"实体"
        },
        {
          name: '大熊猫丫丫和乐乐',
          id:1.1,
          x: 100,
          y: 350,
          category:"论元"
        },
        {
          name: '抵达',
          id:1.2,
          x: 100,
          y: 250,
          category:"论元"
        },
        {
          name: '孟菲斯动物园',
          id:1.3,
          x: 130,
          y: 270,
          category:"论元"
        },
        {
          name: '交还',
          id:2,
          x: 150,
          y: 300,
          category:"实体"
        },
        {
          name: '旅美大熊猫丫丫和乐乐',
          id:2.1,
          x: 150,
          y: 340,
          category:"论元"
        },
        {
          name: '归还',
          id:2.2,
          x: 180,
          y: 250,
          category:"论元"
        },
        {
          name: '死亡',
          id:3,
          x: 200,
          y: 300,
          category:"实体"
        },
        {
          name: '旅美大熊猫乐乐',
          id:3.1,
          x: 200,
          y: 330,
          category:"论元"
        },
        {
          name: '死亡',
          id:3.2,
          x: 250,
          y: 300,
          category:"论元"
        },
        {
          name: '联合调查死因',
          id:3.3,
          x: 200,
          y: 270,
          category:"论元"
        },
        {
          name: '引发关注',
          id:4,
          x: 250,
          y: 400,
          category:"实体"
        },
        {
          name: '旅美大熊猫丫丫',
          id:4.1,
          x: 250,
          y: 450,
          category:"论元"
        },
        {
          name: '健康情况',
          id:4.2,
          x: 300,
          y: 400,
          category:"论元"
        },
        {
          name: '引发网友关注',
          id:4.3,
          x: 250,
          y: 350,
          category:"论元"
        },
        {
          name: '声明',
          id:5,
          x: 300,
          y: 200,
          category:"实体"
        },
        {
          name: '中国动协',
          id:5.1,
          x: 340,
          y: 200,
          category:"论元"
        },
        {
          name: '丫丫',
          id:5.2,
          x: 350,
          y: 260,
          category:"论元"
        },
        {
          name: '提前回国',
          id:5.3,
          x: 320,
          y: 150,
          category:"论元"
        },
        {
          name: '声明',
          id:6,
          x: 350,
          y: 300,
          category:"实体"
        },
        {
          name: '北京动物园',
          id:6.1,
          x: 380,
          y: 320,
          category:"论元"
        },
        {
          name: '回国准备工作',
          id:6.2,
          x: 300,
          y: 280,
          category:"论元"
        },
        {
          name: '声明',
          id:7,
          x: 400,
          y: 300,
          category:"实体"
        },
        {
          name: '回国',
          id:7.1,
          x: 420,
          y: 320,
          category:"论元"
        },
      ],
      links: [
        {
          source: '1',
          target: '2'
        },
        {
          source: '1',
          target: '1.1'
        },
        {
          source: '1',
          target: '1.2'
        },
        {
          source: '1',
          target: '1.3'
        },
        {
          source: '2',
          target: '1.3'
        },
        {
          source: '2',
          target: '3'
        },
        {
          source: '2',
          target: '2.1'
        },
        {
          source: '2',
          target: '2.2'
        },
        {
          source: '3',
          target: '3.1'
        },
        {
          source: '3',
          target: '3.2'
        },
        {
          source: '3',
          target: '3.3'
        },
        {
          source: '3',
          target: '4'
        },
        {
          source: '4',
          target: '4.1'
        },
        {
          source: '4',
          target: '4.2'
        },
        {
          source: '4',
          target: '4.3'
        },
        {
          source: '3',
          target: '5'
        },
        {
          source: '5',
          target: '5.1'
        },
        {
          source: '5',
          target: '5.2'
        },
        {
          source: '5',
          target: '5.3'
        },
        {
          source: '6',
          target: '5.2'
        },
        {
          source: '7',
          target: '5.2'
        },
        {
          source: '5',
          target: '6'
        },
        {
          source: '6',
          target: '6.1'
        },
        {
          source: '6',
          target: '6.2'
        },
        {
          source:'6',
          target: '7'
        },
        {
          source: '7',
          target: '6.1'
        },
        {
          source: '7',
          target: '7.1'
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
});
const emit= defineEmits(['getMsg'])
function handleClick(e){
    emit('getMsg',e.data.name)
    // console.log(e.data.name)
};
</script>

<style scoped>
.chart {
height: 100vh;
}
</style>