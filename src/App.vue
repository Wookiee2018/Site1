<script setup>
import AnalyticsDataConnection from "./components/AnalyticsDataConnection.vue";
import CameraPersonCountDataConnection from "./components/CameraPersonCountDataConnection.vue";
import EmotionsGraph from "./components/EmotionsGraph.vue";
import GenderByAgeGraph from "./components/GenderByAgeGraph.vue";
import GenderGraph from "./components/GenderGraph.vue";
import LastPersonDetectedCard from "./components/LastPersonDetectedCard.vue";
import CameraPersonCount from "./components/CameraPersonCount.vue";
import { getQueryVariable } from "./getQueryVariable";

const graphToShow = Number(getQueryVariable("graph") || 0);
</script>

<template>
  <AnalyticsDataConnection v-if="graphToShow < 4" />
  <CameraPersonCountDataConnection v-else />

  <GenderGraph v-if="graphToShow === 0" />
  <GenderByAgeGraph v-else-if="graphToShow === 1" />
  <EmotionsGraph v-else-if="graphToShow === 2" />
  <LastPersonDetectedCard v-else-if="graphToShow === 3" />
  <CameraPersonCount v-else-if="graphToShow === 4" />
</template>
