<template>
  <v-container>

    <h1>Race Page</h1>
    <v-layout>
      <v-flex>Indicator </v-flex>
      <v-flex> <h1 class="display-3">{{currentWord.word}}</h1></v-flex>
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
      <v-flex>Your poin</v-flex>
    </v-layout>
    <v-layout align-center wrap>
      <v-flex sm2 pr-2>
        <v-text-field label="Your Name" v-model="playerName" :disabled="isPlayerJoin"></v-text-field>
      </v-flex >
      <v-flex sm6 pl-2><v-text-field label="Answer" v-model="playerAnswer" :disabled="!isPlayerReady" @keyup="checkAnswer"></v-text-field></v-flex>
      <v-flex>
        <v-btn round color="green" @click="playerReady" :dark="!isPlayerReady" v-if="!isPlayerReady && isPlayerJoin">Ready</v-btn>
        <v-btn round flat color="red" :dark="isPlayerReady" @click="playerUnReady" v-if="isPlayerReady && isPlayerJoin">UnReady</v-btn>
        <v-btn round color="green" @click="playerJoin" :dark="!isPlayerJoin" v-if="!isPlayerJoin">Join</v-btn>
        <v-btn round flat color="red" :dark="isPlayerJoin" @click="playerUnJoin" v-if="isPlayerJoin">Left</v-btn>
      </v-flex>
    </v-layout>
    <v-layout justify-center pb-5 v-if="failMessage">
      <span class="red--text title">{{failMessage}}</span>
    </v-layout>
    <v-layout fluid>
      <v-flex>
        <v-list >
          <player-list v-for="(player,i) in alldata" :key="i" :player="player"></player-list>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import router from '../router'
import PlayerList from './PlayerList'
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
      isPlayerJoin: localStorage.hasOwnProperty('playerName'),
      isPlayerReady: localStorage.hasOwnProperty('playerReady'),
      playerName: localStorage.playerName,
      playerAnswer: '',
      failMessage: null,
      playerJoinedAt: null,
      isGameStarted: false
    }
  },
  components: {
    PlayerList
  },
  firebase () {
    return {
      alldata: {
        source: this.$fbasedb.ref('wordrace'),
        anArray: true
      },
      currentWord: {
        source: this.$fbasedb.ref('randomword'),
        asObject: true
      }
    }
  },
  methods: {
    timer () {
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
    startGame () {
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
      if ((this.playerName === undefined) || (this.playerName.trim() === '')) {
        this.failMessage = 'Enter name to join..'
        this.playerName = ''
      } else {
        console.log('player Join', this.playerName, this.playerAnswer)
        this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
          name: this.playerName,
          answer: null,
          isPlayerReady: false,
          joinedAt: (new Date()).toISOString(),
          poin: 0
        })

        localStorage.setItem('playerName', this.playerName)
        this.isPlayerJoin = true
        this.playerJoinedAt = (new Date()).toISOString()
      }
    },
    playerUnJoin () {
      console.log('player unjoin', this.playerName, this.playerAnswer)
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).remove()
      this.isPlayerJoin = false
      this.isPlayerReady = false
      localStorage.removeItem('playerName')
    },
    playerReady () {
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
        name: this.playerName,
        answer: null,
        poin: 0,
        joinedAt: this.playerJoinedAt,
        isPlayerReady: true
      })
      localStorage.setItem('playerReady', true)
      this.isPlayerReady = true
      this.getNewText()
    },
    playerUnReady () {
      this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
        name: this.playerName,
        answer: null,
        poin: 0,
        joinedAt: this.playerJoinedAt,
        isPlayerReady: false
      })
      this.isPlayerReady = false
      localStorage.removeItem('playerReady')
    },
    checkAnswer () {
      if (this.currentWord.word === this.playerAnswer) {
        console.log('answer matched')
        this.$fbasedb.ref(`wordrace/players-${this.playerName}`).once('value')
        .then((snapshot) => {
          let newPoin = snapshot.val().poin + 1
          this.$fbasedb.ref('wordrace').child(`players-${this.playerName}`).set({
            name: this.playerName,
            answer: null,
            poin: newPoin,
            isPlayerReady: true
          })
          this.playerAnswer = ''
          this.getNewText()
        })
      }
    },
    startGame () {
      console.log('game started')
    },
    getNewText () {
      console.log('get new text')
      let inithis = this
      axios.get('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
      .then(function (result) {
        console.log('>>>>>>>>>', result)
        inithis.$fbasedb.ref('randomword').set({
          word: result.data[0].word.toLowerCase()
        })
      })
    }
  },
  computed: {
    isAllReady () {
      if (this.alldata) {
        let somePlayerNotReady = this.alldata.some(element => {
          return element.isPlayerReady === false
        })
        return !somePlayerNotReady
      } else {
        return false
      }
    }
  },
  created () {
    this.$fbasedb.ref('wordrace').on('value', (snapshot) => {
      console.log('HIHIHI ', snapshot.val())
      console.log(this.isAllReady)
    })
  }
}
</script>

<style>
  .right{
    float: right;
  }
</style>
