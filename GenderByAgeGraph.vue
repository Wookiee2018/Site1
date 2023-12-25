<template>
  <vue3-chart-js v-bind="{ ...stackedBarChart }" ref="chartRef" />
</template>

<script>
import { ref, watch } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { Chart as ChartJS } from "chart.js";
import { useAnalyticsStore } from "../stores/analytics";

ChartJS.defaults.font.family = "CiscoSansTT, sans-serif";

export default {
  name: "GenderByAgeGraph",

  components: {
    Vue3ChartJs,
  },

  setup() {
    const chartRef = ref(null);
    const analyticsStore = useAnalyticsStore();

    const drawCountInBox = (chart, append = "") => {
      const { ctx } = chart;
      ctx.save();
      ctx.textAlign = "center";

      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar, index) => {
          const data = dataset.data[index];

          const text = `${data}${append}`;

          let metrics = ctx.measureText(text);
          let fontHeight =
            metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

          if (bar.height < fontHeight) {
            return;
          }

          ctx.fillText(text, bar.x, bar.y + bar.height / 2);
        });
      });

      ctx.restore();
    };

    const stackedBarChart = {
      type: "bar",
      data: {
        labels: ["< 16", "16 - 30", "31 - 45", "46 - 60", "61+"],
        datasets: [
          {
            label: "Male",
            backgroundColor: "#0051AF",
            data: [0],
            borderSkipped: false,
            borderWidth: {
              top: 0,
              left: 3,
              right: 3,
              bottom: 3,
            },
          },
          {
            label: "Female",
            backgroundColor: "#00BCEB",
            data: [0],
          },
        ],
      },
      options: {
        responsive: true,
        borderWidth: 3,
        borderColor: "#fff",
        barPercentage: 0.9,
        animation: {
          duration: 0,
          // onProgress({ chart }) {
          //   drawCountInBox(chart, "%");
          // },
          // onComplete({ chart }) {
          //   drawCountInBox(chart, "%");
          // },
        },

        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#fff",
              display: false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
      },
    };

    const updateChart = (genderByAgePercentage) => {
      stackedBarChart.data.datasets[0].data = Object.values(
        genderByAgePercentage["male"]
      ).map((value) => Math.floor(value * 100));

      stackedBarChart.data.datasets[1].data = Object.values(
        genderByAgePercentage["female"]
      ).map((value) => Math.floor(value * 100));

      chartRef.value.update(0);
    };

    let oldMale = 0;
    let oldFemale = 0;

    watch(
      analyticsStore,
      async ({ genderByAgePercentage, genderCount: { male, female } }) => {
        if (oldMale === male && oldFemale === female) {
          return;
        }

        oldMale = male;
        oldFemale = female;

        updateChart(genderByAgePercentage);
      }
    );

    return {
      stackedBarChart,
      chartRef,
      updateChart,
      analyticsStore,
      oldMale,
      oldFemale,
    };
  },
};
</script>
