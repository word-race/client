<template>
  <v-toolbar fixed :clipped-left="true" dark color="blue lighten-1" app>
     <v-toolbar-side-icon @click="drawerAction"></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Word Race <v-icon>merge_type</v-icon></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>info_outline</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    drawerAction () {
      this.$store.state.leftDrawer = true
    }
  }
}
</script>

<style>

</style>
