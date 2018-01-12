<template>
  <v-container>
    <v-layout align-center>
      <v-flex xs4>
        <v-btn round color="blue" @click="timer()" style="color: white">Count Down</v-btn>
        <div v-if="show">
          <h3>Game Start in . . . {{ waktu }}</h3>
        </div>  
      </v-flex>
        <v-flex> <h1 class="display-3">{{currentWord.word}}</h1></v-flex>
      <v-flex xs4>
        <div v-if="showGame">
          <h2>{{ selesai }}</h2>
          <h1 style="font-size: 90px">{{ waktuStart }}</h1>
          <h1>{{ waktuSelesai }}</h1>
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
      },
      raceState: {
        source: this.$fbasedb.ref('raceState'),
        asObject: true
      }
    }
  },
  methods: {
    timer () {
      this.show   = true;
      const Timer = require('tiny-timer');
      let timer   = new Timer();
      let time = timer.start(4000);

      timer.on('tick', (ms) => {
        this.waktu = (Math.floor(ms) / 1000).toFixed()
        console.log('tick', (Math.floor(ms) / 1000).toFixed())
      })

      timer.on('tick', () => {
        this.selesai = 'Game Start !'
        if (this.waktu === 0) {
          this.startGame()
        }
      })
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
      console.log('GAME STARRRRT')
      this.showGame = true
      this.show = false
      const Timer = require('tiny-timer')
      // let timerStart = new Timer()
      let timeNow = (new Date()).getTime()
      let interval = this.raceState.endTime - timeNow
      console.log(interval / 1000)
      let timerStart = new Timer()
      timerStart.start(interval)

      timerStart.on('tick', (ms) => {
        this.waktuStart = (Math.floor(ms) / 1000).toFixed()
        // console.log('tick', (Math.floor(ms) / 1000).toFixed())
        if (this.waktuStart === 50) {
          this.waktuSelesai = `C'mon ! Try Harder !`
        } else if (this.waktuStart === 40) {
          this.waktuSelesai = 'You Can Do It !'
        } else if (this.waktuStart === 30) {
          this.waktuSelesai = `If you never say no, you'll never say yes`
        } else if (this.waktuStart === 20) {
          this.waktuSelesai = 'Ganbatte !'
        } else if (this.waktuStart === 10) {
          this.waktuSelesai = `Ten Seconds Left Man, C'mon !`
        } else if (this.waktuStart === 3) {
          this.waktuSelesai = `Three !`
        } else if (this.waktuStart === 2) {
          this.waktuSelesai = `Two !`
        } else if (this.waktuStart === 1) {
          this.waktuSelesai = `One !`
        }
      })
      timerStart.on('done', () => {
        // this.waktuSelesai = `Time's Up ! Game Over !`
        this.timeout()
      })
    },

    timeout () {
      // router.push({name: 'ResultPage'})
      this.$fbasedb.ref('raceState').set({
        isStarted: false,
        endTime: null
      })
      console.log(this.alldata[0].name)
      let newArr = this.alldata.sort(function(a,b) {return (a.poin < b.poin) ? 1 : ((b.poin < a.poin) ? -1 : 0);} )
      console.log(newArr)
      this.$router.push(`/resultpage?winner=${newArr[0].name}&score=${newArr[0].poin}`)
      
    },

    getNewText () {
      console.log('get new text')
      let inithis = this
      axios.get('http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5')
      .then(function (result) {
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
  mounted () {


    this.$fbasedb.ref('wordrace').on('value', (snapshot) => {
      console.log('INI ALL READY........',this.isAllReady, this.raceState.isStarted )
      let isStartedStatus
      if (this.raceState.isStarted === undefined) {
        isStartedStatus = true
      } else {
        isStartedStatus = this.raceState.isStarted
      }
      if (this.isAllReady && !isStartedStatus) {
        let newEndTime = new Date()
        let newEndTimeMiliseccond = newEndTime.getTime() + 61000
        console.log('ini end milisecond yang baru..........',newEndTimeMiliseccond)
        this.$fbasedb.ref('raceState').set({
          isStarted: true,
          endTime: newEndTimeMiliseccond
        })
      }
    })

    this.$fbasedb.ref('raceState').on('value', (snapshot) => {
      console.log('HIHIHI2222 ')
      // if (this.isAllReady && !this.raceState.isStarted) {
        // let newEndTime = new Date()
        // let newEndTimeMiliseccond = newEndTime.getTime() + 6000
        // console.log(newEndTimeMiliseccond)
        // this.$fbasedb.ref('raceState').set({
        //   isStarted: true,
        //   endTime: newEndTimeMiliseccond
        // })
        // .then(res => {
      let isStartedStatus
      if (this.raceState.isStarted === undefined) {
        isStartedStatus = true
      } else {
        isStartedStatus = this.raceState.isStarted
      }
      if (isStartedStatus) {
        console.log('init race state')
        this.startGame()
      }
        // })
      // }
    })

    // if (this.raceState.isStarted) {
    //   console.log('race state karena restart')
    //   this.startGame()
    // }
  }
}
</script>

<style>
  .right{
    float: right;
  }
</style>
