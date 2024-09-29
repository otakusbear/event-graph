<template>
  <div id="top-content">
    <Nar></Nar>
    <a-form
      class="form"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="事件类型"
        name="eventname"
        :rules="[{ required: true }]">
        <a-input v-model:value="formState.eventname" />
      </a-form-item>
  
      <a-form-item
        label="生成步数"
        name="steps"
      >
        <a-input-number v-model:value="formState.steps" :min="0" :max="10"/>
      </a-form-item>
  
      <a-form-item :wrapper-col="{ offset: 11, span: 16 }">
        <a-button type="primary" html-type="submit" >提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { useRouter } from 'vue-router'
  import { defineComponent, reactive } from 'vue';
  import { useStore } from 'vuex'
  import axios from 'axios';
  import Nar from './Nar2.vue';
  export default defineComponent({
    setup() {
      const router = useRouter();
      const store = useStore();
      const formState = reactive({
        eventname: '',
        steps: '',
      });
      const onFinish = values => {
        console.log('Success:', values);
        axios.post('/api/generate_event', {
        event: formState.eventname,
        num: formState.steps,
      })
      .then(function (response) {
        console.log(response.data);
        store.commit('setEvents', response.data);
        router.push({ path: '/steps'})
      })
      .catch(function (error) {
        console.log(error);
      });
      };
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };
      return {
        formState,
        onFinish,
        onFinishFailed,
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
.form{
  border: 1px solid gray;
  width: 700px;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding-top: 110px;
  margin: 110px auto;
}
</style>