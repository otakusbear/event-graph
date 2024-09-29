<template>
  <Nar></Nar>
  <a-carousel class="carousel">
    <div>
      <h1>教育</h1>
    </div>
    <div><h1>体育</h1></div>
    <div><h1>政治</h1></div>
    <div><h1>社会时事</h1></div>
    <div><h1>经济</h1></div>
    <div><h1>科技</h1></div>
    <div><h1>灾害</h1></div>
    <div><h1>文娱</h1></div>
    <div><h1>案件</h1></div>
  </a-carousel>
  <div></div>
  <div class="chartCards">
    <div>
      <a-card hoverable style="width: 600px;height: 550px;" class="chartCard">
          <div ref="chart1" style="width: 500px;height:400px;"></div>
        <div class="lines">描述</div>
        <a-card-meta>
          <template #description>描述</template>
        </a-card-meta>
      </a-card>
    </div>
    <div>
      <a-card hoverable style="width: 600px;height: 550px;" class="chartCard">
        <template #cover>
          <div ref="chart2" style="width: 500px;height:400px;"></div>
        </template>
        <div class="lines">描述</div>
        <a-card-meta>
          <template #description>描述</template>
        </a-card-meta>
      </a-card>
    </div>
    <div>
      <a-card hoverable style="width: 600px;height: 550px;" class="chartCard">
        <template #cover>
          <div ref="chart3" style="width: 500px;height:400px;"></div>
        </template>
        <div class="lines">描述</div>
        <a-card-meta>
          <template #description>描述</template>
        </a-card-meta>
      </a-card>
    </div>
    <div>
      <a-card hoverable style="width: 600px;height: 550px;" class="chartCard">
        <template #cover>
          <div ref="chart4" style="width: 500px;height:400px;"></div>
        </template>
        <div class="lines">描述</div>
        <a-card-meta>
          <template #description>描述</template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import Nar from './Nar.vue';
export default {
  components: { Nar },
  data() {
    return {

    }
  },
  async mounted() {
    this.data1 = await this.fetchData('data1.json');
    this.data2 = await this.fetchData('data2.json');
    this.data3 = await this.fetchData('data3.json');
    this.data4 = await this.fetchData('data4.json');

    this.drawTimeChart(this.$refs.chart1, this.data1, 'News Count Over Time');
    this.drawChart(this.$refs.chart2, this.data2, 'Distribution of News Time Span');
    this.drawChart(this.$refs.chart3, this.data3, 'Average News Count Over Relative Time');
    this.drawCatoChart(this.$refs.chart4, this.data4, '事件类别');
  },
  methods: {
    async fetchData(file) {
  try {
    const response = await fetch(`/src/components/static/data/${file}`);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      return response.json();
    }
  } catch (e) {
    console.error('There was a problem with your fetch operation: ' + e.message);
  }
},

    drawTimeChart(ref, data, title) {
  var myChart = echarts.init(ref);
  var option = {
    title: {
      text: title
    },
    xAxis: {
      type: 'time', // 将 'category' 更改为 'time'
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: Object.entries(data).map(([key, value]) => [key, value]), // 将数据转换为 [date, value] 的格式
      type: 'line',
      showSymbol: false,
      hoverAnimation: false
    }]
  };
  myChart.setOption(option);
},
    drawCatoChart(ref, data, title) {
  // 将数据转换为数组并排序
  var sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

  // 取前14个类别
  var topData = sortedData.slice(0, 14);

  // 计算其他类别的总和
  var otherCount = sortedData.slice(14).reduce((sum, [, value]) => sum + value, 0);

  // 将其他类别添加到数据中
  topData.push(['其他', otherCount]);

  var myChart = echarts.init(ref);
  var option = {
    title: {
      text: title
    },
    xAxis: {
      type: 'category',
      data: topData.map(([key]) => key) // 使用处理后的数据
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        var total = topData.reduce((sum, [, value]) => sum + value, 0);
        console.log(params)
        var percent = ((params[0].value[1] / total) * 100).toFixed(2);
        return `${params[0].name}: ${params[0].value[1]} (${percent}%)`;
      }
    },
    series: [{
      data: topData, // 使用处理后的数据
      type: 'bar',
      showSymbol: false,
      hoverAnimation: false
    }]
  };
  myChart.setOption(option);
},

    drawChart(ref, data, title) {
  // 将键转换为数字，然后过滤掉x轴超过100的数据
  const filteredData = Object.entries(data)
    .map(([key, value]) => [Number(key), value])
    .filter(([key]) => key <= 100);

  var myChart = echarts.init(ref);
  var option = {
    title: {
      text: title
    },
    xAxis: {
      type: 'value', // 将 'category' 更改为 'value'
      data: filteredData.map(([key]) => key) // 使用过滤后的数据
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {

        return `${params[0].name}: ${params[0].value} `;
      }
    },
    series: [{
      data: filteredData, // 使用过滤后的数据
      type: 'line'
    }]
  };
  myChart.setOption(option);
}

  }
}
</script>

<style scoped>
.chartCards{
  margin: 80px;
  display: flex;
  flex-wrap: wrap;
}
.chartCard{
  padding: 30px;
  border: 2px solid #9214f4;
  margin: 30px;
  box-shadow: 6px 3px 3px #A9A9A9;
}
.lines{
    position: relative;
    text-align: center;
    overflow: hidden;
    font-size: 14px;
    color: #565555;
}
.lines::before,.lines::after{
    content: '';
    display: inline-block;
    width: 100%;
    height: 1px;
    position: absolute;
    background: #ccc;
    top: 50%;
}
.lines::before{
    margin-left: -10px;
    transform: translateX(-100%);
}
.title::after{
    margin-left: 10px;
}
:deep(.slick-slide)  {
  text-align: center;
  height: 500px;
  line-height: 160px;
  background: linear-gradient(to right,#3464e0, #9214f4);
  overflow: hidden;
}
:deep(.slick-slide h1) {
  color: #fff;
}
</style>
