import Firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyAnuda7zofWIzFrXWPnvv97Ki_EnXK84dM',
  authDomain: 'foxyfire-42d45.firebaseapp.com',
  databaseURL: 'https://foxyfire-42d45.firebaseio.com',
  projectId: 'foxyfire-42d45',
  storageBucket: 'foxyfire-42d45.appspot.com',
  messagingSenderId: '706434874994'
}

const firebaseApp = Firebase.initializeApp(config)
const db = firebaseApp.database()

export default db
