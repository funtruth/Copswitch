import RNFirebase from 'react-native-firebase';

const configurationOptions = {
  debug: true,
  apiKey: "AIzaSyCTzqSB0g2r_E9SOUNOzd6_Q29wQXBpHTs",
  authDomain: "huddlec-4205b.firebaseapp.com",
  databaseURL: "https://huddlec-4205b.firebaseio.com",
  projectId: "huddlec-4205b",
  storageBucket: "huddlec-4205b.appspot.com",
  messagingSenderId: "980818700684"
};

//Other Option - Not being used at the moment
const firebaseConfig = {
  apiKey: "AIzaSyCTzqSB0g2r_E9SOUNOzd6_Q29wQXBpHTs",
  authDomain: "huddlec-4205b.firebaseapp.com",
  databaseURL: "https://huddlec-4205b.firebaseio.com",
  projectId: "huddlec-4205b",
  storageBucket: "huddlec-4205b.appspot.com",
  messagingSenderId: "980818700684"
};

const firebase = RNFirebase.initializeApp(configurationOptions);

export default firebase;