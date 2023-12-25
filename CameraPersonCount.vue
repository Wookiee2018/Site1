<template>
  <div class="person-count-container">
    <div class="busyness-indicator" :class="busynessClass"></div>
    <div class="person-count">{{ count }} {{ personText }}</div>
  </div>
</template>

<script>
import { watch } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { useCameraPersonCount } from "../stores/cameraPersonCount";

export default {
  name: "CameraPersonCount",

  components: {
    Vue3ChartJs,
  },

  setup() {
    const cameraPersonCountStore = useCameraPersonCount();

    return {
      cameraPersonCountStore,
    };
  },

  computed: {
    count() {
      return this.cameraPersonCountStore.count;
    },

    personText() {
      return this.count === 1 ? "person" : "people";
    },

    busynessClass() {
      if (this.count < 10) return "green";
      if (this.count >= 10 && this.count < 15) return "orange";
      if (this.count >= 15) return "red";
    },
  },
};
</script>

<style scoped>
.green {
  background-color: #74bf4b;
}

.orange {
  background-color: #fbab2c;
}

.red {
  background-color: #e3241b;
}

.person-count-container {
  display: flex;
  align-items: center;
  width: 136px;
  height: 39px;
  padding: 9px 11px;
  box-sizing: border-box;
}

.person-count {
  background-color: #0d274d;
  color: #fff;
  margin-left: 10px;
}

.busyness-indicator {
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
</style>
