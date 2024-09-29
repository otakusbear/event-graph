<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, toRefs } from 'vue';
import Nar from './Nar.vue';
import { useStore } from 'vuex'
import Search from './Search.vue'
import axios from 'axios';
export default defineComponent({
    data() {
        return {
            iconsList:[
                "华中师大120校庆",
                "“猪坚强”的一生",
                "白玉兰颁奖典礼",
                "残奥会奖牌榜",
                "全国两会 ",
                "孟晚舟引渡案",]
        };
    },
    setup(){
        const router = useRouter();
        const store = useStore();
        const getSearch=value=>{
            let self = this;
            axios.get('http://127.0.0.1:5000/api/search', {
                params: { content: value },
            }).then(function (response) {
                store.commit('getTitle',response.data[0].title)
                store.commit('getInput',value)
                store.commit('getSear', response.data);
                router.push({ path: '/search'})
            })
        }
        function tonewG(){
            router.push({ path: '/newGraph'})
        }
        const toDetail=value=>{
            let self = this;
            axios.get('http://127.0.0.1:5000/api/event-data', {
            params: { event_topic: value },
            }).then(function (response) {
                store.commit('getTitle',value)
                store.commit('getEvent', response.data);
                router.push({ path: '/detail'})
            })
        }
        return{
            getSearch,
            toDetail,
            tonewG
        }
    },
    components: { Nar,Search }
})


</script>

<template>
    <Nar></Nar>
    <!-- <a-carousel autoplay>
        <div class="silder">
          <a-row>
            <a-col :span="12">
              <img class="animated" src="./static/picture/1.png" alt="slider Image">
            </a-col>
            <a-col :span="12" >
              <div class="title1">群体性事件语料库</div>
              <a-button value="large" ghost @click="toInput">Get Started</a-button>
            </a-col>
          </a-row>
        </div>
        <div class="silder">
          <a-row>
            <a-col :span="12">
              <img class="animated" src="./static/picture/1.png" alt="slider Image">
            </a-col>
            <a-col :span="12" >
              <div class="title1">群体性事件事理图谱</div>
              <a-button value="large" ghost @click="toFind">Get Started</a-button>
            </a-col>
          </a-row>
        </div>
    </a-carousel> -->
    <div class="t-content">
        <div>
            <input style="height: 44px;width: 600px;border-radius: 15px 0 0 15px;vertical-align: middle;border: 1px solid #1984ff"  placeholder="输入你想要了解的事件" />
            <a-button style="border-radius: 0 15px 15px 0;height: 44px;vertical-align: middle;">
                <span>事件演化分析</span>
            </a-button>
        </div>
        <div style="padding: 50px;">
            <!-- <div class="domain-search-holder">
                <a-input-search
                    :style="{width: '600px'}"
                    v-model:value="value"
                    placeholder="请输入您想要了解的事件"
                    enter-button="Search"
                    size="large"
                    @search="getSearch"
                />
            </div> -->
            <div class="animation">
                <img src="./static/picture/logo1.png" alt="logo">
                <ul class="icons-list">
                    <li v-for="item in iconsList">
                        <a>
                            <div class="fa" @click="toDetail(item)">{{item}}</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="gutter">
        <a-card :style="cardStyle" :body-style="{ padding: 0, overflow: 'hidden' }" class="findcard">
            <a-flex>
              <img src="./static/picture/database.png" alt="logo" class="logo">
              <div class="detail">
                <div class="svg">
                    <svg t="1712745747258" class="icon" viewBox="0 0 1096 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6668" width="64" height="64"><path d="M920.258034 951.393643H195.456313V379.087804L547.301711 90.071941l372.956323 305.387345V951.393643zM547.301711 0L0 447.405379v0.140205h125.083227V986.570171c0 19.70887 15.487687 35.184039 35.189047 35.184039h795.169799c18.291795 0 35.184039-15.48268 35.184039-35.184039V447.553095h104.145057L547.301711-0.002504z" fill="#FFFFFF" p-id="6669"></path><path d="M591.759335 397.747638c0-29.042543-8.988166-30.069046-39.124812-30.069046h-35.289193c-30.134142 0-39.132323 1.026504-39.132323 30.069046v23.296626h113.546328v-23.296626zM817.722836 803.935139l-69.051149-255.013555c-5.275227-20.915638-6.754895-21.639198-36.01776-14.673995l-56.798201 13.494768c-29.270377 6.97021-30.234289 8.26711-23.133887 36.478435l67.08577 247.747912 117.917731-28.033565zM279.659658 796.381575h152.080274v-218.114504H279.659658zM825.576841 832.96266l-117.91022 28.051091 5.770954 21.398846c7.122934 28.211325 8.587579 28.922367 37.880489 21.957163l56.773163-13.482249c33.666817-8.024254 30.259325-8.282132 21.301203-43.794152l-3.815589-14.130699zM478.215511 878.023667c0 29.072587 8.995677 30.116616 39.132323 30.116617h35.286689c34.660773 0 39.124812-1.044029 39.124812-30.11912v-441.972421h-113.54132v441.972421zM310.988049 908.140284H400.33643c30.136645 0 31.400998-1.044029 31.400998-30.11912V852.749144H279.659658v34.044871c0.565829 20.505037 4.571697 21.346269 31.330895 21.346269M431.739932 510.360098c0-29.060068-1.266856-30.084068-31.406005-30.084069h-89.343374c-26.764205 0-30.770073 0.82621-31.330895 21.321233v46.643325h152.080274v-37.880489zM279.659658 837.729643h152.080274v-26.331071H279.659658z" fill="#FFFFFF" p-id="6670"></path></svg>
                </div>
                <div>群体性事件语料库</div>
                <a-button type="primary" href="https://antdv.com" target="_blank">Get Start</a-button>
              </div>
            </a-flex>
        </a-card>
        <a-card :style="cardStyle" :body-style="{ padding: 0, overflow: 'hidden' }" class="findcard">
            <a-flex justify="space-between">
              <img src="./static/picture/tupu.png" alt="logo" class="logo">
              <div class="detail">
                <div class="svg">
                    <svg t="1713280262494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4340" width="64" height="64"><path d="M998.4 364.544a99.072 99.072 0 0 1-16.384 143.872 103.936 103.936 0 0 1-90.88 17.408L602.88 835.84a109.824 109.824 0 0 1 5.376 34.56 100.352 100.352 0 1 1-200.704 0 38.4 38.4 0 0 1 0-7.424l-174.336-102.4a104.448 104.448 0 0 1-52.992 15.872 100.352 100.352 0 0 1-71.424-28.928 98.56 98.56 0 0 1-28.928-71.424 102.4 102.4 0 0 1 36.352-76.8L76.8 416.512a96 96 0 0 1-72.192-67.584 98.816 98.816 0 0 1 66.816-124.672 97.536 97.536 0 0 1 83.456 12.032l175.616-103.936A108.288 108.288 0 0 1 364.288 76.8a97.792 97.792 0 0 1 141.056 13.568 108.8 108.8 0 0 1 20.736 40.96L870.4 343.552a97.792 97.792 0 0 1 130.048 20.992z m-455.424 137.728a114.432 114.432 0 0 1-54.528 80.896L486.4 588.8l40.192 188.416 4.608 4.608h3.84l3.84 1.28 6.4-1.536 272.128-288.512-4.864-10.24-263.68 14.336z m-128 93.696a102.4 102.4 0 0 1-49.92-17.152h-7.424l-86.528 71.424-2.048 6.656a65.024 65.024 0 0 1 3.328 18.688 51.2 51.2 0 0 1-1.28 8.704l2.816 6.656 179.2 105.728 9.216-6.656-40.448-188.928zM230.4 597.248l88.576-69.376 2.048-6.912a117.248 117.248 0 0 1-5.632-37.888 29.952 29.952 0 0 1 0-7.424l-3.584-7.168-146.688-63.488-8.448 7.168 39.168 173.312 5.12 4.608a82.432 82.432 0 0 1 22.528 7.936h6.4zM187.648 332.8v4.864l3.84 6.144 148.224 64.256 7.168-1.792a99.328 99.328 0 0 1 46.336-30.72l4.352-5.888v-128l-3.328-5.376a112.384 112.384 0 0 1-30.72-23.04l-7.68-1.28L191.232 307.2l-3.072 5.632a142.848 142.848 0 0 1 0 20.992zM496.64 213.76a69.12 69.12 0 0 1-8.96 9.728l-1.28 1.536a200.704 200.704 0 0 1-18.176 11.008l-3.328 5.376v128l4.096 5.888a119.296 119.296 0 0 1 62.976 53.76l5.888 3.328 278.272-17.152 2.816-11.52-314.112-191.488-8.192 1.536z" fill="#FFFFFF" p-id="4341"></path></svg>
                </div>
                <div>群体性事件事理图谱</div>
                <a-button type="primary" href="https://antdv.com" target="_blank">Get Start</a-button>
              </div>
            </a-flex>
        </a-card>
    </div>
</template>

<style scoped>
.t-content{
    margin-top: 100px;
    background-repeat: repeat;
    background-size:cover;
    text-align:center;
}
.big-title{
    font-family: 'Palanquin Dark', sans-serif;
    font-weight: 500;
    font-size: 50px;
    color: rgb(68, 68, 68);
    margin-bottom: 10px;
}
.sub-title {
    padding-top: 5px;
    font-size: 12px;
    color: #3b3c3c;
}
.domain-search-holder{
    margin-top: 30px;
}
.animation{
    position: relative;
    display: inline-block;
    margin-top: 15px;
}
.animation img{
    max-width: 609px;
}
.animation ul.icons-list{
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.animation ul.icons-list li{
    position: absolute;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    transform: scale(0);

    -webkit-animation: zoomin 1.5s cubic-bezier(1, .02, 0, .99) forwards;
    -moz-animation: zoomin 1.5s cubic-bezier(1, .02, 0, .99) forwards;
    animation: zoomin 1.5s cubic-bezier(1, .02, 0, .99) forwards;
}
.animation ul.icons-list li a{
    display: inline-block;
    background-color: #ffffff;
    border-radius: 200px;
    padding: 0 10px;
}
.animation ul.icons-list li a .fa{
    font-size: 18px;
    color: #7faacf;
}
.animation ul.icons-list li:nth-child(1){
    left: 0;
    top: 17%;
    -webkit-animation-delay: 1s;
    -moz-animation-delay: 1s;
    animation-delay: 1s;
}
.animation ul.icons-list li:nth-child(2){
    left: 5%;
    top: 52%;
    -webkit-animation-delay: 1.2s;
    -moz-animation-delay: 1.2s;
    animation-delay: 1.2s;
}
.animation ul.icons-list li:nth-child(3){
    left: 23%;
    top: 82%;
    -webkit-animation-delay: 1.4s;
    -moz-animation-delay: 1.4s;
    animation-delay: 1.4s;
}
.animation ul.icons-list li:nth-child(4){
    right: 23%;
    top: 82%;
    -webkit-animation-delay: 1.6s;
    -moz-animation-delay: 1.6s;
    animation-delay: 1.6s;
}
.animation ul.icons-list li:nth-child(5){
    right: 5%;
    top: 52%;
    -webkit-animation-delay: 1.8s;
    -moz-animation-delay: 1.8s;
    animation-delay: 1.8s;
}
.animation ul.icons-list li:nth-child(6){
    right: 0;
    top: 17%;
    -webkit-animation-delay: 2s;
    -moz-animation-delay: 2s;
    animation-delay: 2s;
}
@keyframes zoomin{
    0% {
        -webkit-transform: scale(0) translateY(60px);
        -moz-transform: scale(0) translateY(60px);
        transform: scale(0) translateY(60px);
    }
    100% {
        -webkit-transform: scale(1) translateY(0px);
        -moz-transform: scale(1) translateY(0px);
        transform: scale(1) translateY(0px);
    }
}
.animation ul.icons-list li a:hover{
    background-color: #7faacf;
}
.animation ul.icons-list li a:hover .fa{
    color: #ffffff;
}

.silder{
    padding: 100px;
  }
  .animated{
    height: 300px;
    width: 300px;
    float: left;
  }
  .title1{
    font-size: 50px;
    color: #fff;
  }
:deep(.slick-slide) {
  line-height: 100px;
  height: 500px;
  background: linear-gradient(to right,#3464e0, #9214f4);
  overflow: hidden;
}
.gutter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.c{
  margin: 40px;
  box-shadow: 6px 3px 3px #A9A9A9;
  border-radius: 2px;
  width: 300px;
  height: 250px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  padding: 40px 85px;
}
.c:hover{
  border:2px solid #3464e0;
  border-radius: 2px;
}
/* .svg{
  padding: 25px;
  background: #9214f4;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
} */
.findcard{
  box-shadow: 6px 4px 4px #A9A9A9;
  border-radius: 2px;
  width: 500px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  margin: 40px;
}
.findcard:hover{
  border:2px solid #3464e0;
  border-radius: 2px;
}
.logo{
    width: 350px;
    height: 300px;
    background-color: #fff;
}
.detail{
    margin-top: 30px;
}
.svg{
  padding: 15px;
  background: #632ee1;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
</style>
