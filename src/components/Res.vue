<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();
function toDetail(){
    router.push({ path: '/detail'})
}
</script>
<template>
<div class="main">
    <div class="left1">
        <div @click="toDetail">
            <div class="title">大熊猫丫丫回国</div>
            <div class="content">北京动物园:未收到“丫丫”将提早回国的消息，仍将按协议时间4月7日回国。</div>
        </div>
        <a-divider />
        <div class="title">大熊猫丫丫回国准备工作</div>
        <div class="content">北京动物园:已经做了大熊猫“丫丫”回国的全面准备工作。</div>
        <a-divider />
        <div class="title">大熊猫丫丫提前回国</div>
        <div class="content">中国动协:专家已赴美协商，丫丫或将提前回国。</div>
    </div>
    <div class="right1">
        <div class="chat">
            <div class="header">
                事件预测
            </div>
            <div class="talkshow">
                你好！
            </div>
            <div class="send">
                <input type="text" v-model="word" class="inputword"/>
                <input type="button" value="发送" @click="sendmsg" class="btnsend">
            </div>
        </div>
    </div>
</div>
</template>
<style>
.main{
    display: flex;
    margin-left: 200px ;
}
.left1{
    padding: 30px;
    margin-right: 100px;
}
.title{
    margin-bottom: 10px;
}
.right1{
    margin: 0 50px;
}
.chat{
    width: 23rem;
    height: 32rem;
    border: 2px solid #f0f0f0;
    border-radius: 8px;
}
.header{
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid #f0f0f0;
}
.talkshow{
    height: 26rem;
    padding: 10px;
    border: 5px solid #f0f0f0;
}
.send{
    height: 50px;
    padding:10px;
}
.inputword{
    width: 80%;
    height: 25px;
    border-radius: 8px;
}
.btnsend{
    border-radius: 8px;
    margin-left: 20px;
}
</style>