<template>
  <div class="chart">
    <vue3-chart-js v-bind="{ ...doughnutChart }" ref="chartRef" />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { emotions, useAnalyticsStore } from "../stores/analytics";

export default {
  name: "EmotionsGraph",

  components: {
    Vue3ChartJs,
  },

  setup() {
    const chartRef = ref(null);
    const analyticsStore = useAnalyticsStore();

    const doughnutChart = {
      type: "doughnut",
      data: {
        labels: emotions,
        datasets: [
          {
            backgroundColor: [
              "#0051AF",
              "#1E4471",
              "#FBAB2C",
              "#74BF4B",
              "#00BCEB",
              "#E2E2E2",
            ],
            data: [0, 0, 0, 0, 0, 0],
          },
        ],
      },
      options: {
        borderWidth: 3,
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    const updateChart = (emotions) => {
      doughnutChart.data.datasets[0].data = Object.values(emotions);

      chartRef.value.update(0);
    };

    let oldMale = 0;
    let oldFemale = 0;

    watch(
      analyticsStore,
      async ({ emotions, genderCount: { male, female } }) => {
        if (oldMale === male && oldFemale === female) {
          return;
        }

        updateChart(emotions);
      }
    );

    return {
      doughnutChart,
      chartRef,
      updateChart,
      analyticsStore,
      oldMale,
      oldFemale,
    };
  },
};
</script>

<style scoped>
.chart {
  width: 180px;
}
</style>
