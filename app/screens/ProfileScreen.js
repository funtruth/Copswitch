
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
  }

componentWillMount() {
  //Grabs the username and email of current user
  const uid = firebase.auth().currentUser.uid
  const UserDB = firebase.database().ref("users/" + uid)

  UserDB.child('username').on('value',snapshot => {
    this.setState({
      username: snapshot.val(),
    })
  }),
  UserDB.child('email').on('value',snapshot => {
      this.setState({
        email: snapshot.val(),
      })
    })
}

  render(){
    return <View style={{ paddingVertical: 20 }}>
      <Card title={this.state.email}>
        <View
          style={{
            backgroundColor: "#03A9F4",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 60,
            alignSelf: "center",
            marginBottom: 20
          }}
        >
          <Text style={{ color: "white", fontSize: 28 }}>{this.state.username}</Text>
        </View>
        
        <View
          style={{
            marginBottom:20
          }}
        >
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
        </View>

        <Button
          backgroundColor="red"
          title="Delete Account"
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