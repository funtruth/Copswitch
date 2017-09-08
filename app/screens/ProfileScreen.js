
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    ToastAndroid
}   from 'react-native';

//import { NavigationActions } from 'react-navigation';

import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";
import Settings from './SettingsScreen'

//Facebook
import { LoginManager } from 'react-native-fbsdk'

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class ProfileScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username:null,
      email:null,
      loading: true,
    }
    this.backButtonListener = null;
    this.currentRouteName = 'Main';
  }

  componentWillMount() {
    this.setState({
      username: '',
      email: '',
      loading: false
    });

    this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.currentRouteName !== 'Join') {
          return false;
      }
        this.props.navigation.navigate('Profile');
        return true;
  });
}

  componentWillUnmount() {
    this.backButtonListener.remove();
  }

  render(){
    return <View style={{ paddingVertical: 20 }}>
      <Card title={firebase.auth().currentUser.email}>
        <View
          style={{
            backgroundColor: "#bcbec1",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 40,
            alignSelf: "center",
            marginBottom: 20
          }}
        >
          <Text style={{ color: "white", fontSize: 28 }}>MR</Text>
        </View>

        <Button
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={() => {
              onSignOut().then(() => {
                firebase.auth().signOut();
                this.props.navigation.navigate('SignedOut');
              })
          }}
        />

        <Button
          backgroundColor="#03A9F4"
          title="Delete Account"
          style={{
            marginTop: 50
          }}
          onPress={() => {
            firebase.auth().currentUser.delete().then(() => {
              this.props.navigation.navigate('SignedOut');
            }).catch(() => {
              alert('Failed to Delete');
            })
          }}
        />

      </Card>
    </View>}
    
};