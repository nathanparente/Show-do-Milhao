<template>
  <div>
    <v-row
      v-for="(item, i) in choices"
      :key="i"
      class="mt-100 mx-auto mt-5"
      justify="space-between"
      align="space-between"
    >
      <v-avatar class="gradient" size="62">
        <span class="headline" style="font-weight: 900">
          {{ alternatives[i] }}
        </span>
      </v-avatar>
      <v-hover v-if="choice === i" v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          :color="color"
          outlined
          :elevation="hover ? 12 : 2"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title mb-1 text-wrap">
                {{ item.answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>
      <v-hover v-else v-slot="{ hover }">
        <v-card
          rounded-8
          width="calc(100% - 80px)"
          outlined
          class="choice-card"
          :elevation="hover ? 12 : 2"
          @click="$emit('select', i)"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title mb-1 text-wrap">
                {{ item.answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-hover>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ChoicesList",
  props: {
    choices: {
      type: Array,
      default: () => [],
    },
    choice: {
      type: Number,
      default: null,
    },
    color: {
      type: String,
      default: "#efefef",
    },
    alternatives: {
      type: Array,
      default: () => ["A", "B", "C", "D"],
    },
  },
};
</script>

<style scoped src="../style.css"></style>
