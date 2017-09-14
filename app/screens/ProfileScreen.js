
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    ToastAndroid,
    Button
}   from 'react-native';

//import { NavigationActions } from 'react-navigation';

import { Card, Text } from "react-native-elements";
//import { onSignOut } from "../auth";

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

  UserDB.child('username').once('value',snapshot => {
    this.setState({
      username: snapshot.val(),
    })
  }),
  UserDB.child('email').once('value',snapshot => {
      this.setState({
        email: snapshot.val(),
      })
    })
}

  render(){
    return <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e6ddd1',
          }}>

          <Text style={{ color:'#493a27', fontSize: 28 }}>{this.state.username}</Text>
          <Text style={{ color: '#493a27', fontSize: 28 }}>{this.state.email}</Text>

          <Button
            backgroundColor="#8b6f4b"
            color='#b18d77'
            title="SIGN OUT"
            onPress={() => {
              this.props.navigation.navigate('SignedOut');
              
                //onSignOut().then(() => {
                  //firebase.auth().signOut();
                 //this.props.navigation.navigate('SignedOut');
                //}) 
            }}
          />

        <Button
          backgroundColor="#8b6f4b"
          color='#b18d77'
          title="Delete Account"
          onPress={() => {
            firebase.auth().currentUser.delete().then(() => {
              this.props.navigation.navigate('SignedOut');
            }).catch(() => {
              alert('Failed to Delete');
            })
          }}
        />
    </View>}
    
};