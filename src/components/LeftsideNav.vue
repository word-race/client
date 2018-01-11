<template>
  <v-navigation-drawer  
    fixed dark 
    class="blue lighten-3"
    light 
    v-model="leftDrawer" 
    :clipped="true"
    app
    >
    <v-list>
      <v-list-tile @click="gotoWelcomePage">
        <v-list-tile-action>
          <v-icon dark>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="gotoRacePage">
        <v-list-tile-action>
          <v-icon dark>merge_type</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title> START RACING >></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="gotoLeaderPage">
        <v-list-tile-action>
          <v-icon dark>stars</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Leader Board</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    gotoWelcomePage () {
      this.$router.push({name: 'WelcomePage'})
    },
    gotoRacePage () {
      this.$router.push({name: 'RacePage'})
    },
    gotoLeaderPage () {
      console.log('goto leader page')
      this.$router.push({name: 'LeaderPage'})
    }
  },
  computed: {
    leftDrawer: {
      get () {
        return this.$store.state.leftDrawer
      },
      set (value) {
        this.$store.state.leftDrawer = value
      }
    }
  }
}
</script>

<style>

</style>
