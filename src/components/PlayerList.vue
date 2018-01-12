<template>
<div>
  <v-list-tile>
    <v-layout justify-center align-center>
      <v-flex md2 sm3 xs3>
        <b>{{player.name}}</b> <br>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md2 sm3 xs3>
        <span>{{player.poin}} Poin</span>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex md2 sm3 xs3>
        <span color="text--green" v-if="player.isPlayerReady" >
          <v-icon color="green">check</v-icon> Ready 
        </span>
        <span color="text--green" v-if="!player.isPlayerReady" >
          <v-icon color="red">clear</v-icon> Not Ready 
          </span>
      </v-flex>
    </v-layout>
    
  </v-list-tile>
  <v-divider></v-divider>
</div>
  
</template>

<script>
export default {
  props: ['player'],
  computed: {
    timeJoined () {
      let date = new Date(this.player.joinedAt)
      return date.toTimeString()
    }
  }
}
</script>

<style>

</style>
