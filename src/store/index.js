import Vuex from 'vuex'

export default new Vuex.Store({
  state: { 
    searchData:[],
    event:{},
    events: [],
    selectEvents: [],
    eventTriples: [],
    eventPairs: [],
    doubleEventPairs: [],
    timeRelations: [],
    levelRelations: [],
    inputValue:'',
    title:''
  },
  mutations: {
    getTitle(state,n){
      state.title=n
    },
    getInput(state,n){
      state.inputValue=n
    },
    getSear(state,n){
        state.searchData=n;
    },
    getEvent(state,n){
      state.event=n
    },
    setEvents(state, events) {
      state.events = events
    },
    setSelectEvents(state, events) {
      state.selectEvents = events
    },
    setEventTriples(state, eventTriples) {
      state.eventTriples = eventTriples;
    },
    setEventPairs(state, eventPairs) {
      state.eventPairs = eventPairs;
    },
    setDoubleEventPairs(state, doubleEventPairs) {
      state.doubleEventPairs = doubleEventPairs;
    },
    setTimeRelations(state, timeRelations) {
      state.timeRelations = timeRelations;
    },
    setLevelRelations(state, levelRelations) {
      state.levelRelations = levelRelations;
    }
  },
  actions: {
  },
  getters:{
  }
})