<template>
  <v-app>
    <leftside-nav ></leftside-nav>
    <top-nav></top-nav>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import LeftsideNav from './LeftsideNav'
import TopNav from './TopNav'
export default {
  components: {
    LeftsideNav, TopNav
  },
  methods: {
    drawerAction () {
      this.$store.state.leftDrawer = true
    }
  }
}
</script>

<style>

</style>
