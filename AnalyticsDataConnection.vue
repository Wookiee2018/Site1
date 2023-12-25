<template></template>

<script>
import { mapActions } from "pinia";
import { useAnalyticsStore } from "../stores/analytics";

export default {
  name: "AnalyticsDataConnection",

  data() {
    return {
      apiUrl:
        "https://27smvksgd9.execute-api.us-east-1.amazonaws.com/MAIN/data",
      interval: null,
      intervalMs: 3 * 1000,
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
    ...mapActions(useAnalyticsStore, ["updateData"]),

    async pollnewData() {
      let request;
      try {
        request = await fetch(this.apiUrl);
      } catch (e) {
        console.error(e);
      }

      if (!request) {
        return;
      }

      const data = await request.json();
      this.updateData([...data]);
    },
  },
};
</script>
