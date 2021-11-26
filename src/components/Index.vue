<template>
  <v-container fluid>
    <Home />
  </v-container>
</template>

<script>
import Home from "./home/Home";

export default {
  name: "Index",

  data: () => ({}),
  components: {
    Home,
  },
};
</script>
