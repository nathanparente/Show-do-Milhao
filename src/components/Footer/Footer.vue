<template>
  <!-- START FOOTER AREA-->
  <v-footer class="end" :color="color">
    <div class="text-color">
      &copy; Adapted from the original game by Lucas Finoti — 2020, All rights
      reserved
    </div>
  </v-footer>
  <!-- END FOOTER AREA -->
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      color: "#012f6d",
    };
  },
};
</script>

<style scoped src="./style.css"></style>
