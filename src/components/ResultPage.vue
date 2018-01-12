<template>
  <div class="wrapper">
    <div class="modal modal--congratulations">
        <div class="modal-top">
            <img class="modal-icon u-imgResponsive" src="https://dl.dropboxusercontent.com/s/e1t2hhowjcrs7f5/100daysui_100icon.png" alt="Trophy" />
            <div class="modal-header">Congratulations {{this.$route.query.winner}}</div>
            <div class="modal-subheader">{{this.$route.query.winner}}, You score : {{this.$route.query.score}} Poin</div>
        </div>
        <v-layout class="modal-bottom" align-center wrap>
            <v-btn color="primary" v-on:click="toHome" class="rapihin">HOME</v-btn>
            <v-btn color="green"  v-on:click="playAgain" class="rapihin">Play Again</v-btn>
        </v-layout>
    </div>
</div>
</template>

<script>
import router from '../router'
export default {
  data () {
    return {
      winnerName: 'fabio',
      winnerScore: '10'
    }
  },
  props: [
    'winner'
  ],
  created () {
    console.log(this.$route.query)
    this.$fbasedb.ref('wordrace').set(null)
  },
  methods: {
    toHome: function () {
      router.push({name: 'WelcomePage'})
    },
    playAgain: function () {
      router.push({name: 'RacePage'})
    }
  }
}
</script>

<style>
/* Global 
====================== */
html {
    box-sizing: border-box;
    height: 100%;
}
body {
    font-family: "Proxima Nova Soft Semibold", "Proxima Nova", 'Helvetica Neue', Helvetica, Arial;
}
body,
.wrapper {
    min-height: 100vh;
}

/* Modal 
====================== */
.rapihin{
  margin: auto;
  padding: 0px 10px 0px 10px;
  align-self: auto;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(https://dl.dropboxusercontent.com/s/v3m6p0p5kq6xzkz/100daysui_100bg.png) no-repeat, #303540;
    background-size: cover;
}
.modal {
    width: 100%;
    max-width: 530px;
    margin: 20px;
    overflow: hidden;
    box-shadow: 0 60px 80px 0 rgba(0,0,0,.4);
}
.modal-top {
    padding: 30px 30px 20px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: rgba(251,251,251,1);
}
.modal-icon {
    display: block;
    max-width: 207px;
    margin: 0 auto 65px;
}
.modal-header {
    margin-bottom: 10px;
    font-size: 25.5px;
    letter-spacing: 2px;
    text-align: center;
}
.modal-subheader {
    max-width: 350px;
    margin: 0 auto;
    font-size: 19px;
    line-height: 1.3;
    letter-spacing: 1.25px;
    text-align: center;
    color: #999;
}
.modal-bottom {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 55px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #fff;
}
.modal-btn {
    margin: 10px auto;
    
}

/* Media Queries */
@media (min-width: 456px) {

    .modal-top {
        padding: 69px 0 65px;
    }
    .modal-bottom {
        padding: 30px 60px;
    }
    .modal-btn {
        flex: 1;
        margin: 0;
        max-width: 190px;
        
        /* &:nth-of-type(2) {
            margin-left: 30px;
        } */
    }
}
</style>
