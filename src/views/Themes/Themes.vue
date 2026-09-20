<template>
  <v-container fluid class="fill-height app-bg-color pa-0">
    <v-row justify="center" align="center" class="themes-container my-auto">
      <!-- TÍTULO DA TELA -->
      <v-col cols="12" class="text-center mb-6 white--text">
        <h1 class="text-h4 font-weight-bold">Escolha os Temas do Jogo</h1>
        <p class="subtitle-1 mt-2">
          Selecione os temas desejados para a IA gerar as perguntas
        </p>
      </v-col>

      <!-- WRAPPER DOS CARDS -->
      <v-col cols="12" md="10" lg="8">
        <v-row justify="center" align="center">
          <v-col
            v-for="theme in availableThemes"
            :key="theme.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card
              :class="['theme-card', { selected: isSelected(theme) }]"
              elevation="3"
              @click="toggleTheme(theme)"
            >
              <v-card-text class="pa-0">
                <span class="theme-text">{{ theme.title }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- BOTÃO GERAR PERGUNTAS -->
      <v-col cols="12" class="text-center mt-8">
        <v-btn
          large
          elevation="4"
          color="white"
          class="btn-generate"
          :disabled="selectedThemes.length === 0"
          @click="generateQuestions"
        >
          Gerar perguntas
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Themes",
  data() {
    return {
      availableThemes: [
        {
          id: "web",
          title: "WebDev",
          value: "Desenvolvimento Web",
        },
        { id: "uiux", title: "UI/UX", value: "UI/UX" },
        { id: "cro", title: "CRO", value: "CRO" },
        { id: "geral", title: "Geral", value: "Geral" },
      ],
      selectedThemes: [],
    };
  },
  methods: {
    isSelected(theme) {
      if (theme.id === "geral") {
        return (
          this.selectedThemes.includes("Geral") || this.allIndividualSelected()
        );
      }
      return this.selectedThemes.includes(theme.value);
    },

    allIndividualSelected() {
      const individual = ["Desenvolvimento Web", "UI/UX", "CRO"];
      return individual.every((t) => this.selectedThemes.includes(t));
    },

    toggleTheme(theme) {
      if (theme.id === "geral") {
        if (this.isSelected(theme)) {
          this.selectedThemes = [];
        } else {
          this.selectedThemes = [
            "Desenvolvimento Web",
            "UI/UX",
            "CRO",
            "Geral",
          ];
        }
      } else {
        this.selectedThemes = this.selectedThemes.filter((t) => t !== "Geral");

        const index = this.selectedThemes.indexOf(theme.value);
        if (index > -1) {
          this.selectedThemes.splice(index, 1);
        } else {
          this.selectedThemes.push(theme.value);
        }

        if (this.allIndividualSelected()) {
          this.selectedThemes.push("Geral");
        }
      }
    },

    generateQuestions() {
      if (this.selectedThemes.length === 0) return;

      let themesToPass = this.selectedThemes.filter((t) => t !== "Geral");

      if (themesToPass.length === 0) {
        themesToPass = ["Desenvolvimento Web", "UI/UX", "CRO"];
      }

      this.$router.push({
        path: "/questions/1",
        query: { themes: themesToPass.join(",") },
      });
    },
  },
};
</script>

<style scoped src="./style.css"></style>
