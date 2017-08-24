import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import styles from '../Styles';

import RNFirebase from 'react-native-firebase';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;

const configurationOptions = {
  debug: true
};

const firebase = RNFirebase.initializeApp(configurationOptions);


export default class FBLogin extends Component {
  render() {
    return (
      <View style={styles.container}>

        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
}