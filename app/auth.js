import { AsyncStorage } from "react-native";
import firebase from './firebase/FirebaseController.js';

// We should probably make a hash or something
export const USER_KEY = "auth-demo-key";

export const onSignIn = () => AsyncStorage.setItem(USER_KEY, "true");

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              resolve(true)
              console.log("HE'S ALREADY SIGNED IN");
            } else {
              // No user is signed in.
              resolve(false)
              console.log("HE'S NOT LOGGED IN")
              // I don't think this one and the one below fires
              // because USER_KEY does not exist once logged out
              // maybe we should keep this for redundancy?
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
/*
export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
}; */
