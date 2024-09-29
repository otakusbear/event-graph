<script>
import { useRouter } from 'vue-router'
import Nar from './Nar.vue';
import { defineComponent, reactive, toRefs } from 'vue';
import axios from "axios";
export default defineComponent({
  setup() {
    const router = useRouter()
    function toInput(){
        router.push({ path: '/input'})
    }
    function toFind(){
        router.push({ path: '/find'})
    }
    function toAnalyze(){
        router.push({ path: '/analyze'})
    }
    return {
      toFind,
      toInput,
      toAnalyze
    };
  },
  data() {
    return {
      eventloading:false,
      nodeId:null,
      x:'',
      y:'',
      dot:'',
      uniqueId: '',
      allData:[],
      loading:false,
      timelineData: [],
      selectedEventType: '',
      selectedEvent: null,
    }
  },
  components: { Nar },
  methods: {
    openModal(event) {
      this.selectedEvent = event;
    },
    closeModal() {
      this.selectedEvent = null;
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
                        this.loading = false;
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
     openLink(url) {
      window.open(url, '_blank');
    },
    async bingSearch() {
  this.loading = true;
  this.eventloading = true;
      this.timelineData = [];
      this.allData = [];
      const searchResults = await axios.get('/api/bing', {
    params: { event_topic: this.selectedEventType, count: "20" ,uniqueId: this.uniqueId},
  });
      console.log(searchResults)
      // 使用搜索结果更新时间轴数据
      this.allData = searchResults.data.map(result => ({
        time: result[0],  // 发布时间
        name: result[2],  // 标题
        source: result[4], //来源
        summary: result[1],  // 简介
        link: result[5],  // 新闻源网页链接
      }));
//       this.allData.sort((a, b) => {
//   // 将时间字符串转换为 Date 对象
//   const dateA = new Date(a.time);
//   const dateB = new Date(b.time);
//
//   // 按照时间顺序排序
//   return dateA - dateB;
// });
  this.loadData();
      return searchResults;
    },
    handleSelectChange() {
    if (!this.selectedEventType) {
        alert('请输入检索词');
        return;
    }
    else {
      let element = document.getElementById('searchbar');
      element.style.top = '120px';


    this.bingSearch();
    }
  },
  }
})


</script>

<template>
  <!-- <div id="top-content" class="container-fluid">
    <div class="big-title">群体性事件演化机制研究系统</div>
    <div>
        <img src="./static/picture/laptop.png" alt="laptop">
    </div>
    <a-button @click="toInput" type="link" class="butt"> &lt&lt构建事理图谱</a-button>
    <a-button @click="toFind" type="link" class="butt">查找事理图谱>></a-button>
  </div> -->
  <Nar></Nar>
  <div id="searchbar" style="width: 100%;left: 50%; top: 50%; transition: top 0.5s;"><div style="text-align: center"><input style="font-size: 18px;height: 50px;width: 320px;border-radius: 15px 0 0 15px;border: 1px solid #1984ff" v-model="selectedEventType" @keyup.enter="handleSelectChange" />
    <a-button style="border-radius: 0 15px 15px 0;height: 52px;background-color: #1f8ded" @click="handleSelectChange"><span style="color: #ffffff;font-size: 18px">生成时间轴</span></a-button></div>
    <br>
    </div>
    <div style="z-index: 1;left: 50%;top: 50%; transform: translate(-50%, -50%); text-align: center;align-items: center;padding-top: 50px;position:absolute;width: 200px;height: 150px;background-color: #f9f9f9d9;border-radius: 10px;box-shadow: 0px 0px 10px rgba(0,0,0,0.2);" v-if="eventloading">
        <div class="loadingdot"></div>
      <div class="loadingdot"></div>
      <div class="loadingdot"></div>

        <p style="text-align: center;align-items: center;padding-top: 20px">时间轴加载中···</p>
      </div>
<!--    <div ref="network" id="network"></div>-->
    <div class="tlcontainer" style="top: 40%;left: 10%;width:80%;height:50%;overflow-x: auto;overflow-y: hidden;scroll-behavior: smooth;">
      <div id="timeline" v-if="timelineData.length > 0">
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event top" v-if="event.name.length % 2 === 0" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>

            </div>
            <div class="event placeholder" v-else></div>
           <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">
             <h3>相关真实新闻</h3>
      <div class="modal-content">
        <div v-for="(item, index) in event.summary" class="event top" @click.stop="openLink(event.link[index])" v-bind:title="item">
          <div class="dot"></div>
          <p class="summary">{{ item }}</p>
          <p class="source">新闻来源:{{ event.source[index] }}</p>
        </div>
      </div>
    </div>
        </div>
    </div>
    <div class="row">
        <div v-for="event in timelineData" :key="event.time">
            <div class="event bottom" v-if="event.name.length % 2 === 1" @click="openModal(event)" v-bind:title="event.summary">
                <div class="dot"></div>
                <p class="month">{{ event.time }}</p>
  <p class="name">{{ event.name }}</p>

            </div>
            <div class="event placeholder" v-else></div>
          <div v-if="selectedEvent === event" class="modal" @click.self="closeModal">
            <h3>相关真实新闻</h3>
      <div class="modal-content">
        <div v-for="(item, index) in event.summary" class="event top" @click.stop="openLink(event.link[index])" v-bind:title="item">
          <div class="dot"></div>
          <p class="summary">{{ item }}</p>
          <p class="source">新闻来源:{{ event.source[index] }}</p>
        </div>
      </div>
    </div>
        </div>
    </div>
</div>


    </div>
  <a-carousel autoplay>
    <div class="silder">
      <a-row>
        <a-col :span="12">
          <img class="animated" src="./static/picture/1.png" alt="slider Image">
        </a-col>
        <a-col :span="12" >
          <div class="title1">事理图谱构建</div>
          <a-button value="large" ghost @click="toInput">开始构建</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="silder">
      <a-row>
        <a-col :span="12">
          <img class="animated" src="./static/picture/1.png" alt="slider Image">
        </a-col>
        <a-col :span="12" >
          <div class="title1">事理图谱查找</div>
          <a-button value="large" ghost @click="toFind">开始查找</a-button>
        </a-col>
      </a-row>
    </div>
    <div class="silder">
      <a-row>
        <a-col :span="12">
          <img class="animated" src="./static/picture/1.png" alt="slider Image">
        </a-col>
        <a-col :span="12" >
          <div class="title1">实例分析</div>
          <a-button value="large" ghost @click="toAnalyze">查看实例</a-button>
        </a-col>
      </a-row>
    </div>
  </a-carousel>

  <div class="gutter">
    <router-link to="/input">
    <div class="c">
      <div class="svg">
        <svg t="1712744866266" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1571" width="64" height="64"><path d="M26.155913 301.712857l473.815966 258.589596c4.749258 1.969692 9.788471 2.919544 14.967662 2.999531 4.969224 0 10.958288-1.969692 14.897672-2.919544l479.655054-258.659584a28.911483 28.911483 0 0 0 16.137478-28.915482 29.835338 29.835338 0 0 0-17.007342-27.955632L534.866427 4.209342c-8.988596-4.999219-19.916888-4.999219-28.905483 0L27.255741 244.841743A30.650211 30.650211 0 0 0 9.298547 272.807374c0 12.997969 5.989064 22.926418 16.937354 28.915482h-0.079988zM519.908764 68.089361l404.896735 206.677707L514.939541 495.482581 109.972817 274.777066l409.935947-206.607717v-0.079988z m482.644587 411.405718l-94.685205-47.962506-67.899391 36.944227 79.867521 40.883612L509.910327 730.04593 105.003593 509.420403l84.766755-42.923293-67.819403-36.944228L21.196688 479.495079c-22.926418 11.96813-23.866271 44.902984-0.949852 56.871114l473.745978 258.589595c4.969224 2.919544 10.948289 4.019372 15.917513 4.019372 5.269177 0.089986 10.448367-1.299797 14.967661-4.019372l478.705202-258.589595c10.698328-5.579128 17.307296-16.727386 17.097329-28.785502s-7.22887-22.966411-18.11717-28.155601v0.069989z m0 223.61506L912.757382 659.157007l-67.749414 36.944227L919.836276 733.045462l-409.935948 220.625527L105.003593 733.045462l78.84768-35.924387-67.89939-36.944228-94.695204 42.933292c-22.926418 11.96813-23.946258 44.902984-1.019841 56.941103l473.745977 258.519606c5.989064 2.039681 9.928449 4.019372 15.917513 4.019372 5.269177 0.089986 10.448367-1.299797 14.967661-4.019372l478.705203-258.589595a31.829027 31.829027 0 0 0 17.097328-28.785502 31.81003 31.81003 0 0 0-18.117169-28.155601v0.069989z m0 0" fill="#FFFFFF" p-id="1572"></path></svg>      </div>
      事理图谱构建
    </div>
      </router-link>
    <router-link to="/find">
    <div class="c">
      <div class="svg">
        <svg t="1712743312579" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2383" width="64" height="64"><path d="M913.95109 457.784728a425.885876 425.885876 0 0 1-687.379804 336.023956 490.066877 490.066877 0 0 0 604.757944-587.722509 422.351023 422.351023 0 0 1 82.62186 251.698553z" fill="#FFFFFF" p-id="2384"></path><path d="M938.737648 1014.332391l-179.170188-187.389786a454.377641 454.377641 0 0 1-271.417069 89.010148 454.846115 454.846115 0 0 1-323.673266-134.068873 454.846115 454.846115 0 0 1-134.068873-323.673266 454.760938 454.760938 0 0 1 134.068873-323.673266A454.888704 454.888704 0 0 1 488.150391 0.425886a454.846115 454.846115 0 0 1 323.673266 134.111462 454.760938 454.760938 0 0 1 134.068873 323.673266 454.846115 454.846115 0 0 1-134.068873 323.673266l-3.62003 3.577441 176.657461 184.877059a31.984029 31.984029 0 0 1-1.022126 45.186491 31.771086 31.771086 0 0 1-22.060888 8.815838 31.898852 31.898852 0 0 1-23.040426-10.008318zM94.163367 457.997671a394.370321 394.370321 0 0 0 393.944435 393.901847 394.370321 394.370321 0 0 0 393.944436-393.901847 394.370321 394.370321 0 0 0-393.944436-393.944435 394.370321 394.370321 0 0 0-393.944435 393.774081z" fill="#FFFFFF" p-id="2385"></path><path d="M242.329063 605.694893a31.941441 31.941441 0 0 1-28.917651-18.313093 303.912161 303.912161 0 0 1 104.597572-381.12527 31.941441 31.941441 0 1 1 35.817002 52.895025 240.02928 240.02928 0 0 0-82.62186 300.973549 31.941441 31.941441 0 0 1-28.875063 45.569789z" fill="#FFFFFF" p-id="2386"></path></svg>
      </div>
      事理图谱查找
    </div>
      </router-link>
    <router-link to="/lepton">
    <div class="c">
      <div class="svg">
        <svg t="1712745059501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2855" width="64" height="64"><path d="M512 127.168l-62.912 1.6c-216.128 15.84-387.2 195.84-387.2 416.032 0 230.624 186.656 417.568 417.312 417.568 220.224 0 400-171.456 415.936-387.584L896.512 512 512 512 512 127.168zM833.024 576c-15.648 192-168.096 324.672-354.112 324.672-196.448 0-355.744-159.36-355.744-355.808C123.168 358.848 256 206.304 448 190.624L448 576 833.024 576zM544 65.344 544 480l414.368 0C958.368 256 768 65.344 544 65.344zM608 131.872c32 4.576 49.44 12.192 74.4 22.752 42.432 17.92 79.04 43.616 111.776 76.352 32.736 32.736 57.696 68.032 75.648 110.464 10.56 24.96 17.408 42.56 22.016 74.56L608 416 608 131.872z" fill="#FFFFFF" p-id="2856"></path></svg>
      </div>
      数据地图
    </div>
      </router-link>
    <router-link to="/chart">
    <div class="c" to="/chart">
      <div class="svg">
        <svg t="1713280262494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4340" width="64" height="64"><path d="M998.4 364.544a99.072 99.072 0 0 1-16.384 143.872 103.936 103.936 0 0 1-90.88 17.408L602.88 835.84a109.824 109.824 0 0 1 5.376 34.56 100.352 100.352 0 1 1-200.704 0 38.4 38.4 0 0 1 0-7.424l-174.336-102.4a104.448 104.448 0 0 1-52.992 15.872 100.352 100.352 0 0 1-71.424-28.928 98.56 98.56 0 0 1-28.928-71.424 102.4 102.4 0 0 1 36.352-76.8L76.8 416.512a96 96 0 0 1-72.192-67.584 98.816 98.816 0 0 1 66.816-124.672 97.536 97.536 0 0 1 83.456 12.032l175.616-103.936A108.288 108.288 0 0 1 364.288 76.8a97.792 97.792 0 0 1 141.056 13.568 108.8 108.8 0 0 1 20.736 40.96L870.4 343.552a97.792 97.792 0 0 1 130.048 20.992z m-455.424 137.728a114.432 114.432 0 0 1-54.528 80.896L486.4 588.8l40.192 188.416 4.608 4.608h3.84l3.84 1.28 6.4-1.536 272.128-288.512-4.864-10.24-263.68 14.336z m-128 93.696a102.4 102.4 0 0 1-49.92-17.152h-7.424l-86.528 71.424-2.048 6.656a65.024 65.024 0 0 1 3.328 18.688 51.2 51.2 0 0 1-1.28 8.704l2.816 6.656 179.2 105.728 9.216-6.656-40.448-188.928zM230.4 597.248l88.576-69.376 2.048-6.912a117.248 117.248 0 0 1-5.632-37.888 29.952 29.952 0 0 1 0-7.424l-3.584-7.168-146.688-63.488-8.448 7.168 39.168 173.312 5.12 4.608a82.432 82.432 0 0 1 22.528 7.936h6.4zM187.648 332.8v4.864l3.84 6.144 148.224 64.256 7.168-1.792a99.328 99.328 0 0 1 46.336-30.72l4.352-5.888v-128l-3.328-5.376a112.384 112.384 0 0 1-30.72-23.04l-7.68-1.28L191.232 307.2l-3.072 5.632a142.848 142.848 0 0 1 0 20.992zM496.64 213.76a69.12 69.12 0 0 1-8.96 9.728l-1.28 1.536a200.704 200.704 0 0 1-18.176 11.008l-3.328 5.376v128l4.096 5.888a119.296 119.296 0 0 1 62.976 53.76l5.888 3.328 278.272-17.152 2.816-11.52-314.112-191.488-8.192 1.536z" fill="#FFFFFF" p-id="4341"></path></svg>
      </div>
      演化特征分析
    </div>
      </router-link>
    <router-link to="/pattern">
    <div class="c">
      <div class="svg">
        <svg t="1712745524210" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5497" width="64" height="64"><path d="M399.387199 158.662603c17.451464 0 31.600719-14.149255 31.600719-31.600719L430.987918 96.232738c0-17.451464-14.149255-31.600719-31.600719-31.600719-17.451464 0-31.600719 14.149255-31.600719 31.600719l0 30.829146C367.786481 144.513348 381.935736 158.662603 399.387199 158.662603z" fill="#FFFFFF" p-id="5498"></path><path d="M624.957655 158.662603c17.451464 0 31.600719-14.149255 31.600719-31.600719L656.558373 96.232738c0-17.451464-14.149255-31.600719-31.600719-31.600719-17.451464 0-31.600719 14.149255-31.600719 31.600719l0 30.829146C593.356936 144.513348 607.506191 158.662603 624.957655 158.662603z" fill="#FFFFFF" p-id="5499"></path><path d="M427.2682 229.567489c11.341303 18.258852 42.468231 49.15963 87.164199 49.15963 44.479027 0 75.987648-30.66951 87.596034-48.789193 9.324366-14.56574 5.097088-33.745569-9.350972-43.26027-14.431687-9.499351-33.966603-5.457292-43.666522 8.856715-0.134053 0.200568-13.773701 19.992333-34.57854 19.992333-20.228717 0-32.809243-18.320251-33.662681-19.60143-9.273201-14.59644-28.607548-19.020192-43.332924-9.874905C422.608064 195.262172 418.056398 214.744899 427.2682 229.567489z" fill="#FFFFFF" p-id="5500"></path><path d="M498.431983 896.779503 259.370259 896.779503c-40.658002 0-73.734328-33.076326-73.734328-73.734328L185.635931 212.101699c0-40.658002 33.076326-73.734328 73.734328-73.734328 17.451464 0 31.600719-14.149255 31.600719-31.600719s-14.149255-31.600719-31.600719-31.600719c-75.508741 0-136.935766 61.427024-136.935766 136.935766l0 610.943476c0 75.508741 61.427024 136.935766 136.935766 136.935766l239.061724 0c17.451464 0 31.600719-14.149255 31.600719-31.600719C530.032702 910.928758 515.883447 896.779503 498.431983 896.779503z" fill="#FFFFFF" p-id="5501"></path><path d="M901.909337 212.101699c0-75.508741-61.432141-136.935766-136.935766-136.935766-17.45658 0-31.600719 14.149255-31.600719 31.600719s14.144138 31.600719 31.600719 31.600719c40.652885 0 73.734328 33.076326 73.734328 73.734328l0 431.874101c0 1.039679 0.207731 2.02103 0.305969 3.035126-3.163039 5.531993-11.175527 14.616906-30.096459 14.616906L658.681734 661.627832c-46.402843 0-93.840248 10.095939-93.840248 84.96716l0 133.947711c0 38.5899 15.08558 64.008826 44.937468 75.596745 6.897084 2.6432 13.475919 3.868097 19.853164 3.868097 20.290115 0 38.543851-12.395308 58.427714-30.783097 0.530073-0.488117 1.043772-0.997724 1.543146-1.527796 212.305337-225.220485 212.305337-261.321704 212.305337-273.186939 0-1.898233-0.178055-3.76372-0.49835-5.587252 0.25685-1.62194 0.49835-3.252067 0.49835-4.945639L901.908314 212.101699zM644.378983 883.534851c-6.907317 6.326079-11.531638 9.772574-14.354939 11.618619-0.781806-1.934049-1.980097-6.259564-1.980097-14.611789L628.043946 746.593969c0-14.385639 2.103918-18.413372 1.939165-18.413372 0 0 0 0-0.005117 0 0.910743-0.606821 6.259564-3.353374 28.704762-3.353374l126.700657 0C747.023758 771.338536 693.851745 831.011614 644.378983 883.534851z" fill="#FFFFFF" p-id="5502"></path><path d="M743.911884 523.368932 280.431947 523.368932c-17.451464 0-31.600719 14.149255-31.600719 31.600719 0 17.451464 14.149255 31.600719 31.600719 31.600719l463.479937 0c17.45658 0 31.600719-14.149255 31.600719-31.600719C775.512602 537.518187 761.368464 523.368932 743.911884 523.368932z" fill="#FFFFFF" p-id="5503"></path><path d="M743.911884 365.366362 280.431947 365.366362c-17.451464 0-31.600719 14.149255-31.600719 31.600719 0 17.451464 14.149255 31.600719 31.600719 31.600719l463.479937 0c17.45658 0 31.600719-14.149255 31.600719-31.600719C775.512602 379.515616 761.368464 365.366362 743.911884 365.366362z" fill="#FFFFFF" p-id="5504"></path></svg>
      </div>
      演化模式挖掘
    </div>
      </router-link>
    <router-link to="/events">
    <div class="c">
      <div class="svg">
        <svg t="1712745747258" class="icon" viewBox="0 0 1096 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6668" width="64" height="64"><path d="M920.258034 951.393643H195.456313V379.087804L547.301711 90.071941l372.956323 305.387345V951.393643zM547.301711 0L0 447.405379v0.140205h125.083227V986.570171c0 19.70887 15.487687 35.184039 35.189047 35.184039h795.169799c18.291795 0 35.184039-15.48268 35.184039-35.184039V447.553095h104.145057L547.301711-0.002504z" fill="#FFFFFF" p-id="6669"></path><path d="M591.759335 397.747638c0-29.042543-8.988166-30.069046-39.124812-30.069046h-35.289193c-30.134142 0-39.132323 1.026504-39.132323 30.069046v23.296626h113.546328v-23.296626zM817.722836 803.935139l-69.051149-255.013555c-5.275227-20.915638-6.754895-21.639198-36.01776-14.673995l-56.798201 13.494768c-29.270377 6.97021-30.234289 8.26711-23.133887 36.478435l67.08577 247.747912 117.917731-28.033565zM279.659658 796.381575h152.080274v-218.114504H279.659658zM825.576841 832.96266l-117.91022 28.051091 5.770954 21.398846c7.122934 28.211325 8.587579 28.922367 37.880489 21.957163l56.773163-13.482249c33.666817-8.024254 30.259325-8.282132 21.301203-43.794152l-3.815589-14.130699zM478.215511 878.023667c0 29.072587 8.995677 30.116616 39.132323 30.116617h35.286689c34.660773 0 39.124812-1.044029 39.124812-30.11912v-441.972421h-113.54132v441.972421zM310.988049 908.140284H400.33643c30.136645 0 31.400998-1.044029 31.400998-30.11912V852.749144H279.659658v34.044871c0.565829 20.505037 4.571697 21.346269 31.330895 21.346269M431.739932 510.360098c0-29.060068-1.266856-30.084068-31.406005-30.084069h-89.343374c-26.764205 0-30.770073 0.82621-31.330895 21.321233v46.643325h152.080274v-37.880489zM279.659658 837.729643h152.080274v-26.331071H279.659658z" fill="#FFFFFF" p-id="6670"></path></svg>
            </div>
      事件语料库
    </div>
      </router-link>
  </div>
</template>

<style scoped>
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
.svg{
  padding: 25px;
  background: #9214f4;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}
/* #top-content{
    height: 100vh;
    padding-top: 115px;
    background-image: url('./static/picture/bg.png');
    background-repeat: repeat;
    background-size:cover;
    text-align:center;
}
.big-title{
    font-family: 'Palanquin Dark', sans-serif;
    font-weight: 500;
    font-size: 50px;
    color: 	rgb(68, 68, 68);
    margin-bottom: 10px;
}
img{
    max-width: 609px;
}
.butt{
    font-size: 20px;
    color: black;
    margin-right: 20px;
} */
</style>
<style>
#network {
  width: 2000px;
  height: 1000px;
}
</style>
<style scoped>
#timecontainer {
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100vh;
    padding: 10px;
    border-radius: 24px;
    background-color: #f9f9f9d9;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
    overflow-y: auto;
}

/*#timeline {*/
/*    position: relative;*/
/*    margin-left: 24px;*/
/*}*/

.event {
    position: relative;
    padding-left: 20px;
    /*margin-bottom: 20px;*/
  cursor: pointer;
}


.event.bottom:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 10px;
    bottom: -10px;
    width: 10px;
    margin-left: 4px;
    border-left: 2px solid #283838;
    height: 0;
    animation: grow-down 2s forwards;
}

@keyframes grow-down {
    to {height: 200px;}
}
.event.top:before {
    content: "";
    position: absolute;
    left: 0px;
    top: auto;
    bottom: 0px;
    width: 10px;
    margin-left: 4px;
    border-left: 2px solid #283838;
    height: 0;
    animation: grow-down 2s forwards;
    transform-origin: bottom;
    /*transform: scaleY(-1);*/
}

@keyframes grow-down {
    to {height: 200px;}
}


.dot {
    position: absolute;
    left: -10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;  /* 设置点的颜色为透明 */
    border: 2px solid #1890ff;  /* 设置点的边框为浅蓝色 */
  transition: transform .2s;  /* 添加过渡效果 */
  cursor: pointer;
}
.dot::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    width: 0;
    height: 2px;
    border-top: 2px dashed #1890ff;
    animation: grow-right 2s forwards;
  animation-delay: 0.5s;
}

@keyframes grow-right {
    to {width: 320px;}
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
  margin-right: 10px;
  margin-left: 10px;
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
.dot:hover {
    transform: scale(2);  /* 当鼠标悬停时，放大点的大小 */
}
.time, .source, .summary {
    /*display: none;*/
  padding: 10px;
}

.event:hover .time, .event:hover .name, .event:hover .summary {
  overflow: hidden;
    display: block;
}
.loader {
    position: relative;
    text-align: center;
  align-items: center;
    transform: translate(-50%, -50%);
    border: 16px solid rgba(255, 255, 255, 0.1);  /* 半透明的白色 */
    border-top: 16px solid #add8e6;  /* 蓝色 */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    backdrop-filter: blur(10px);  /* 添加毛玻璃效果 */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
p.summary{
  font-weight: lighter;
}
p.name{
  font-weight: bolder;
  font-size: 19px;
}
p.month{
  font-weight: bolder;
  font-size: 18px;
  position: absolute;
  left: -65px;
}
.event.top .month {
  top: 220px;
}
.event.bottom .month {
  top: -35px;
}
#timeline {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
}

.event {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 8px;
    width: 320px;  /* 设置事件的宽度 */
    height: 200px;  /* 设置事件的高度 */
    position: relative;
}

.event.placeholder {
    visibility: hidden;  /* 隐藏占位元素 */
}


.dot {
    position: absolute;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 2px solid #1890ff;
    transition: transform .2s;
    cursor: pointer;
}

/*.dot::before {*/
/*    content: "";*/
/*    position: absolute;*/
/*    left: 50%;*/
/*    width: 2px;*/
/*    background-color: #283838;*/
/*    border-left: 2px dashed #283838;*/
/*    animation: grow-down 2s forwards;*/
/*}*/

.dot::after {
    content: "";
    position: absolute;
    left: 100%;
    width: 100%;
    height: 2px;
    border-top: 2px dashed #1890ff;
    animation: grow-right 1s forwards 1s;
}

.event.top .dot {
    top: 100%;
}

.event.top .dot::before {
    top: 100%;
}

.event.top .dot::after {
    top: 50%;
}

.event.bottom .dot {
    top: 0;
}

.event.bottom .dot::before {
    top: 100%;
}

.event.bottom .dot::after {
    top: 50%;
}
.event.bottom {
  padding-top: 90px;
}
.tlcontainer {
  /* 设置滚动动画的持续时间为 2 秒 */
  /*padding-left: 4rem;*/
  transition: scroll-left 2s;
}
/* 隐藏滚动条的箭头 */
::-webkit-scrollbar-button {
  display: none;
}

/* 设置滚动条的宽度 */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
  background: #888; /* 滑块的颜色 */
  border-radius: 5px; /* 滑块的圆角大小 */
}

/* 当鼠标悬停在滚动条上时，改变滑块的颜色 */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
<style>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>