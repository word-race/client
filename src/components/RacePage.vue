<template>
  <v-container>

    <h1>Race Page</h1>
    <v-layout>
      <v-flex>Indicator </v-flex>
      <v-flex> <h1 class="display-3">{{currentWord.word}}</h1></v-flex>
      <v-flex>
        <v-btn round color="blue" @click="timer()" style="color: white">Count Down</v-btn>

          <div v-if="show">
            <h3>Game Start in . . . {{ waktu }}</h3>
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
    <div v-if="showGame">
      <h2>{{ selesai }}</h2>
      <h1 style="font-size: 90px">{{ waktuStart }}</h1>
      <h1>{{ waktuSelesai }}</h1>
    </div>
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
      this.show = true
      const Timer = require('tiny-timer')
      let timer = new Timer()

      timer.on('tick', (ms) => {
        this.waktu = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
      })

      timer.on('tick', () => {
        console.log('tick')
        this.selesai = 'Game Start !'
        this.startGame()
      })
    },
    startGame () {
      console.log('GAME STARRTTTTT')
      this.showGame = true
      const Timer = require('tiny-timer')
      let timerStart = new Timer()

      timerStart.on('tick', (ms) => {
        this.waktuStart = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
      })

      timerStart.on('done', () => {
        console.log('done!')
        this.waktuSelesai = "Time's Up ! Game Over !"
        this.timeout()
      })
    },

    timeout () {
      router.push({name: 'ResultPage'})
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
      this.showGame   = true;
      this.show = false;
      const Timer     = require('tiny-timer');
      let timerStart  = new Timer();
      let timeStart   = timerStart.start(60000);

      timerStart.on('tick', (ms) => {
        this.waktuStart = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
        if(this.waktuStart == 50) {
          this.waktuSelesai = "C'mon ! Try Harder !"
        } else if(this.waktuStart == 40) {
          this.waktuSelesai = 'You Can Do It !'
        } else if(this.waktuStart == 30) {
          this.waktuSelesai = "If you never say no, you'll never say yes"
        } else if(this.waktuStart == 20) {
          this.waktuSelesai = 'Ganbatte !'
        } else if(this.waktuStart == 10) {
          this.waktuSelesai = "Ten Seconds Left Man, C'mon !"
        } else if(this.waktuStart == 3) {
          this.waktuSelesai = "Three !"
        } else if(this.waktuStart == 2) {
          this.waktuSelesai = "Two !"
        } else if(this.waktuStart == 1) {
          this.waktuSelesai = "One !"
        }
      })
        timerStart.on('done', () => {
          this.waktuSelesai = "Time's Up ! Game Over !"
          this.timeout();
        })
    },

    timeout(){
      router.push({name : "ResultPage"})
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
