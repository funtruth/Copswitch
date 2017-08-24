import React, { Component } from 'react';
import firebase from './FirebaseController.js';
import styles from './Styles';
import User from './User';
//import RNFirebase from 'react-native-firebase';

import {
    StyleSheet,
    Text,
    View,
    Button 
}   from 'react-native';
/*
const configurationOptions = {
    debug: true
  };
  
const firebase = RNFirebase.initializeApp(configurationOptions); */

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK; 

export default class App extends Component {
    constructor(){
        super();
        const User = new Object();
    }

    initUser(token) {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            User.name = json.name
            User.id = json.id
            //user.user_friends = json.friends
            User.email = json.email
            User.username = json.username
            //user.loading = false
            //user.loggedIn = true
            //user.avatar = setAvatar(json.id)
            console.log(User.name);
            console.log(User.id);
            console.log(User.email);
            console.log(User.username);
            this.saveUser()
        })
        .catch(() => {
            reject('Error getting data from Facebook')
        })
    }

    saveUser() {
        firebase.database()
        .ref('users/' + User.name)
        .set({
            name: User.name,
            id: User.id,
            email: User.email,
            username: User.username
        });
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Dumb
                </Text>
                <LoginButton
                    publishPermissions={["publish_actions"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login failed with error: " + result.error);
                            } else if (result.isCancelled) {
                                alert("Login was cancelled");
                            } else {
                                AccessToken.getCurrentAccessToken().then((data) => {
                                    const { accessToken } = data
                                    this.initUser(accessToken)
                                })
                            }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")}/>
            </View>
        );
    }
}