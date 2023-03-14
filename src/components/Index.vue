<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  data() {
    return {
        iconsList:[
            "/src/components/static/picture/t1.png",
            "/src/components/static/picture/t2.png",
            "/src/components/static/picture/t3.png",
            "/src/components/static/picture/t4.png",
            "/src/components/static/picture/t5.png",
            "/src/components/static/picture/t6.png",]
    };
  },
  setup() {
    const router = useRouter()
    function toSearch(){
        router.push({ path: '/search'})
    }
    const state = reactive({
      tags: ['全球市场动荡', '疫情防控', '股票下跌', '国际石油价格下跌','疫情扩散'],
      selectedTags: [],
    });
    const handleChange = (tag, checked) => {
      const {
        selectedTags,
      } = state;
      const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
      console.log('You are interested in: ', nextSelectedTags);
      state.selectedTags = nextSelectedTags;
    };
    return {
      ...toRefs(state),
      handleChange,
      toSearch
    };
  },
})


</script>

<template>
  <div id="top-content" class="container-fluid">
    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center">
                <div class="big-title">Better Web Hosting, For You.</div>
                
                <div class="domain-search-holder">
                    <!-- <form id="domain-search">
                        <input id="domain-text" type="text" name="domain" placeholder="请输入您想要了解的事件">
                        <input id="search-btn" type="submit" name="submit" value="Search" @click="toSearch">
                        
                    </form> -->
                    <a-input-search
                        :style="{width: '600px'}"
                        v-model:value="value"
                        placeholder="请输入您想要了解的事件"
                        enter-button="Search"
                        size="large"
                        @search="toSearch"
                    />
                </div>
                <div class="sub-title">
                    <img src="./static/picture/hot.png" alt="hot">
                    <span :style="{ marginRight: '8px',marginLeft:'5px' }">近期热门事件:</span>
                    <template v-for="tag in tags" :key="tag">
                        <a-checkable-tag
                        :checked="selectedTags.indexOf(tag) > -1"
                        @change="checked => handleChange(tag, checked)">
                        {{ tag }}
                        </a-checkable-tag>
                    </template>
                </div>
                <div class="animation">
                    <img src="./static/picture/laptop.png" alt="laptop">
                    <ul class="icons-list">
                        <li v-for="item in iconsList">
                            <a href="#">
                                <img class="fa" :src="item">
                            </a>
                        </li>
                    </ul>
                   
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

#top-content{
    height: 100vh;
    padding-top: 115px;
    background-image: url('./static/picture/top-bg.png');
    background-repeat: repeat;
    background-size: 15px 15px;
    text-align:center;
}
.big-title{
    font-family: 'Palanquin Dark', sans-serif;
    font-weight: 500;
    font-size: 50px;
    color: #7f97ad;
    margin-bottom: 10px;
}
.sub-title {
    padding-top: 5px;
    font-size: 12px;
    color: #3b3c3c;
}
/* .ant-input-search .ant-input-lg{
    border-radius: 8px;
    line-height: 2;
} */
.domain-search-holder{
    margin-top: 30px;
}
/* .domain-search-holder input[type="text"]{
    border-radius: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border: 1px solid #c9dff3;
    padding: 20px 25px;
    font-size: 15px;
    min-width: 500px;
    outline: 0;
}
.domain-search-holder input[type="submit"]{
    border: 0;
    border-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid #1f8ded;
    padding: 20px 25px;
    color: #ffffff;
    background-color: #1f8ded;
    font-size: 15px;
    font-family: 'Montserrat-Bold', sans-serif;
    margin-left: -4px;
    outline: 0;
}
.domain-search-holder input[type="submit"]:hover,.domain-search-holder input[type="submit"]:focus{
    background-color: #0e76d0;
} */
/* .text-search-holder{
    margin-top: 30px;
}
.text-search-holder input[type="text"]{
    border-radius: 0;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border: 1px solid #c9dff3;
    padding: 20px 25px;
    font-size: 15px;
    min-width: 300px;
    outline: 0;
}
.text-search-holder input[type="submit"]{
    border: 0;
    border-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid #1f8ded;
    padding: 20px 25px;
    color: #ffffff;
    background-color: #1f8ded;
    font-size: 15px;
    font-family: 'Montserrat-Bold', sans-serif;
    margin-left: -4px;
    outline: 0;
}
.domain-search-holder input[type="submit"]:hover,.domain-search-holder input[type="submit"]:focus{
    background-color: #0e76d0;
} */
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
    width: 55px;
    height: 55px;
    background-color: #ffffff;
    border-radius: 200px;
    padding-top: 10px;
}
.animation ul.icons-list li a .fa{
    font-size: 20px;
    color: #1f8ded;
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
    background-color: #1f8ded;
}
.animation ul.icons-list li a:hover .fa{
    color: #ffffff;
}
</style>
