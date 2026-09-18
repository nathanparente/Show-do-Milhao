<template>
  <!-- START THE HELPER CARD AREA -->
  <section class="mt-20">
    <v-card
      class="mx-auto mt-10 mr-10 ml-10"
      max-width="100%"
      min-height="40vh"
      :elevation="2"
      outlined
    >
      <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
      <v-row justify="center" align="center">
        <p v-if="callHelp != ''" class="text center-item mt-100">
          A pessoa para qual você ligou acha que a resposta correta é:
          <span class="title">{{ callHelp }}</span>
        </p>
      </v-row>
    </v-card>
  </section>
  <!-- END THE HELPER CARD AREA -->
</template>

<script>
import { GChart } from "vue-google-charts";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        /**
         * Configurações do google chart
         */
        chart: {
          title: "Porcentagem de votos da platéia",
        },
        colors: ["#1b9e77"],
      },
    };
  },
  computed: {
    ...mapState({
      /**
       * Mapstate
       */
      chartData: (state) => state.chartData,
      callHelp: (state) => state.callHelp,
    }),
  },
  methods: {},
};
</script>

<style scoped>
.text {
  font-size: 18px;
  color: black;
  font-weight: 500;
}
.title {
  font-size: 24px;
  color: black;
  font-weight: 700;
}
</style>
