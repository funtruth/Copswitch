import { AsyncStorage } from "react-native";
import firebase from './firebase/FirebaseController.js';

// We should probably make a hash or something
export const USER_KEY = "USER-KEY";
export const GAME_KEY = "GAME-KEY";
export const ROOM_KEY = "ROOM-KEY";

export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");
export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const onJoinGame = (roomname) => AsyncStorage.setItem(GAME_KEY, roomname);
export const onLeaveGame = () => AsyncStorage.removeItem(GAME_KEY);

export const onJoinRoom = (roomname) => AsyncStorage.setItem(ROOM_KEY, roomname);
export const onLeaveRoom = () => AsyncStorage.removeItem(ROOM_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
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
    AsyncStorage.getItem(GAME_KEY)
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
    AsyncStorage.getItem(ROOM_KEY)
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