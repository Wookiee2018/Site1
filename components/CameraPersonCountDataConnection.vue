<template>{{}}</template>

<script>
import { mapActions } from "pinia";
import { useCameraPersonCount } from "../stores/cameraPersonCount";
import { getQueryVariable } from "../getQueryVariable";

export default {
  name: "CameraPersonCountDataConnection",

  data() {
    return {
      apiUrl: "http://localhost:3000?camera=",
      interval: null,
      intervalMs: 1 * 1000,
    };
  },

  beforeMount() {
    this.interval = setInterval(this.pollnewData, this.intervalMs);
    this.pollnewData();
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },

  methods: {
    ...mapActions(useCameraPersonCount, ["updateData"]),

    async pollnewData() {
      let request;

      const camera = getQueryVariable("camera");

      try {
        request = await fetch(`${this.apiUrl}${camera}`);
      } catch (e) {
        console.error(e);
      }

      if (!request) {
        return;
      }

      const data = await request.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      this.updateData(data.zones[0].person);
    },
  },
};
</script>
