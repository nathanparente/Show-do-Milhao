<template>
  <v-app>
    <div class="home app-bg-color fill-height">
      <v-container class="py-6 config-container">
        <!-- Header -->
        <v-row align="center" class="mb-4">
          <v-btn icon color="white" large class="mr-4" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h2 class="white--text mb-0">Configurações do Jogo</h2>
        </v-row>

        <v-card class="pa-6 rounded-lg config-card" elevation="4">
          <v-form ref="form" v-model="valid">
            <!-- Configurações Gerais -->
            <h3 class="mb-4 config-section-title">Geral</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="config.TOTAL_QUESTIONS"
                  label="Total de Perguntas"
                  type="number"
                  min="1"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="config.PLAYOFFS_TIMER_SECONDS.TIMER_SECONDS"
                  label="Tempo do Timer (Segundos) - Playoffs"
                  type="number"
                  min="5"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <!-- Pontuação Playoffs -->
            <h3 class="mb-4 config-section-title">Pontuação (Playoffs)</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="config.PLAYOFFS_SCORING.NORMAL_WIN_POINTS"
                  label="Acerto Normal"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="
                    config.PLAYOFFS_SCORING.TRUCO_SIMPLE_WIN_POINTS
                  "
                  label="Acerto (Truco Simples)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="
                    config.PLAYOFFS_SCORING.TRUCO_DOUBLE_WIN_POINTS
                  "
                  label="Acerto (Truco Dobrado)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="
                    config.PLAYOFFS_SCORING.TRUCO_SIMPLE_ERROR_PENALTY
                  "
                  label="Penalidade Erro (Truco Simples)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="
                    config.PLAYOFFS_SCORING.TRUCO_DOUBLED_ERROR_PENALTY
                  "
                  label="Penalidade Erro (Truco Dobrado)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <!-- Pontuação Corrida do Milhão -->
            <h3 class="mb-4 config-section-title">
              Pontuação (Corrida do Milhão)
            </h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="config.MILLION_GAME_CONFIG.QUESTION_VALUE"
                  label="Valor base por Pergunta"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <!-- Ajudas Ativas -->
            <h3 class="mb-4 config-section-title">Ajudas Ativas por Modo</h3>

            <v-row>
              <!-- Coluna Playoffs -->
              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 bg-transparent">
                  <h4 class="mb-3" style="color: #012f6d">Modo Playoffs</h4>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.playoffs.cartas"
                    label="Cartas"
                    dense
                    hide-details
                    class="mt-0"
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.playoffs.ia"
                    label="IA"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.playoffs.universitarios"
                    label="Universitários"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.playoffs.truco"
                    label="Truco"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.playoffs.pulo"
                    label="Pulo (Requer refresh p/ ativar)"
                    dense
                    hide-details
                  ></v-switch>
                </v-card>
              </v-col>

              <!-- Coluna Corrida do Milhão -->
              <v-col cols="12" md="6">
                <v-card outlined class="pa-4 bg-transparent">
                  <h4 class="mb-3" style="color: #012f6d">
                    Modo Corrida do Milhão
                  </h4>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.million_game.cartas"
                    label="Cartas"
                    dense
                    hide-details
                    class="mt-0"
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.million_game.ia"
                    label="IA"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.million_game.universitarios"
                    label="Universitários"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.million_game.pulo"
                    label="Pulo"
                    dense
                    hide-details
                  ></v-switch>
                  <v-switch
                    v-model="config.ACTIVE_HELPS.million_game.truco"
                    label="Truco (Indisponível no clássico)"
                    disabled
                    dense
                    hide-details
                  ></v-switch>
                </v-card>
              </v-col>
            </v-row>

            <!-- Ações -->
            <v-row justify="end" class="mt-8 px-3">
              <v-btn
                text
                color="grey darken-1"
                class="mr-2"
                @click="restoreDefaults"
              >
                Restaurar Padrões
              </v-btn>
              <v-btn color="#012f6d" class="white--text" @click="save">
                Salvar Configurações
              </v-btn>
            </v-row>
          </v-form>
        </v-card>

        <!-- Snackbar de Sucesso -->
        <v-snackbar v-model="snackbar" :timeout="2000" color="success" top>
          Configurações salvas com sucesso!
        </v-snackbar>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { getConfig, saveConfig, clearConfig } from "@/utils/configManager";

export default {
  name: "GameConfig",
  data() {
    return {
      valid: true,
      snackbar: false,
      config: getConfig(),
    };
  },
  methods: {
    save() {
      saveConfig(this.config);
      this.snackbar = true;
      setTimeout(() => {
        this.$router.push("/");
      }, 1500);
    },
    restoreDefaults() {
      clearConfig();
      this.config = getConfig(); // Recarrega os valores zerados
    },
    goBack() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
