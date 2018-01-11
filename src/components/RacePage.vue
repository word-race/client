<template>
  <v-container>

    <h1>Race Page</h1>
    <v-layout>
      <v-flex>Indicator</v-flex>
      <v-flex>{{text}}</v-flex>
      <v-flex>
        <h2><button type="button" name="button" @click="timer()">START</button></h2>
          <div v-if="show">
            <h2>Game Start in . . . {{ waktu }}</h2>
          </div>
          <div class="right" v-if="showGame">
            <h2 v-if="waktu == 0">{{ selesai }}</h2>
            <h1>{{ waktuStart }}</h1>
            <h1>{{waktuSelesai}}</h1>
          </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>Your Point</v-flex>
    </v-layout>
    <v-layout align-center wrap>
      <v-flex sm2 pr-2>
        <v-text-field label="Your Name" v-model="playerName" :disabled="isPlayerJoin"></v-text-field>
      </v-flex >
      <v-flex sm6 pl-2><v-text-field label="Answer" v-model="playerAnswer" :disabled="!isPlayerJoin"></v-text-field></v-flex>
      <v-flex>
        <v-btn round color="green" @click="playerReady" :dark="!isPlayerReady" v-if="!isPlayerReady && isPlayerJoin">Ready</v-btn>
        <v-btn round flat color="red" :dark="isPlayerReady" @click="playerUnReady" v-if="isPlayerReady && isPlayerJoin">UnReady</v-btn>
        <v-btn round color="green" @click="playerJoin" :dark="!isPlayerJoin" v-if="!isPlayerJoin">Join</v-btn>
        <v-btn round flat color="red" :dark="isPlayerJoin" @click="playerUnJoin" v-if="isPlayerJoin">Left</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      Other player board component {{alldata}}
    </v-layout>
  </v-container>

 
</template>

<script>

import axios from 'axios'
import router from '../router'
export default {
  data () {
    return {
      text: '',
      waktu: '',
      show: false,
      selesai: '',
      showGame: false,
      waktuStart: '',
      waktuSelesai: '',
      isPlayerJoin: false,
      isPlayerReady: false,
      playerName: '',
      playerAnswer: ''
    }
  },
  firebase () {
    return {
      alldata: {
        source: this.$fbasedb.ref('wordrace'),
        anArray: true
      }
    }
  },
  methods: {
    timer() {
      this.show   = true;
      const Timer = require('tiny-timer');
      let timer   = new Timer();
      let time    = timer.start(11000);

      timer.on('tick', (ms) => {
        this.waktu = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
      })

        timer.on('tick', () => {
          console.log('tick')
          this.selesai = "Game Start !"
          this.startGame();
        })
    },
    startGame() {
      console.log('GAME STARRTTTTT');
      this.showGame   = true;
      const Timer     = require('tiny-timer');
      let timerStart  = new Timer();
      let timeStart   = timerStart.start(60000);

      timerStart.on('tick', (ms) => {
        this.waktuStart = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
      })

        timerStart.on('done', () => {
          console.log('done!')
          this.waktuSelesai = "Time's Up ! Game Over !"
          this.timeout();
        })
    },

    timeout(){
      router.push({name : "ResultPage"})
    },
    playerJoin () {
      console.log('player Join', this.playerName, this.playerAnswer)
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
        name: this.playerName,
        answer: null,
        isPlayerReady: false,
        point: 0
      })
      this.isPlayerJoin = true
    },
    playerUnJoin () {
      console.log('player unjoin', this.playerName, this.playerAnswer)
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).remove()
      this.isPlayerJoin = false
      this.isPlayerReady = false
    },
    playerReady () {
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
        name: this.playerName,
        answer: null,
        point: 0,
        isPlayerReady: true
      })
      this.isPlayerReady = true
    },
    playerUnReady () {
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
        name: this.playerName,
        answer: null,
        point: 0,
        isPlayerReady: false
      })
      this.isPlayerReady = false
    }
  },
  created () {
    let dataWord = this
    axios.get('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
    .then(function (result) {
      dataWord.text = result.data[0].word
    })
  }
}
</script>

<style>
  .right{
    float: right;
  }
</style>
