import { defineStore } from "pinia";

export const useCameraPersonCount = defineStore("cameraPersonCount", {
  state: () => ({ count: 0 }),
  getters: {},
  actions: {
    updateData(count) {
      this.count = count;
    },
  },
});
