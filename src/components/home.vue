<template>
  <div style="  display: flex; flex-direction: column;  height: 100%;">
<!--  <Nar></Nar>-->
        <div :style="searchStyle" class="search-box">
          <div><input style="height: 40px;width: 600px;border-radius: 15px 0 0 15px;vertical-align: middle;border: 1px solid #1984ff" v-model="selectedEventType" placeholder="输入你想要了解的事件" @keyup.enter="handleSelectChange"/>
<!--    <el-select style="width: 80px;line-height: 40px;height: 40px!important;" v-model="selectedApi">-->
<!--    <el-option label="新闻" value="/api/bing"></el-option>-->
<!--    <el-option label="网页" value="/api/bingweb"></el-option>-->
<!--  </el-select>-->
          <a-button style="border-radius: 0 15px 15px 0;height: 40px;vertical-align: middle;" @click="handleSelectChange"><span>事件演化分析</span></a-button></div>
                            <div class="animation">
                        <img src="./static/picture/logo1.png" alt="laptop">
                        <ul class="icons-list">
                            <li v-for="item in iconsList">
                                <a>
                                    <div class="fa" @click="this.selectedEventType=item;handleSelectChange">{{item}}</div>
                                </a>
                            </li>
                        </ul>
                    </div></div>

    <div class="block" v-show="isSearchClicked" style="display: flex;flex-grow: 1;margin: 0 30px">
          <div style="z-index: 1;left: 50%;top: 50%; transform: translate(-50%, -50%); text-align: center;align-items: center;padding-top: 50px;position:absolute;width: 200px;height: 150px;background-color: #f9f9f9d9;border-radius: 10px;box-shadow: 0px 0px 10px rgba(0,0,0,0.2);" v-if="eventloading">
        <div class="loadingdot"></div>
      <div class="loadingdot"></div>
      <div class="loadingdot"></div>

        <p style="text-align: center;align-items: center;padding-top: 20px">事件演化中···</p>
      </div>
      <div style="flex: 0 0 30%">
<!--            <div class="buttons" style="text-align: center;margin: 10px">-->
<!--      <button v-for="(stage, index) in stages" :key="index" :class="{ selected: selectedStage === stage }" @click="filterByStage(stage)" style="margin: 10px">{{ stage }}</button>-->
<!--    </div>-->
        <el-timeline >
        <transition-group name="list-fade" tag="div">
          <el-timeline-item
            v-for="(event, index) in filteredEvents"
            :key="index"
            :timestamp="event.time"
            :color="getStageColor(event.stage)"
            placement="top"
            class="timeline-item"
          >
            <transition name="fade">
              <el-card class="card-fade" style="color: white; background: linear-gradient(to right, #40a9ff, #1890ff)" @click="openLink(event.link)">
                    <div style="display: flex; justify-content: space-between;">
      <h4 style="color: white">{{ event.title }}</h4>
      <a @click="openLink(event.link)" style="    color: #40a9ff;background-color: white;border-radius: 10px;padding: 5px;text-align: center">{{ sourceLabel(event.source) }}</a>
    </div>
<!--                <p>{{ event.content }}</p>-->
              </el-card>
            </transition>
          </el-timeline-item>
        </transition-group>
      </el-timeline>
      </div>

      <div style="flex: 1" id="graph">
        <div style="text-align: center;margin:10px;display: flex;justify-content: space-evenly">
<!--          <el-switch @change="toggleTimeRelations"-->
<!--  v-model="show2"-->

<!--  inactive-text="时序关系">-->
<!--</el-switch>-->
          <el-switch @change="toggleSubRelations"
  v-model="show1"
  inactive-text="层次关系">
</el-switch>
<!--          <el-switch @change="toggleCausalRelations"-->
<!--  v-model="show3"-->

<!--  inactive-text="因果关系">-->
<!--</el-switch>-->
        </div>
        <div id="buttonbar" style="text-align: center;margin: 10px">

<!--          <button @click="toggleSubRelations" style="margin: 10px">层次关系</button>-->
<!--&lt;!&ndash;          <button @click="showSubevents" style="margin: 10px">显示层次关系</button>&ndash;&gt;-->
<!--&lt;!&ndash;    <button @click="hideSubevents" style="margin: 10px">隐藏层次关系</button>&ndash;&gt;-->
<!--    <button @click="toggleTimeRelations" style="margin: 10px">时序关系</button>-->
<!--<button @click="toggleCausalRelations" style="margin: 10px">因果关系</button>-->
          <span v-if="displayedEventsCount > 1">不满意？继续点击预测其他可能</span>
          <button @click="predict">

      <span>{{ buttonText }}</span>
    </button></div>

<!--        <el-steps :active="activeStep" finish-status="finish" style="margin: 20px 30px 0 30px;">-->
<!--  <el-step title="发生阶段" ></el-step>-->
<!--  <el-step title="发展阶段" ></el-step>-->
<!--  <el-step title="扩散阶段" ></el-step>-->
<!--  <el-step title="消退阶段" ></el-step>-->
<!--  <el-step v-if="activeStep>=3" title="预测阶段" ></el-step>-->
<!--</el-steps>-->
        <div id="main-network-container" style="position: relative;width: 100%">
          <div ref="legendContainer" id="legend-container" style="position: absolute;top: 0;left: 0;width: 152px; height: 75px; border-radius: 14px;background: white; z-index: 1;   border: 1px solid #ccc; padding: 10px;"></div>
          <div ref="network2" id="network2" style="width: 100%;height: 600px"></div></div>

<div v-for="event in displayedEvents" :key="event.index">
    <el-card class="card-fade" style="color: white; background: linear-gradient(to right, #3464e0, #9214f4)">
      <div style="display: flex; justify-content: space-between;">
        <h4 style="color: white">{{ event.formatted_triple }}</h4>
<!--        <a style="color: #40a9ff;background-color: white;border-radius: 10px;padding: 5px;text-align: center">事件发生概率：{{ event.prob }}</a>-->
      </div>
      <p>AI判断依据：{{event.reason}}</p>
    </el-card>
  </div>
      </div>

    </div>

    <div v-show="loading" class="container">
      <div class="row text-center">

        <div class="col-lg-12 col-md-12 col-sm-12 col-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
            <div class="single_about text-center" style="height: 600px;padding: 20px">

              <h4>相似图谱</h4>
              <Graph></Graph>
            </div>
        </div>

<!--        <div class="col-lg-6 col-md-6 col-sm-12 col-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">-->
<!--            <div class="single_about text-center" style="height: 400px;padding: 20px">-->

<!--              <h4>模式图</h4>-->
<!--              <Sche></Sche>-->
<!--            </div>-->
<!--        </div>-->

      </div>
    </div>


		<section id="about" class="about section-padding">
			<div class="container">
				<div class="row text-center">

					<div class="col-lg-6 col-md-6 col-sm-12 col-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
						<a href = "/#/Events">
						<div class="single_about text-center">

            <a-flex style="display: flex">
              <img src="./static/picture/database.png" alt="logo" class="logo">
              <div class="detail">
                <div class="svg">
                    <svg t="1712745747258" class="icon" viewBox="0 0 1096 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6668" width="64" height="64"><path d="M920.258034 951.393643H195.456313V379.087804L547.301711 90.071941l372.956323 305.387345V951.393643zM547.301711 0L0 447.405379v0.140205h125.083227V986.570171c0 19.70887 15.487687 35.184039 35.189047 35.184039h795.169799c18.291795 0 35.184039-15.48268 35.184039-35.184039V447.553095h104.145057L547.301711-0.002504z" fill="#FFFFFF" p-id="6669"></path><path d="M591.759335 397.747638c0-29.042543-8.988166-30.069046-39.124812-30.069046h-35.289193c-30.134142 0-39.132323 1.026504-39.132323 30.069046v23.296626h113.546328v-23.296626zM817.722836 803.935139l-69.051149-255.013555c-5.275227-20.915638-6.754895-21.639198-36.01776-14.673995l-56.798201 13.494768c-29.270377 6.97021-30.234289 8.26711-23.133887 36.478435l67.08577 247.747912 117.917731-28.033565zM279.659658 796.381575h152.080274v-218.114504H279.659658zM825.576841 832.96266l-117.91022 28.051091 5.770954 21.398846c7.122934 28.211325 8.587579 28.922367 37.880489 21.957163l56.773163-13.482249c33.666817-8.024254 30.259325-8.282132 21.301203-43.794152l-3.815589-14.130699zM478.215511 878.023667c0 29.072587 8.995677 30.116616 39.132323 30.116617h35.286689c34.660773 0 39.124812-1.044029 39.124812-30.11912v-441.972421h-113.54132v441.972421zM310.988049 908.140284H400.33643c30.136645 0 31.400998-1.044029 31.400998-30.11912V852.749144H279.659658v34.044871c0.565829 20.505037 4.571697 21.346269 31.330895 21.346269M431.739932 510.360098c0-29.060068-1.266856-30.084068-31.406005-30.084069h-89.343374c-26.764205 0-30.770073 0.82621-31.330895 21.321233v46.643325h152.080274v-37.880489zM279.659658 837.729643h152.080274v-26.331071H279.659658z" fill="#FFFFFF" p-id="6670"></path></svg>
                </div>
<!--                <div>群体性事件语料库</div>-->
                <a-button type="primary" href="/#/Events" target="_blank">进入</a-button>
              </div>
            </a-flex>

							<h4>群体性事件语料库</h4>

						</div>	</a>
					</div><!--- END COL -->

					<div class="col-lg-6 col-md-6 col-sm-12 col-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
						<a href ="/#/lepton">
						<div class="single_about text-center">
							<a-flex style="display: flex" justify="space-between">
              <img src="./static/picture/tupu.png" alt="logo" class="logo">
              <div class="detail">
                <div class="svg">
                    <svg t="1713280262494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4340" width="64" height="64"><path d="M998.4 364.544a99.072 99.072 0 0 1-16.384 143.872 103.936 103.936 0 0 1-90.88 17.408L602.88 835.84a109.824 109.824 0 0 1 5.376 34.56 100.352 100.352 0 1 1-200.704 0 38.4 38.4 0 0 1 0-7.424l-174.336-102.4a104.448 104.448 0 0 1-52.992 15.872 100.352 100.352 0 0 1-71.424-28.928 98.56 98.56 0 0 1-28.928-71.424 102.4 102.4 0 0 1 36.352-76.8L76.8 416.512a96 96 0 0 1-72.192-67.584 98.816 98.816 0 0 1 66.816-124.672 97.536 97.536 0 0 1 83.456 12.032l175.616-103.936A108.288 108.288 0 0 1 364.288 76.8a97.792 97.792 0 0 1 141.056 13.568 108.8 108.8 0 0 1 20.736 40.96L870.4 343.552a97.792 97.792 0 0 1 130.048 20.992z m-455.424 137.728a114.432 114.432 0 0 1-54.528 80.896L486.4 588.8l40.192 188.416 4.608 4.608h3.84l3.84 1.28 6.4-1.536 272.128-288.512-4.864-10.24-263.68 14.336z m-128 93.696a102.4 102.4 0 0 1-49.92-17.152h-7.424l-86.528 71.424-2.048 6.656a65.024 65.024 0 0 1 3.328 18.688 51.2 51.2 0 0 1-1.28 8.704l2.816 6.656 179.2 105.728 9.216-6.656-40.448-188.928zM230.4 597.248l88.576-69.376 2.048-6.912a117.248 117.248 0 0 1-5.632-37.888 29.952 29.952 0 0 1 0-7.424l-3.584-7.168-146.688-63.488-8.448 7.168 39.168 173.312 5.12 4.608a82.432 82.432 0 0 1 22.528 7.936h6.4zM187.648 332.8v4.864l3.84 6.144 148.224 64.256 7.168-1.792a99.328 99.328 0 0 1 46.336-30.72l4.352-5.888v-128l-3.328-5.376a112.384 112.384 0 0 1-30.72-23.04l-7.68-1.28L191.232 307.2l-3.072 5.632a142.848 142.848 0 0 1 0 20.992zM496.64 213.76a69.12 69.12 0 0 1-8.96 9.728l-1.28 1.536a200.704 200.704 0 0 1-18.176 11.008l-3.328 5.376v128l4.096 5.888a119.296 119.296 0 0 1 62.976 53.76l5.888 3.328 278.272-17.152 2.816-11.52-314.112-191.488-8.192 1.536z" fill="#FFFFFF" p-id="4341"></path></svg>
                </div>
<!--                <div>群体性事件事理图谱</div>-->
                <a-button type="primary" href="/#/lepton" target="_blank">进入</a-button>
              </div>
            </a-flex>
							<h4>群体性事件事理图谱</h4>

						</div>	</a>
					</div><!--- END COL -->





				</div><!--- END ROW -->
<!--				<div class="row text-center">-->







<!--				</div>&lt;!&ndash;- END ROW &ndash;&gt;-->

			</div><!--- END CONTAINER -->
		</section>

<!--<footer>-->
<!--    <div class="w1200">-->
<!--        <div class="left">-->
<!--            <h3>-->
<!--&lt;!&ndash; 网站logo图片地址请在本组件"内容配置-网站logo"处填写 &ndash;&gt;-->
<!--<a href="" title="计算机学院"><img src="./static/picture/logo.png" alt=""></a></h3>-->
<!--            <div>&lt;!&ndash; 版权内容请在本组件"内容配置-版权"处填写 &ndash;&gt;-->
<!--<p>版权所有 华中师范大学计算机学院</p><p>Copyright © 1992-2022 School of Computer Science, Central China Normal University</p></div>-->
<!--        </div>-->

<!--        <div class="line"></div>-->

<!--        <div class="center">-->
<!--            <div class="title002">-->
<!--                <h3>友情链接</h3>-->
<!--            </div>-->

<!--            <ul class="list_box_06">-->
<!--    <li><a href="http://one.ccnu.edu.cn" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78110)">信息门户</a></li>-->
<!--    <li><a href="http://jwc.ccnu.edu.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78111)">本科生院</a></li>-->
<!--    <li><a href="http://gs.ccnu.edu.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78112)">研究生院</a></li>-->
<!--    <li><a href="http://cwc.ccnu.edu.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78113)">财务处</a></li>-->
<!--    <li><a href="http://lib.ccnu.edu.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78114)">图书馆</a></li>-->
<!--    <li><a href="http://hr.ccnu.edu.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 78115)">人事部</a></li>-->
<!--    <li><a href="https://www.ccf.org.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 81542)">CCF</a></li>-->
<!--    <li><a href="http://caai.cn/" title="" onclick="_addDynClicks(&quot;wburl&quot;, 1830108542, 81543)">CAAI</a></li>-->
<!--</ul>-->
<!--        </div>-->

<!--        <div class="line line1"></div>-->

<!--        <div class="right">-->
<!--            <div class="title002">-->
<!--                <h3>联系我们</h3>-->
<!--            </div>-->

<!--            <div class="box">-->
<!--                <div class="ll">-->
<!--<p>地址：南湖综合楼7065办公室</p>-->
<!--<p>邮编：430079</p>-->
<!--<p>电话：027-67868318</p>-->
<!--<p>邮箱：cs@ccnu.edu.cn</p></div>-->

<!--                <div class="rr">-->
<!--                            <img src="./static/picture/jsjxyewm.jpg" alt="">-->
<!--</div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</footer>-->
  </div>
</template>

<script>
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import axios from "axios";
import newGraph from './newGraph.vue'
import Graph from './Graph2.vue'
import Sche from './Graph3.vue'
import Nar from "./Nar.vue";
import {useStore} from "vuex";

export default {
  setup() {
    const store = useStore();
    const similarTopic=value=>{
      axios.get('/api/search', {
          params: { content: value },
      }).then(function (response) {
        store.commit('getTitle',response.data[0].title)
        const title=this.$store.state.title;
        console.log(title)
        console.log(response.data)

      })
    }
  },
  data() {
    return {
      eventDataResponse: {},
      selectedApi: '/api/bing',
      selectedStage: '',
      isSearchClicked: false,
      events: [],
      eventloading: false,
      loading: false,
      show2: false,
      show3: false,
      show1: false,
      nodeSet:{},
      activeStep: -1,
      selectedEventType: '',
      visibleEvents: [],
      showInterval: null,
      stages: ['发生', '发展', '扩散', '衰退'],
      nodes: new DataSet(),
      edges: new DataSet(),
      network: null,
      preds: [],
      displayedEventsCount: 1,
      buttonText: '预测',
      iconsList:[
                "河南特大暴雨洪涝灾害",
                "江苏盐城烧烤店爆炸",
                "孟晚舟引渡案",
                "俄罗斯乌克兰冲突",
                "预制梅菜扣肉竟是淋巴肉 ",
                "以色列袭击加沙地带",]
    };
  },
  computed: {
    displayedEvents() {
      return this.preds.slice(0, this.displayedEventsCount).map(event => ({
        ...event,
        formatted_triple: event.event_triple.filter(item => item !== 'NON').join(' ')
      }));
    },
    formattedEvents: function() {
      return this.preds.map(event => {
        return {
          ...event,
          formatted_triple: event.event_triple.filter(item => item !== 'NON').join(' ')
        };
      });
    },
    // 使用计算属性来过滤事件
    filteredEvents() {
      if (this.selectedStage) {
        return this.visibleEvents.filter(event => event.stage === this.selectedStage);
      }
      return this.visibleEvents; // 如果没有选中的stage，则显示所有事件
    },
        searchStyle() {
          if (this.isSearchClicked) {
            return {
              position: 'relative',
              'text-align': 'center',
              // 其他样式
            };
          } else {
            return {

              'margin-top': '15%',
              'text-align': 'center',

              // 其他样式
            };
          }
        }
  },
  methods: {
  similarTopic() {
    const store = this.$store;
    axios.get('/api/search', {
      params: { content: this.selectedEventType },
    }).then(function (response) {
      store.commit('getTitle', response.data[0].title);
      const title = store.state.title;
      console.log(title);
      console.log(response.data);
    });
  },
      sourceLabel(source) {
    const mapping = {
    'new.qq.com': '腾讯新闻',
    'baijiahao.baidu.com': '百家号',
    'www.sohu.com': '搜狐新闻',
    'www.163.com': '网易',
    'www.thepaper.cn': '澎湃新闻',
    'www.douyin.com': '抖音',
'zhuanlan.zhihu.com': '知乎专栏',
'finance.sina.com.cn': '新浪财经',
'm.163.com': '网易',
'news.hnr.cn': '映像新闻',
'news.china.com': '中华网',
'www.bilibili.com': '哔哩哔哩',
'www.weibo.com': '微博',
'news.sina.com.cn': '新浪新闻',
'henan.china.com.cn': '中国网',
'k.sina.com.cn': '新浪网',
'news.cctv.com': '央视新闻',
'baike.baidu.com': '百度百科',
'news.cnr.cn': '央广网新闻',
'www.guancha.cn': '观察者网',
'm.gmw.cn': '光明网',
'sinanews.sina.cn': '新浪新闻',
'www.news.cn': '新华网',
'view.inews.qq.com': '腾讯新闻',
'dzb.hxnews.com': '海峡网',
'm.thepaper.cn': '澎湃新闻',
'k.sina.cn': '新浪网',
'www.msn.cn': 'MSN',
'www.nbd.com.cn': '每经网',
'finance.sina.cn': '新浪财经',
'www.chinanews.com.cn': '中国新闻网',
'www.gov.cn': '中国政府网',
'news.mydrivers.com':'快科技',
'www.xinhuanet.com':'新华网',
'news.bjd.com.cn':'京报新闻',
'www.workercn.cn':'中工网',
'news.sina.cn':'新浪新闻',
};
    console.log('event.source:', source);  // 打印 event.source 的值
    console.log('mapping:', mapping);  // 打印 mapping 对象
    return mapping[source] || source;
  },
      openLink(link) {
    window.open(link, '_blank');
  },
   async handleSelectChange() {
    if (!this.selectedEventType) {
        alert('请输入检索词');
        return;
    }
    else {
      // let element = document.getElementById('searchbar');
      // element.style.top = '120px';
  this.selectedStage = '';
this.isSearchClicked = true;
    this.bingSearch();
    this.similarTopic();
    await this.getChunk();
    this.network.fit();
    }
  },
async bingSearch() {
  this.loading = true;

  this.timelineData = [];
  this.allData = [];
  const searchResults = await axios.get(this.selectedApi, {
    params: { event_topic: this.selectedEventType, count: "20" ,uniqueId: this.uniqueId},
  });
  console.log(searchResults)

  // 使用搜索结果更新时间轴数据
  this.events = searchResults.data.map(result => ({
    title: result[2],  // 标题
    time: result[0],  // 发布时间
    stage: result[3], //阶段
    source: result[4], //来源
    content: result[1],  // 简介
    link: result[5],  // 新闻源网页链接
  }));

  // 重置visibleEvents数组
  this.visibleEvents = [];

  // 使用setTimeout来逐个显示事件
  let index = 0;
  this.showInterval = setInterval(() => {
    if (index < this.events.length) {
      this.visibleEvents.push(this.events[index]);
      index++;
    } else {
      // 所有事件都已显示，清除setTimeout
      clearInterval(this.showInterval);
      this.showInterval = null;
    }
  }, 500); // 200毫秒 = 0.2秒

  return searchResults;
},

    search() {
      // 清除之前的setTimeout，避免重复触发
      if (this.showInterval) {
        clearInterval(this.showInterval);
      }

      // 假设这是你的搜索逻辑，这里我们简单地设置events数组
      this.events = [
        { title: '事件1', time: '2024-01-01', stage: '发生', color: '#51f6bc', source: 'www.sohu.com', content: '描述', link: '' },
        { title: '事件2', time: '2024-02-01', stage: '发展', color: '#fff983', source: 'www.sohu.com', content: '描述', link: '' },
        { title: '事件3', time: '2024-03-01', stage: '扩散', color: '#ff3f66', source: 'www.sohu.com', content: '描述', link: '' },
        { title: '事件4', time: '2024-04-01', stage: '衰退', color: '#68d5ff', source: 'www.sohu.com', content: '描述', link: '' },
      ];

      // 重置visibleEvents数组
      this.visibleEvents = [];

      // 使用setTimeout来逐个显示事件
      let index = 0;
      this.showInterval = setInterval(() => {
        if (index < this.events.length) {
          this.visibleEvents.push(this.events[index]);
          index++;
        } else {
          // 所有事件都已显示，清除setTimeout
          clearInterval(this.showInterval);
          this.showInterval = null;
        }
      }, 500); // 200毫秒 = 0.2秒
    },
    filterByStage(stage) {
      this.selectedStage = stage; // 更新选中的stage
      // Update the network nodes based on the selected stage
      this.nodes.forEach(node => {
        if (node.stage === stage) {
          node.color = this.getStageColor(stage);
        } else {
          node.color = 'rgba(211, 211, 211, 0.5)'; // Light gray and semi-transparent
        }
      });
      this.network.setData({ nodes: this.nodes, edges: this.edges });
    },
    getStageColor(stage) {
      switch (stage) {
        case '发生':
          return '#51f6bc';
        case '发展':
          return '#fff983';
        case '扩散':
          return '#ff3f66';
        case '衰退':
          return '#68d5ff';
        default:
          return '#000000'; // 默认颜色
      }
    },

    //图谱部分脚本
        openModal(event) {
      this.selectedEvent = event;
    },
    closeModal() {
      this.selectedEvent = null;
    },
  updateDotPosition() {
        if (this.dot) {
            var rect = this.dot.getBoundingClientRect();
            // 更新this.dot的位置信息
            this.dotTop = rect.top;
            this.dotLeft = rect.left;
        }
    },


    loadData() {
        this.loading = true;
        this.allData.forEach((event, index) => {
            setTimeout(() => {
                this.timelineData.push(event);
                this.$nextTick(() => {
                  const scrollContainer = document.querySelector('.tlcontainer');
                  scrollContainer.scrollTo(scrollContainer.scrollWidth, 0);
                    if (index === this.allData.length - 1) {

                        this.eventloading = false;
                    }
                });
            }, 2000 * index);
        });
        setTimeout(() => {
        const scrollContainer = document.querySelector('.tlcontainer');
        scrollContainer.scrollTo(0, 0);
    }, 2000 * this.allData.length);
    },
    formatDate(time) {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
},
  formatMonth(time) {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
},


    async bingSingleSearch() {
      const searchResults = await axios.get('/api/faiss', {
    params: { event_topic: this.query, count: 1, uniqueId: this.uniqueId},
  });
      console.log(searchResults)
      return searchResults;
    },
    async predict() {
     if (this.displayedEventsCount <= this.preds.length) {
        this.displayedEventsCount++;
        this.buttonText = '继续预测';
      }
      if (this.displayedEventsCount == 1) {
        this.eventloading=true;
  const response = await axios.get('/api/predict', {
    params: { event_topic: JSON.stringify(this.eventDataResponse.events) },
  });

let data;  // 在if和else语句块之外声明data变量

if (response.data.startsWith('\n```json\n') && response.data.endsWith('\n```')) {
  // 从Markdown代码块中提取出JSON字符串
  const jsonStr = response.data.slice('\n```json\n'.length, -'\n```'.length);
  // 解析JSON字符串
  data = JSON.parse(jsonStr);
} else if (response.data.startsWith('```json\n') && response.data.endsWith('\n```')) {
  // 从Markdown代码块中提取出JSON字符串
  const jsonStr = response.data.slice('```json\n'.length, -'\n```'.length);
  // 解析JSON字符串
  data = JSON.parse(jsonStr);
} else {
  // 如果响应数据不是被包裹在Markdown代码块中的JSON字符串，那么直接进行解析
  data = JSON.parse(response.data);
}

      data.pred.forEach((prediction) => {
          const event = {
    event_triple: prediction.predict_triple,
    index: prediction.index,
    prob:prediction.prob,
            reason:prediction.reason,
  };
  this.preds.push(event);
  const predict_relation = prediction.predict_relation;

  // 更新 nodes
  if (event.event_triple[0] !== 'NON' && !this.nodeSet.has(event.event_triple[0])) {
    this.nodes.add({id: event.event_triple[0], label: event.event_triple[0], color: '#51f6bc', font: {size: 20}, level: 4});
    this.nodeSet.add(event.event_triple[0]);
  }
  if (event.event_triple[1] !== 'NON') {
    this.nodes.add({id: event.index, label: event.event_triple[1], reason: event.reason, color: '#51f6bc', font: {size: 30}, level: 4});
  }
  if (event.event_triple[2] !== 'NON' && !this.nodeSet.has(event.event_triple[2])) {
    this.nodes.add({id: event.event_triple[2], label: event.event_triple[2], color: '#51f6bc', font: {size: 20}, level: 4});
    this.nodeSet.add(event.event_triple[2]);
  }

  // 更新 edges
  if (event.event_triple[0] !== 'NON' && event.event_triple[1] !== 'NON') {
    this.edges.add({from: event.event_triple[0], to: event.index, color: 'green'}); // 使用绿色边表示预测的边
  }
  if (event.event_triple[1] !== 'NON' && event.event_triple[2] !== 'NON') {
    this.edges.add({from: event.index, to: event.event_triple[2], color: 'green'}); // 使用绿色边表示预测的边
  }

  // 更新预测的关系
  this.edges.add({
    id: `predict-relation-${predict_relation[0]}-${predict_relation[1]}`,
    from: predict_relation[0],
    to: predict_relation[1],
    color: '#ff9a00',
    dashes: [20, 20],
    arrows: 'to',
    width: 40*event.prob,
  });


      });
  this.network.fit();
  this.activeStep += 1;
  this.eventloading=false;
      }
},
    async getChunk() {

this.eventloading = true;
  this.eventDataResponse = {
    events: [],
    subevents: [],
    time_relations: [],
    causal_relations: []
  };
  this.activeStep=-1;
  this.eventloading = true;
  const response = await fetch(`/api/get_chunk?event_topic=${encodeURIComponent(this.selectedEventType)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });

  const reader = response.body.getReader();
  this.nodes.clear();
  this.edges.clear();
  const nodeSet = new Set();
  let i = 0;
  let k = 0;
  let buffer = "";
  const seenStages = new Set();
  let flag = true;
  while (true) {
    const {done, value} = await reader.read();
    console.log(value);
    if (done) {
      break;
    }
    buffer += new TextDecoder('utf-8').decode(value);
    if (flag){
      if(buffer.includes('{')){
        buffer = "";
        flag=false;
      }
    }
    // if (buffer[0]=='{'){
    //   buffer=buffer.substring(1)
    // }
    console.log(buffer);
    let match = buffer.match(/\{.*?("event":.*?[^{}]*?)\}/s);

    while (match) {
      console.log(match);
      const event = JSON.parse(match[0]);
      if (!seenStages.has(event.stage)) {
    // 如果是首次出现的stage，则添加到#stagecontainer中
    this.activeStep += 1;
    // 同时将该stage添加到seenStages集合中，表示已经处理过
    seenStages.add(event.stage);
  };
      const event_buffer = {
        'id': event.index,
        'subject': event.event_triple[0],
        'predicate': event.event_triple[1],
        'object': event.event_triple[2],
        'stage': event.stage
      };
      this.eventDataResponse.events.push(event_buffer);
        // 根据stage字段确定节点的层级
  let level;
  switch (event.stage) {
    case '发生':
      level = 0;
      break;
    case '发展':
      level = 1;
      break;
    case '扩散':
      level = 2;
      break;
    case '消退':
      level = 3;
      break;
    default:
      level = 0;
  }
      for (let j = 0; j < event.subevent_triple.length; j++) {
        let subevent_buffer = {
          'event_id': event.index,
          'id': k,
          'subject': event.subevent_triple[j][0],
          'predicate': event.subevent_triple[j][1],
          'object': event.subevent_triple[j][2],
          'level': level
        };
        k++;
        this.eventDataResponse.subevents.push(subevent_buffer);
      }

      i++;
      if (event.event_triple[0] !== 'NON' && !nodeSet.has(event.event_triple[0])) {
        this.nodes.add({id: event.event_triple[0], label: event.event_triple[0], color: 'lightblue', font: {size: 30}, level: level });
        nodeSet.add(event.event_triple[0]);
      }
      if (event.event_triple[1] !== 'NON') {
        this.nodes.add({id: event.index, label: event.event_triple[1], color: 'pink', font: {size: 40}, level: level });
      }
      if (event.event_triple[2] !== 'NON' && !nodeSet.has(event.event_triple[2])) {
        this.nodes.add({id: event.event_triple[2], label: event.event_triple[2], color: 'lightblue', font: {size: 30}, level: level });
        nodeSet.add(event.event_triple[2]);
      }

      if (event.event_triple[0] !== 'NON' && event.event_triple[1] !== 'NON') {
        this.edges.add({from: event.event_triple[0], to: event.index, color: 'lightgray'});
      }
      if (event.event_triple[1] !== 'NON' && event.event_triple[2] !== 'NON') {
        this.edges.add({from: event.index, to: event.event_triple[2], color: 'lightgray'});
      }
      this.nodeSet = nodeSet;


      this.network.fit();

      buffer = buffer.slice(match[0].length);
      match = buffer.match(/\{"event":.*?\}(?=, \{"event":|\]|$)/s);
    }
  }
    const matchtime = buffer.match(/"time_relation":\s*(\[[\s\S]*\[.*?\][\s\S]*\])(?=[\s\S]*"causal_relation"|$)/);
    if (matchtime) {
      console.log(matchtime)
      const time_relations = JSON.parse(matchtime[1]);
      for (const relation of time_relations) {
        // this.edges.add({
        //   id: `time-relation-${relation[0]}-${relation[1]}`,
        //   from: relation[0],
        //   to: relation[1],
        //   color: '#c06c84',
        //   arrows: 'to',
        //   width: 5,
        // });
        let time_buffer = {
          'event1_id': relation[0],
          'event2_id': relation[1]
        };
        this.eventDataResponse.time_relations.push(time_buffer);
      }
    }

    const matchcausal = buffer.match(/"causal_relation":\s*(\[[\s\S]*\[.*?\][\s\S]*\])/);
    console.log(buffer)
      console.log(matchcausal)
    if (matchcausal) {
      const causal_relations = JSON.parse(matchcausal[1]);
      for (const relation of causal_relations) {
        // this.edges.add({
        //   id: `causal-relation-${relation[0]}-${relation[1]}`,
        //   from: relation[0],
        //   to: relation[1],
        //   color: '#355c7d',
        //   dashes: [20, 20],
        //   arrows: 'to',
        //   width: 5,
        // });
        let causal_buffer = {
          'event1_id': relation[0],
          'event2_id': relation[1]
        };
        this.eventDataResponse.causal_relations.push(causal_buffer);
      }
    }
    this.showSubRelations = false;
    this.showTimeRelations = false;
    this.showCausalRelations = false;
    this.toggleCausalRelations();
    this.toggleTimeRelations();
    this.eventloading = false;
    this.activeStep += 1;
    },

async toggleSubRelations() {
    // 获取事件数据
    const eventData = this.eventDataResponse;

    if(this.showSubRelations) {
      // 删除子事件节点和边
  for (const subevent of eventData.subevents) {
    this.nodes.remove(`subevent-${subevent.id}-subject`);
    this.nodes.remove(`subevent-${subevent.id}-predicate`);
    this.nodes.remove(`subevent-${subevent.id}-object`);

    // 删除子事件之间的边
    if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
      this.edges.remove(`edge-subject-predicate-${subevent.id}`);
    }
    if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
      this.edges.remove(`edge-predicate-object-${subevent.id}`);
    }

    // 删除子事件和事件之间的边
    const event = eventData.events.find(event => event.id === subevent.event_id);
    if (event) {
      this.edges.remove(`edge-event-subevent-${subevent.id}`);
    }
  }
  this.showSubRelations=false;
    } else {
      // 更新节点和边
    for (const subevent of eventData.subevents) {
      // 如果subject不为'NON'，则添加subject节点
if (subevent.subject !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-subject`, label: subevent.subject, color: 'yellow', shape: 'box' , font: { size: 15 }, level: subevent.level });
}
// 如果predicate不为'NON'，则添加predicate节点
if (subevent.predicate !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-predicate`, label: subevent.predicate, color: 'lightgreen', font: { size: 20 }, level: subevent.level  });
}
// 如果object不为'NON'，则添加object节点
if (subevent.object !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-object`, label: subevent.object, color: 'yellow', shape: 'box', font: { size: 15 }, level: subevent.level  });
}

// 如果subject和predicate都不为'NON'，则添加边
if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
  this.edges.add({ id: `edge-subject-predicate-${subevent.id}`,from: `subevent-${subevent.id}-subject`, to: `subevent-${subevent.id}-predicate`, color: 'lightgray' });
}
// 如果predicate和object都不为'NON'，则添加边
if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
  this.edges.add({ id: `edge-predicate-object-${subevent.id}`, from: `subevent-${subevent.id}-predicate`, to: `subevent-${subevent.id}-object`, color: 'lightgray' });
}



      // 找到子事件对应的事件
      const event = eventData.events.find(event => event.id === subevent.event_id);
      if (event) {
        // 添加边，连接事件的predicate节点和子事件的predicate节点
        this.edges.add({ id: `edge-event-subevent-${subevent.id}`, from: event.id, to: `subevent-${subevent.id}-predicate`, color: 'lightgray', dashes: [5, 5] });
      }
    }
    this.showSubRelations=true;
    }
  },
async showSubevents() {
    // 获取事件数据
    const eventData = this.eventDataResponse;

    // 更新节点和边
    for (const subevent of eventData.subevents) {
      // 如果subject不为'NON'，则添加subject节点
if (subevent.subject !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-subject`, label: subevent.subject, color: 'yellow', shape: 'box' , font: { size: 15 }, level: subevent.level });
}
// 如果predicate不为'NON'，则添加predicate节点
if (subevent.predicate !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-predicate`, label: subevent.predicate, color: 'lightgreen', font: { size: 20 }, level: subevent.level  });
}
// 如果object不为'NON'，则添加object节点
if (subevent.object !== 'NON') {
  this.nodes.add({ id: `subevent-${subevent.id}-object`, label: subevent.object, color: 'yellow', shape: 'box', font: { size: 15 }, level: subevent.level  });
}

// 如果subject和predicate都不为'NON'，则添加边
if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
  this.edges.add({ id: `edge-subject-predicate-${subevent.id}`,from: `subevent-${subevent.id}-subject`, to: `subevent-${subevent.id}-predicate`, color: 'lightgray' });
}
// 如果predicate和object都不为'NON'，则添加边
if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
  this.edges.add({ id: `edge-predicate-object-${subevent.id}`, from: `subevent-${subevent.id}-predicate`, to: `subevent-${subevent.id}-object`, color: 'lightgray' });
}



      // 找到子事件对应的事件
      const event = eventData.events.find(event => event.id === subevent.event_id);
      if (event) {
        // 添加边，连接事件的predicate节点和子事件的predicate节点
        this.edges.add({ id: `edge-event-subevent-${subevent.id}`, from: event.id, to: `subevent-${subevent.id}-predicate`, color: 'lightgray', dashes: [5, 5] });
      }
    }
  },
  async hideSubevents() {
  // 获取事件数据
  const eventData = this.eventDataResponse;

  // 删除子事件节点和边
  for (const subevent of eventData.subevents) {
    this.nodes.remove(`subevent-${subevent.id}-subject`);
    this.nodes.remove(`subevent-${subevent.id}-predicate`);
    this.nodes.remove(`subevent-${subevent.id}-object`);

    // 删除子事件之间的边
    if (subevent.subject !== 'NON' && subevent.predicate !== 'NON') {
      this.edges.remove(`edge-subject-predicate-${subevent.id}`);
    }
    if (subevent.predicate !== 'NON' && subevent.object !== 'NON') {
      this.edges.remove(`edge-predicate-object-${subevent.id}`);
    }

    // 删除子事件和事件之间的边
    const event = eventData.events.find(event => event.id === subevent.event_id);
    if (event) {
      this.edges.remove(`edge-event-subevent-${subevent.id}`);
    }
  }
},
async toggleTimeRelations() {
    // 获取事件数据
    const eventData = this.eventDataResponse;

    if (this.showTimeRelations) {
      // 隐藏时序关系的边
      for (const relation of eventData.time_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.remove(`time-relation-${relation.event1_id}-${relation.event2_id}`);
        }
      }
      this.showTimeRelations = false;
    } else {
      // 显示时序关系的边
      for (const relation of eventData.time_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.add({
          id: `time-relation-${relation.event1_id}-${relation.event2_id}`,
            from: fromEvent.id,
            to: toEvent.id,
            color: '#c06c84',
            arrows: 'to',
            width: 5,
          });
        }
      }
      this.showTimeRelations = true;
    }
  },
  async toggleCausalRelations() {
    // 获取事件数据
    const eventData = this.eventDataResponse;

    if (this.showCausalRelations) {
      // 隐藏因果关系的边
      for (const relation of eventData.causal_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.remove(`causal-relation-${relation.event1_id}-${relation.event2_id}`);
        }
      }
      this.showCausalRelations = false;
    } else {
      // 显示因果关系的边
      for (const relation of eventData.causal_relations) {
        const fromEvent = eventData.events.find(event => event.id === relation.event1_id);
        const toEvent = eventData.events.find(event => event.id === relation.event2_id);
        if (fromEvent && toEvent) {
          this.edges.add({
          id: `causal-relation-${relation.event1_id}-${relation.event2_id}`,
            from: fromEvent.id,
            to: toEvent.id,
            color: '#355c7d',
            dashes: [20, 20] ,
            arrows:'to',
            width: 5,
          });
        }
      }
      this.showCausalRelations = true;
    }
  },

  },
  mounted() {
    var legendContainer = this.$refs.legendContainer;

  // 时序关系图例
  var timingLegend = document.createElement('div');
  timingLegend.innerHTML = `
    <div class="legend-line timing-line"></div>
    <div class="legend-text">时序关系</div>
  `;
  legendContainer.appendChild(timingLegend);

  // 因果关系图例
  var causeEffectLegend = document.createElement('div');
  causeEffectLegend.innerHTML = `
    <div class="legend-line cause-effect-line"></div>
    <div class="legend-text">因果关系</div>
  `;
  legendContainer.appendChild(causeEffectLegend);
    this.network = new Network(document.getElementById('network2'), { nodes: this.nodes, edges: this.edges }, {layout: {
    hierarchical: {
      enabled: true,
      direction: 'LR', // UD for vertical layout, LR for horizontal layout
      sortMethod: 'directed', // directed for directed networks, hubsize for non-directed networks
      levelSeparation: 350,
      nodeSpacing: 30,
    }
  },
    interaction: {
    // zoomView: false, // 禁止通过鼠标滚轮或触摸板缩放

    // dragView: false // 禁止拖动整个视图
  },
    clickToUse: true,
    edges: {
    smooth: {
      type: 'curvedCW', // 或 'curvedCCW'，根据需要选择
      roundness: 0.3
    }}});

    // 添加click事件监听器
// this.network.on('click', function (params) {
//   if (params.nodes.length > 0) {
//     // 获取被点击的节点的数据
//     console.log(this.nodes)
//     var nodeId = params.nodes[0];
//     var nodeData = this.nodes.get(nodeId);
//
//     // 显示tooltip（这里只是一个简单的示例，你可能需要更复杂的逻辑）
//     var tooltip = document.createElement('div');
//     tooltip.className = 'custom-tooltip'; // 自定义CSS类
//     tooltip.textContent = nodeData.reason; // 显示节点的title属性作为tooltip内容
//
//     // 将tooltip添加到页面上（这里只是一个简单的示例，你可能需要更复杂的逻辑来定位tooltip）
//     document.body.appendChild(tooltip);
//
//     // 在一段时间后移除tooltip（可选）
//     setTimeout(function() {
//       document.body.removeChild(tooltip);
//     }, 2000); // 2秒后移除tooltip
//   }
// });
  },
  components: { Nar,Graph,Sche }
};


</script>

<style scoped>
@import '../static/assets/css/style.css';
.timeline .发生 { background-color: #51f6bc; }
.timeline .发展 { background-color: #fff983; }
.timeline .扩散 { background-color: #ff3f66; }
.timeline .衰退 { background-color: #68d5ff; }
.list-fade-enter-active, .list-fade-leave-active {
  transition: all 0.5s;

}
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.list-fade-enter {
  opacity: 1;
  transform: translateY(-30px);
}
.list-fade-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  background: #4e6ef2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

button:hover,
button.selected {
  background-color: #4662d9;
  color: white;
  /*transform: scale(1.1);*/
  /*background: linear-gradient(to right, #3464e0, #9214f4);*/
  /*color: white;*/
  /*border: 2px solid blue;*/
}
.loadingdot {

    left: 10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;  /* 设置点的颜色为透明 */
    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */
    transition: transform .2s;  /* 添加过渡效果 */
    cursor: pointer;
    animation: jump 1s infinite;  /* 添加跳动动画 */
  display: inline-block;
  margin-right: 20px;
}

.loadingdot:nth-child(2) {
    animation-delay: 0.2s;  /* 第二个点延迟1秒开始跳动 */
}

.loadingdot:nth-child(3) {
    animation-delay: 0.4s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(4) {
    animation-delay: 0.6s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(5) {
    animation-delay: 0.8s;  /* 第三个点延迟2秒开始跳动 */
}
.loadingdot:nth-child(6) {
    animation-delay: 1s;  /* 第三个点延迟2秒开始跳动 */
}

@keyframes jump {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}

/*搜索备选样式*/
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
    left: 10%;
    top: 42%;
    -webkit-animation-delay: 1.2s;
    -moz-animation-delay: 1.2s;
    animation-delay: 1.2s;
}
.animation ul.icons-list li:nth-child(3){
    left: 23%;
    top: 52%;
    -webkit-animation-delay: 1.4s;
    -moz-animation-delay: 1.4s;
    animation-delay: 1.4s;
}
.animation ul.icons-list li:nth-child(4){
    right: 23%;
    top: 52%;
    -webkit-animation-delay: 1.6s;
    -moz-animation-delay: 1.6s;
    animation-delay: 1.6s;
}
.animation ul.icons-list li:nth-child(5){
    right: 10%;
    top: 42%;
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
.search-box {
  transition: all 0.5s ease;
}
footer {
    background: url(static/picture/footer_bg.jpg) center no-repeat;
    background-size: cover;
    padding: 2.5rem 0 2rem;
  display: block;
}
footer .w1200 {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.w1200 {
    max-width: 1466px;
    margin: 0 auto;
    padding: 0 50px;
}
footer .line {
    width: 1px;
    background: #4db3b3;
}
.list_box_06 {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    max-width: 24.375rem;
}
.list_box_06 li {
    font-size: 1rem;
    color: #fff;
    line-height: 2;
    min-width: 50%;
    padding: 0 5px;
    transition: .5s;
}
footer .right .box {
    display: flex;
}
footer .right .box .ll {
    padding: 0 2rem 0 0;
}
footer .left p {
    font-size: .875rem;
    color: #fff;
    line-height: 1.8125rem;
    max-width: 21.25rem;
    text-transform: inherit;
}
.list_box_06 li {
    font-size: 1rem;
    color: #fff;
    line-height: 2;
    min-width: 50%;
    padding: 0 5px;
    transition: .5s;
}
.list_box_06 li a {

    color: #fff;

}
.title002 h3 {
    font-size: 1.375rem;
    color: #fff;
    padding: 0 0 1rem;
    position: relative;
    margin-bottom: 1.25rem;
}
footer .right .box .ll p {
    font-size: 1rem;
    color: #fff;
    line-height: 2;
    text-transform: inherit;
}
footer .right .box .rr img {
    width: 7.6235rem;
}
li{
  list-style-type: none;
}
</style>
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
  background: linear-gradient(to right, #40a9ff, #1890ff);
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
    margin-top: 80px;
    text-align: -webkit-center;
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
<style>
/*图例样式*/
.legend-line {
  display: inline-block;
  height: 10px;
  margin: 5px 0;
  vertical-align: middle;
}

.legend-text {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.timing-line {
  width: 50px;
  border-bottom: 3px solid #c06c84;
  height: 6px; /* 稍微调整高度以匹配虚线效果 */
  margin-top: 2px; /* 调整垂直居中 */
}

.cause-effect-line {
  width: 50px;
  border-bottom: 3px dashed #355c7d; /* 虚线效果通过 border 实现 */
  height: 6px; /* 稍微调整高度以匹配虚线效果 */
  margin-top: 2px; /* 调整垂直居中 */
}
</style>
