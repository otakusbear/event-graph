<script> 
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue';
const datas = [{
  title: '孙宏斌许家印先后“入坑”还有谁敢投资贾跃亭？',
}, {
  title: '孙宏斌许家印先后“入坑”还有谁敢投资贾跃亭',
}, {
  title: '孙宏斌许家印先后“入坑”还有谁敢投资贾跃亭',
}, {
  title: '孙宏斌许家印先后“入坑”还有谁敢投资贾跃亭',
}];
export default defineComponent({
  setup() {
    return {
      datas,
      ysj:'资金支持'
    };
  },
});
</script>

<template>
<div class="h">
    <a-input-search
      class="search"
      v-model:value="value"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
</div>
<div id="top-content">
    <a-card style="width: 80%" class="card">
        <div class="h1">
            <span>事件类型：</span> 
            <a-tag color="orange">制造</a-tag>
            <span>该事件类型定义的论元：</span> 
            <a-tag color="orange">制造</a-tag>
            <a-tag color="orange">制造</a-tag>       
        </div>
        <p>信息资讯</p>
        <p>贾跃亭再获一亿美元融资贾跃亭又赢了！率合伙人重组ff董事会</p>
    </a-card>
    <a-tabs v-model:activeKey="activeKey" class="tabs" defaultActiveKey="1">
        <a-tab-pane key="1" :tab="`因事件:${ysj}`">因事件

        </a-tab-pane>
        <a-tab-pane key="2" :tab="`果事件:${ysj}`">果事件

        </a-tab-pane>
        <a-tab-pane key="3" tab="事件链">事件链

        </a-tab-pane>
        <template #leftExtra>
            <div>
                前序原因：
                <a-tag color="orange">资金加持</a-tag>
            </div>
        </template>
        <template #rightExtra>
            <div>
                进一步搜索：
                <a-tag color="orange">资金加持</a-tag>
            </div>
        </template>
    </a-tabs>
    <a-tabs v-model:activeKey="activeKey" class="tabs" defaultActiveKey="4">
        <a-tab-pane key="4" :tab="`因事件:${ysj}`">
            <a-list item-layout="horizontal" :data-source="datas">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      description="据了解贾跃亭造车计划的加速推进得益于资金加持"
                    >
                      <template #title>
                        <a href="#">{{ item.title }}</a>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
        </a-tab-pane>
        <a-tab-pane key="5" :tab="`果事件:${ysj}`">果事件

        </a-tab-pane>
        <a-tab-pane key="6" tab="事件链">事件链

        </a-tab-pane>
        <template #leftExtra>
            <div>
                后序结果：
                <a-tag color="orange">资金加持</a-tag>
            </div>
        </template>
        <template #rightExtra>
            <div>
                进一步搜索：
                <a-tag color="orange">资金加持</a-tag>
            </div>
        </template>
    </a-tabs>
</div>
</template>

<style scoped>
.h1{
    border-bottom: 1px solid #f0f0f0;
    padding: 10px;
}
.h{
    background-color: rgb(199, 203, 203);
    position: fixed;
    z-index: 5;
    width: 100%;
    height: 80px;
}
#top-content{
    height: 100%;
    min-height: 100vh;
    background-image: url('./static/picture/top-bg.png');
    background-repeat: repeat;
    background-size: 15px 15px;
    padding-bottom: 30px;
    padding-top: 100px;
}
.search{
    border-radius: 8px;
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 15px;
}
.card{
    border-radius: 8px;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 30px;
}
.tabs{
    border-radius: 8px;
    margin-left: 10%;
    margin-right: 10%;
    margin-bottom: 30px;
    background-color: #fff;
    padding: 20px;
}
.tabs-extra-demo-button {
  margin-right: 16px;
}

.ant-row-rtl .tabs-extra-demo-button {
  margin-right: 0;
  margin-left: 16px;
}
</style>
