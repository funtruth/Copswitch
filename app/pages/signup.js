import React, { Component } from 'react';
import firebase from '../FirebaseController.js';
//import Firebase from 'firebase';

import styles from '../styles/Styles';
import Button from '../components/button.js';
import Header from '../components/header.js';

//import RNFirebase from 'react-native-firebase';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TextInput,
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

const User = new Object();

export default class signup extends Component {
    constructor(){
        super();
        const User = new Object();
        this.state = {
            email: '',
            password: ''
        };
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
                <TextInput
                    style={styles.textinput}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    placeholder={"Email Address"}
                />
                <TextInput
                    style={styles.textinput}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    secureTextEntry={true}
                    placeholder={"Password"}
                />
                
                <Button
                    text="Log In"
                    button_styles={styles.primary_button}
                    button_text_styles={styles.primary_button_text} />

                <Button 
                    text="New here?" 
                    button_styles={styles.transparent_button} 
                    button_text_styles={styles.transparent_button_text} />

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

AppRegistry.registerComponent('App', () => signup);