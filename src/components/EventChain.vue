<template>
    <dynode/>
</template>

<script setup>
import G6, { Graph } from '@antv/g6';
import { onMounted } from 'vue'
import { h, ref } from 'vue'

let id = localStorage.getItem('canvas_id')
const dynode = () => h('div', { id: id });
console.log(id)
localStorage.setItem('canvas_id', id+1)

G6.registerEdge('customEdge', {
    endArrow: {
        path(item) {
            const keyShape = item.getKeyShape();
            let lineWidth = keyShape.attr('lineWidth');
            lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
            const width = lineWidth * 10 / 3;
            const halfHeight = lineWidth * 4 / 3;
            const radius = lineWidth * 4;
            return [
                ['M', -width, halfHeight],
                ['L', 0, 0],
                ['L', -width, -halfHeight],
                ['A', radius, radius, 0, 0, 1, -width, halfHeight],
                ['Z']
            ];
        },
        shorten(item) {
            const keyShape = item.getKeyShape();
            const lineWidth = keyShape.attr('lineWidth');
            return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
        },
        style(item) {
            const keyShape = item.getKeyShape();
            const { strokeOpacity, stroke } = keyShape.attr();
            return {
                fillOpacity: strokeOpacity,
                fill: stroke
            };
        }
    }
});
const initGraph = () => {
    const data = {
        // 点集
        nodes: [{
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100,      // Number，可选，节点位置的 x 值
            y: 40,      // Number，可选，节点位置的 y 值
            label: '孙宏斌许家印先后“入坑”',
            labelCfg: {
                position: 'bottom',
                offset: 5
            },
        }, {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 150,      // Number，可选，节点位置的 x 值
            y: 80,      // Number，可选，节点位置的 y 值
            label: '还有谁敢投资贾跃亭',
            labelCfg: {
                position: 'bottom',
                offset: 5
            },

        },
        {
            id: 'node3', // String，该节点存在则必须，节点的唯一标识
            x: 200,      // Number，可选，节点位置的 x 值
            y: 120,      // Number，可选，节点位置的 y 值
            label: '还有谁敢投资贾跃亭',
            labelCfg: {
                position: 'bottom',
                offset: 5
            },

        },],
        // 边集
        edges: [{
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            style: {
                endArrow: {
                    path: G6.Arrow.triangle(6, 8, 0), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                    d: 0,
                    fill: '#000',
                    opacity: 0.5,
                    lineWidth: 3,
                    
                },
                stroke: '#262626',
                strokeOpacity: 0.8
            },
           
        },
        {
            source: 'node2', // String，必须，起始点 id
            target: 'node3',  // String，必须，目标点 id
            style: {
                endArrow: {
                    path: G6.Arrow.triangle(6, 8, 0), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                    d: 0,
                    fill: '#000',
                    opacity: 0.5,
                    lineWidth: 3,
                    
                },
                stroke: '#262626',
                strokeOpacity: 0.8
            },
        }]
    };
    


    const container = document.getElementById(id);
    const width = container.scrollWidth || 300;
    const height = container.scrollHeight || 200;
    console.log(dynode)

    const graph = new G6.Graph({
        container: container,  // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width,              // Number，必须，图的宽度
        height,             // Number，必须，图的高度
    });

    graph.data(data);  // 读取 Step 2 中的数据源到图上
    graph.render();    // 渲染图
}

onMounted(() => {
    initGraph()
})

</script>

<style>
#container {
    width: 100%;
    min-height: 300px;
}
</style>