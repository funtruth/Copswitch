
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    ToastAndroid
}   from 'react-native';

import { NavigationActions } from 'react-navigation';

import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";
import Settings from './SettingsScreen'

//Facebook
import { LoginManager } from 'react-native-fbsdk'

//Firebase
import firebase from '../FirebaseController.js';

let context = this;

export default class ProfileScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user:null,
      loading: true,
    }
    this.backButtonListener = null;
    this.currentRouteName = 'Main';
  }
  
  componentWillMount() {
    // get the current user from firebase
    // const userData = this.props.firebaseApp.auth().currentUser;
    AsyncStorage.getItem('userData').then((user_data_json) => {
      let userData = JSON.parse(user_data_json);
      this.setState({
        user: userData,
        loading: false
      });
    });


    this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.currentRouteName !== 'Main') {
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
      <Card title="John Doe">
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
          <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
        </View>

        <Button
          backgroundColor="#03A9F4"
          title="SIGN OUT"
          onPress={() => {
            AsyncStorage.removeItem('userData').then(() => {
              onSignOut().then(() => {
                firebase.auth().signOut;
                this.props.navigation.navigate('SignedOut');
              })
            });
            
          }}
        />

        <Button
          backgroundColor="#03A9F4"
          title="Settings"
          style={{
            marginTop: 20
          }}
          //onPress={() => this.props.navigation.navigate("Settings")}
        />

      </Card>
    </View>}
    
};