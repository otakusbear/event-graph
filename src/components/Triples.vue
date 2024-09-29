<template>
  <div id="top-content">
    <Nar></Nar>
    <div class="table">
      <a-table :row-selection="rowSelection" :columns="columns" :data-source="dataSource" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
        <template v-if="['subject', 'verb', 'object'].includes(column.dataIndex)">
            <div>
            <a-input
                v-if="editableData[record.key]"
                v-model:value="editableData[record.key][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
                {{ text }}
            </template>
            </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
                <a-typography-link @click="save(record.key)">Save</a-typography-link>
                <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                <a>Cancel</a>
                </a-popconfirm>
            </span>
            <span v-else>
                <a @click="edit(record.key)">Edit</a>
            </span>
            </div>
        </template>
        </template>
      </a-table>
      <div class="push">
        <a-button type="primary" html-type="submit" @click="onSubmit">提交</a-button>
      </div>
    </div> 
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es';
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import axios from 'axios';
import Nar from './Nar2.vue';

const columns = [{
title: 'Subject',
dataIndex: 'subject',
width: '25%',
}, {
title: 'Verb',
dataIndex: 'verb',
width: '25%',
}, {
title: 'Object',
dataIndex: 'object',
width: '25%',
}, {
title: 'operation',
dataIndex: 'operation',
}];

export default defineComponent({
  components: { Nar },
  setup() {
      const store = useStore();
      const events = computed(() => store.state.selectEvents);
      const triples = computed(() => store.state.eventTriples);
      console.log(triples);
      const data = triples.value.map((item, index) => ({
    key: (index + 1).toString(),
    subject: item[0],
    verb: item[1],
    object: item[2] === 'NON' ? 'None' : item[2],
  }));
  const dataToTriples = data => {
    return data.map(item => [
      item.subject,
      item.verb,
      item.object === 'None' ? 'NON' : item.object,
    ]);
  };

  console.log(data);
  const router = useRouter();
  const dataSource = ref(data);
  const editableData = reactive({});
  let selectData;
  const edit = key => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  };
  const save = key => {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };
  const cancel = key => {
    delete editableData[key];
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      selectData=selectedRows;
    }
  };
        //构造函数向后端发送请求
    const convertTriples = async input => {
      try {
        const response = await axios.post('/api/get_pairs', input);
        const eventPairs = response.data;
        return eventPairs;
      } catch (error) {
        console.error(error);
      }
    };
    const getRelation = async input => {
      try {
        const response = await axios.post('/api/get_relation', input);
        const relation = response.data;
        console.log(response.data)
        return relation;
      } catch (error) {
        console.error(error);
      }
    };
    const onSubmit = async selectedRows => {
        console.log('submit!', selectData);
        // Update the store with the selected and modified triples
    store.commit('setEventTriples', dataToTriples(selectData));
    // Convert triples to pairs
    const [event_pairs, double_event_pairs] = await convertTriples(events.value);
    store.commit('setEventPairs', event_pairs);
    store.commit('setDoubleEventPairs', double_event_pairs);

    // Get temporal and hierarchical relations between pairs
    const [time_relations, level_relations] = await getRelation(double_event_pairs);
    store.commit('setTimeRelations', time_relations);
    store.commit('setLevelRelations', level_relations);
      router.push({ path: '/schema'})
    };
    return {
        dataSource,
        columns,
        editingKey: '',
        editableData,
        edit,
        save,
        cancel,
        rowSelection,
        onSubmit
    };
  },
  
});
</script>
<style scoped>
.table{
  width: 700px;
  margin: 30px auto;
}
.editable-row-operations a {
margin-right: 8px;
}
.push{
  margin-top: 10px;
  text-align: center;
}
</style>