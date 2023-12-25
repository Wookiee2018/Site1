<template>
  <div class="chart-container">
    <div class="chart">
      <vue3-chart-js v-bind="{ ...doughnutChart }" ref="chartRef" />
    </div>
    <div class="labels">
      <div>
        <h1>Male</h1>
      </div>

      <div>
        <h2>{{ malePercentage }}%</h2>
      </div>

      <div>
        <h1>Female</h1>
      </div>

      <div>
        <h2>{{ femalePercentage }}%</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { useAnalyticsStore } from "../stores/analytics";

export default {
  name: "GenderGraph",

  components: {
    Vue3ChartJs,
  },

  setup() {
    const chartRef = ref(null);
    const analyticsStore = useAnalyticsStore();

    const doughnutChart = {
      type: "doughnut",
      data: {
        labels: ["Male", "Female"],
        datasets: [
          {
            backgroundColor: ["#37a2eb", "#ff6384"],
            data: [0, 0],
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

    const updateChart = (male, female) => {
      doughnutChart.data.datasets = [
        {
          data: [male, female],
        },
      ];

      chartRef.value.update(0);
    };

    watch(analyticsStore, async ({ genderCount: { male, female } }) => {
      if (
        doughnutChart.data.datasets[0].data[0] === male &&
        doughnutChart.data.datasets[0].data[1] === female
      ) {
        return;
      }

      updateChart(male, female);
    });

    return {
      doughnutChart,
      chartRef,
      updateChart,
      analyticsStore,
    };
  },

  computed: {
    malePercentage() {
      const { genderCount } = this.analyticsStore;
      const male = genderCount.male || 0;
      const female = genderCount.female || 0;
      const total = male + female;

      if (total === 0) {
        return 0;
      }

      return Math.round((male / total) * 100);
    },

    femalePercentage() {
      const { genderCount } = this.analyticsStore;
      const male = genderCount.male || 0;
      const female = genderCount.female || 0;
      const total = male + female;

      if (total === 0) {
        return 0;
      }

      return Math.round((female / total) * 100);
    },
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  width: 100%;
}

.chart {
  width: 180px;
  margin-right: 33px;
}

.labels {
  line-height: 2.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1,
h2 {
  font-weight: 400;
  margin: 0;
}

h1 {
  font-size: 22px;
  line-height: 1.8em;
}

h2 {
  font-size: 40px;
}
</style>
