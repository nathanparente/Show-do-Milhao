<template>
  <v-container fluid class="fill-height app-bg-color pa-0">
    <!-- FIRST SECTION: Centralizada perfeitamente no meio da tela -->
    <v-row justify="center" align="center" class="fill-height my-auto">
      <v-col cols="12" xs="12" md="7" class="text-center">
        <v-img max-height="50vh" contain src="@/assets/images/bg/1.png"></v-img>

        <a class="mt-4 d-inline-block" @click="startGame">
          <div id="container_hover">
            <img id="image" height="80px" src="@/assets/images/bg/2.png" />
          </div>
        </a>

        <div class="mt-4">
          <v-btn
            large
            elevation="4"
            color="white"
            class="btn-instructions"
            @click="goToInstructions"
          >
            <v-icon left color="#012f6d">mdi-help-circle-outline</v-icon>
            {{ uiTexts.HOME_INSTRUCTIONS_BUTTON }}
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" xs="12" md="4" class="text-center hidden-md-and-down">
        <v-img max-height="45vh" contain src="@/assets/images/bg/3.png"></v-img>
      </v-col>
    </v-row>

    <!-- ABOUT AREA -->
    <section
      v-if="aboutMe && aboutMe.length"
      id="about-me"
      class="about-me section_horizontal_padding_40 text-start w-100"
    >
      <v-row
        v-for="(item, i) in aboutMe"
        :key="i"
        justify="center"
        align="center"
      >
        <v-col cols="12" xs="12" md="4">
          <div class="padding_20">
            <v-row>
              <p>{{ item.title }}</p>
            </v-row>
            <v-row class="section_padding_0_50">
              <h2>{{ item.subtitle }}</h2>
            </v-row>
            <p v-for="(itens, n) in item.text" :key="n" class="text-formater">
              {{ itens }}
            </p>
          </div>
        </v-col>
        <v-col
          cols="12"
          xs="12"
          md="4"
          justify="center"
          align="center"
          class="padding_top_50 center"
        >
          <v-img contain :src="item.src" height="128px" width="128px" />
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import { UI_TEXTS } from "@/constants";

export default {
  name: "Home",
  data() {
    return {
      aboutMe: [],
      uiTexts: UI_TEXTS,
    };
  },
  methods: {
    startGame() {
      this.$router.push("/gamemode");
    },
    goToInstructions() {
      this.$router.push("/instructions");
    },
  },
};
</script>

<style scoped src="./style.css"></style>
