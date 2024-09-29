<template>
  <div id="top-content">
    <Nar></Nar>
    <div class="step">
      <div class="title">选择并修改这些步骤</div>
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
      >
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-checkbox-group v-model="formState.checkedEvents">
          <div v-for="(event, index) in events" :key="event">
            <a-checkbox :value="index" name="type" @change="onCheckboxChange(index, $event)">
              <a-input v-model:value="formState.inputValues[index]" size="large" class="input" />
            </a-checkbox>
            <br />
          </div>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit" @click="onSubmit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  
</template>

<script>
import { useRouter } from 'vue-router'
import { defineComponent, reactive, toRaw, onMounted } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex'
import axios from 'axios';
import Nar from './Nar2.vue';

export default defineComponent({
  setup() {
    const store = useStore();
    const events = computed(() => store.state.events);
    const router = useRouter();
    const formState = reactive({
      checkedEvents: [], // 定义一个数组来存储选中的事件
      inputValues: events.value.slice(), // 定义一个响应式数组来存储用户输入的数据
    });
    const onCheckboxChange = (index, event) => {
      const checked = event.target.checked;
      if (checked) {
        formState.checkedEvents.push(index);
      } else {
        const eventIndex = formState.checkedEvents.indexOf(index);
        if (eventIndex !== -1) {
          formState.checkedEvents.splice(eventIndex, 1);
        }
      }
    };
    const updateEvent = (event_id, step, content) => {
      axios.put('/api/events/' + event_id, {
        event_id: event_id,
        step: step,
        event_type: '文娱',
        content: content
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    const getTriples = async inputValues => {
      try {
        const response = await axios.post('/api/get_triples', inputValues);
        const eventTriples = response.data;
        return eventTriples;
      } catch (error) {
        console.error(error);
      }
    };

    const onSubmit = async () => {
      console.log('submit!', toRaw(formState));
      console.log(formState.checkedEvents);
      for (let i = 0; i < formState.checkedEvents.length; i++) {
          const eventIndex = formState.checkedEvents[i];
          console.log(eventIndex);
          const eventContent = formState.inputValues[eventIndex];
          console.log(eventContent);
    //updateEvent(eventIndex + 1, eventIndex + 1, eventContent);
      }
      const checkedInputValues = formState.checkedEvents.map(index => formState.inputValues[index]);
      store.commit('setSelectEvents', checkedInputValues);
      const eventTriples = await getTriples(checkedInputValues);
      store.commit('setEventTriples', eventTriples);
      router.push({ path: '/triples'})
    };
    onMounted(() => {
      console.log(formState.inputValues); // 在控制台中打印inputValues数组的值
    });
    return {
      formState,
      onSubmit,
      events,
      onCheckboxChange,
    };
  },
  components: { Nar }
});
</script>

<style>
#top-content{
  height: 100vh;
  background-image: url('./static/picture/bg.png');
  background-repeat: repeat;
  background-size:cover;
}
.step{
  line-height: 100px;
  text-align: center;
  font-family: 'Palanquin Dark', sans-serif;
  font-weight: 500;
  font-size: 30px;
  color: 	rgb(45, 45, 45);
}
.title{
  text-align: center;

}
.input {
  width: 500px;
}
</style>
