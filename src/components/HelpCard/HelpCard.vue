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
import { mapState } from "vuex";

export default {
  name: "HelpCard",
  components: {
    GChart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          title: "Porcentagem de votos da platéia",
        },
        colors: ["#1b9e77"],
      },
    };
  },
  computed: {
    ...mapState({
      chartData: (state) => state.chartData,
      callHelp: (state) => state.callHelp,
    }),
  },
};
</script>

<style scoped src="./style.css"></style>
