<script setup>
import { ClockCircleOutlined,PictureTwoTone } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';
import EChain from './EChain.vue';
function getmsg(msg){
    document.getElementById(msg).scrollIntoView({
        behavior:'smooth',
        block:'start'
    })
    // console.log(msg)
}
</script>
  
<template>
<div class="content">
    <div class="left">
        <a-card class="card">
            <div>中通60岁分拣工凌晨猝死舆情</div>
            <div class="h1">
                <span>标签：</span> 
                <a-tag color="orange">社会</a-tag>
                <a-tag color="orange">中通</a-tag>       
            </div>
            <p>事件概述</p>
            <p>2023年2月21日，据媒体报道，浙江宁波一名从事快递分拣工作的60岁男子在工作过程中，因心脏骤停而猝死。后中通方面称愿意赔付意外保险金额，家属表示不接受。该事引发网友和地方政府广泛关注和热议。此后，网友就劳动者问题作出了讨论。</p>
        </a-card>
        <EChain @getMsg="getmsg"></EChain>
        <a-descriptions title="实体信息">
            <a-descriptions-item label="国家" span="2">
                <a-tag color="orange">巴西</a-tag>
                <a-tag color="orange">中国</a-tag>
                <a-tag color="orange">美国</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="人物">
                <a-tag color="orange">马克龙</a-tag>
                <a-tag color="orange">卢拉</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="机构名" span="2">
                <a-tag color="orange">联邦最高法院</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="地名">
                <a-tag color="orange">佛罗里达</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        <a-timeline>
            <a-timeline-item>2023年2月15日
                <div>
                    根据相关视频显示，浙江宁波一名从事中通快递分拣工作的60岁男子在工作过程中，因心脏骤停而猝死。Create a services site 2015-09-01
                </div>
            </a-timeline-item>
            <a-timeline-item>2023年2月21日
                <div>
                    据@沸点视频 报道，孙先生60岁的大伯在浙江宁波中通快递分拣中心工作，2月15日凌晨3:50分左右，因心脏骤停猝死在岗位。孙先生称，和宁波中通公司沟通此事，但只有法务、人事和组长来谈，迟迟未给处理方案，后中通方面称愿意赔付意外保险金额，额外给丧葬费和人道主义费用。家属并未接受此方案，表示希望按照工亡流程处理。目前离世员工还在殡仪馆。
                </div>
            </a-timeline-item>
            <a-timeline-item id="声明">2023年2月21日
                <div>
                    据知微舆论场数据，话题#60岁中通快递分拣工凌晨在岗位猝死#登上微博热搜，最高排名4。
                </div>
            </a-timeline-item>
            <a-timeline-item color="red">
            <template #dot><clock-circle-outlined style="font-size: 16px" /></template>
            2023年2月21日
            <div>
                据@中新经纬 报道，中通方面独家回应称：对于网点员工的意外离世，我们深感痛心。目前，警方已经介入处理，浙江省管理中心高度重视，成立工作小组，会以合法合理为基础，与家属协商相关善后事宜。
            </div>
            </a-timeline-item>
            <a-timeline-item>2023年2月22日
                <div>
                    根据相关视频显示，浙江宁波一名从事中通快递分拣工作的60岁男子在工作过程中，因心脏骤停而猝死。Create a services site 2015-09-01
                </div>
            </a-timeline-item>
        </a-timeline>
    </div>
    <div class="right">
        <div class="fix">
            <a-card title="Default size card" style="width: 300px" class="more">
                <template #extra><a href="#">more</a></template>
                <p>card content</p>
                <p>card content</p>
                <p>card content</p>
            </a-card>
            <a-tooltip placement="right">
                <template #title>形成长图分享</template>
                <PictureTwoTone :style="{ fontSize:'50px',marginTop:'20px' }"/>
            </a-tooltip>
        </div>
    </div>
</div>
</template>
<style scoped>
.content{
    display: flex;
    margin-left: 150px;
    margin-right: 150px;
}
.h1{
    border-bottom: 1px solid #f0f0f0;
}
.left{
    margin-right: 100px;
}
.card{
    border-radius: 8px;
}
.more{
    border-radius:8px ;
}
/* .right{
    flex-grow: 1;
} */
/* .fix{
    position: fixed;
    right: 150px;
} */
</style>
