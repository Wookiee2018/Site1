import { defineStore } from "pinia";
import { analyticsCache } from "./data/analyticsCache";

const ageMap = () => ({
  "0-15": 0,
  "16-30": 0,
  "31-45": 0,
  "46-60": 0,
  "61+": 0,
});
export const emotions = [
  "calm",
  "sad",
  "angry",
  "fear",
  "surprised",
  "confused",
  // "disgusted",
];

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({ data: [...analyticsCache] }),
  getters: {
    genderCount: (state) =>
      state.data.reduce(
        (out, datum) => {
          const gender = (datum.Gender || "").toLowerCase();
          out[gender] += 1;

          return out;
        },
        { male: 0, female: 0 }
      ),

    genderByAge: (state) =>
      state.data.reduce(
        (out, datum) => {
          const age = (datum.AgeHigh + datum.AgeLow) / 2;
          const gender = (datum.Gender || "").toLowerCase();

          if (age < 16) {
            out[gender]["0-15"] += 1;
          } else if (age >= 16 && age <= 30) {
            out[gender]["16-30"] += 1;
          } else if (age >= 31 && age <= 45) {
            out[gender]["31-45"] += 1;
          } else if (age >= 46 && age <= 60) {
            out[gender]["46-60"] += 1;
          } else if (age >= 61) {
            out[gender]["61+"] += 1;
          }

          return out;
        },
        {
          male: ageMap(),
          female: ageMap(),
        }
      ),

    genderByAgePercentage(state) {
      const noDataForMale = {};

      return {
        male: Object.keys(this.genderByAge.male).reduce((out, key) => {
          out[key] =
            this.genderByAge.male[key] /
            (this.genderByAge.male[key] + this.genderByAge.female[key]);

          if (isNaN(out[key])) {
            const rand = Math.random();
            noDataForMale[key] = rand < 0.1 ? 0.1 : rand;
            out[key] = noDataForMale[key];
          }

          return out;
        }, ageMap()),

        female: Object.keys(this.genderByAge.female).reduce((out, key) => {
          out[key] =
            this.genderByAge.female[key] /
            (this.genderByAge.male[key] + this.genderByAge.female[key]);

          if (isNaN(out[key])) {
            out[key] = 0;
          }

          if (noDataForMale[key]) {
            out[key] = 1 - noDataForMale[key];
          }

          return out;
        }, ageMap()),
      };
    },

    emotions: (state) =>
      state.data.reduce(
        (out, datum) => {
          const datumEmotions = datum.Emotions.map((o) => o.toLowerCase());

          for (let i = 0; i < datumEmotions.length; i += 1) {
            if (emotions.indexOf(datumEmotions[i]) < 0) {
              continue;
            }

            out[datumEmotions[i]] += 1;
          }

          return out;
        },
        emotions.reduce((out, key) => {
          out[key] = 0;
          return out;
        }, {})
      ),
  },
  actions: {
    updateData(data) {
      this.data = [...data];
    },
  },
});
