<template lang="pug">
    canvas.live2d(:id="canvasID" :width="width" :height="height")
</template>

<script>
import uuid from "uuid";
import L2dManage from "./../lib/main";

export default {
  name: "live2d",
  data: () => ({
    L2dManage: ""
  }),
  props: {
    width: {
      type: Number,
      default: 290 * 2
    },
    height: {
      type: Number,
      default: 240 * 2
    },
    canvasID: {
      type: String,
      default: uuid()
    },
    modelPath: String
  },
  mounted() {
    this.L2dManage = new L2dManage(
      document.getElementById(this.canvasID),
      this.modelPath
    );
  },
  methods: {
    initL2dMange(modelPath) {
      this.L2dManage.revise(modelPath);
    }
  }
};
</script>

<style lang="stylus" scoped>
.live2d {
  position: relative;
  z-index: 99;
  left: 50px;
}
</style>


