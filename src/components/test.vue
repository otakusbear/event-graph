<template>
  <div>
    <div id="div1" :style="{ top: div1Top + 'px', left: div1Left + 'px' }">Div 1</div>
    <div id="container" style="overflow: auto; height: 100vh; width: 200px; position: absolute; right: 0;">
      <div id="div2" :style="{ top: div2Top + 'px', left: div2Left + 'px' }">Div 2</div>
    </div>
    <svg style="position:absolute; top:0; left:0">
      <line id="line" stroke="black" stroke-dasharray="5,5"
            :x1="div1Left" :y1="div1Top" :x2="div2Left + containerLeft" :y2="div2Top + containerTop"/>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      div1Top: 0,
      div1Left: 0,
      div2Top: 100,
      div2Left: 100,
      containerTop: 0,
      containerLeft: window.innerWidth - 200
    };
  },
  mounted() {
    window.addEventListener('resize', this.updateContainerPosition);
    this.updateContainerPosition();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateContainerPosition);
  },
  methods: {
    updateContainerPosition() {
      this.containerLeft = window.innerWidth - 200;
    }
  }
};
</script>

<style scoped>
#div1, #div2, svg {
  position: absolute;
}
#container {
  position: fixed;
}
#line {
  stroke-width: 2;
}
</style>
