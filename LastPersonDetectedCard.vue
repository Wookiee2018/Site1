<template>
  <div class="card-container">
    <div class="title">Last person Detected</div>
    <div class="information">
      <div class="row">
        <div class="label">Name:</div>
        <div class="value">{{ name }}</div>
      </div>
      <div class="row">
        <div class="label">Gender:</div>
        <div class="value">{{ gender }}</div>
      </div>
      <div class="row">
        <div class="label">Age:</div>
        <div class="value">{{ age }}</div>
      </div>
      <div class="row">
        <div class="label">Emotion:</div>
        <div class="value emotion">{{ emotion }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { useAnalyticsStore } from "../stores/analytics";

export default {
  name: "LastPersonDetectedCard",

  components: {
    Vue3ChartJs,
  },

  setup() {
    const analyticsStore = useAnalyticsStore();

    return {
      analyticsStore,
    };
  },

  computed: {
    lastPerson() {
      const { data } = this.analyticsStore;

      return data
        .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp))
        .pop();
    },

    gender() {
      const { lastPerson } = this;

      if (!lastPerson) {
        return "";
      }

      return lastPerson.Gender;
    },

    age() {
      const { lastPerson } = this;

      if (!lastPerson) {
        return "";
      }

      return `${lastPerson.AgeLow}-${lastPerson.AgeHigh} years`;
    },

    emotion() {
      const { lastPerson } = this;

      if (!lastPerson) {
        return "";
      }

      return lastPerson.Emotions.pop().toLowerCase();
    },

    name() {
      const { lastPerson } = this;

      if (!lastPerson) {
        return "Cisco Guest";
      }

      return lastPerson.Name;
    },
  },
};
</script>

<style scoped>
.card-container {
  width: 460px;
  padding: 46px 54px 0 54px;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 31px;
  font-weight: bold;
  margin-bottom: 1em;
  line-height: 1em;
}

.information {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: 28px;
  line-height: 1.3em;
}

.emotion {
  text-transform: capitalize;
}
</style>
