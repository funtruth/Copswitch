import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import styles from '../Styles';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;

export default class FBLogin extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          dumb
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
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
}