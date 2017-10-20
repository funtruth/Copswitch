import { AsyncStorage } from "react-native";
import firebase from './firebase/FirebaseController.js';

export const onSignIn = () => AsyncStorage.setItem('USER-KEY', "true");
export const onSignOut = () => AsyncStorage.removeItem('USER-KEY');

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('USER-KEY')
      .then(res => {
        if (res !== null) {
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              resolve(true)
              console.log("HE'S ALREADY SIGNED IN");
            } else {
              resolve(false)
              console.log("HE'S NOT LOGGED IN")
            }
          });
        } else {
          resolve(false);
          console.log("WHY THIS ONE");
        }
      })
      .catch(err => reject(err));
    });
}

export const isInGame = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('GAME-KEY')
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
    });
}

export const isInRoom = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('ROOM-KEY')
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
    });
}