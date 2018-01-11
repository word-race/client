<template>
  <v-container>
    <h1>Race Page</h1>
    <v-layout>
      <v-flex>Indicator</v-flex>
      <v-flex>{{text}}</v-flex>
      <v-flex>Time left</v-flex>
    </v-layout>
    <v-layout>
      <v-flex>Your Point</v-flex>
    </v-layout>
    <v-layout>
      <v-flex>Player Name</v-flex>
      <v-flex>Player type board</v-flex>
      <v-flex>Ready Button</v-flex>
    </v-layout>
    <v-layout>
      Other player board component
    </v-layout>
  </v-container>


</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      text : ''
    }
  },
  methods: {

  },
  created() {
    let dataWord = this
    axios.get('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
      .then(function(result) {
        dataWord.text = result.data[0].word;
      })
  }
}
</script>

<style>

</style>
