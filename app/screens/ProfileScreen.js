
import React from 'react';
import {
    View,
    Image,
    AsyncStorage
}   from 'react-native';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";

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
              onSignOut();
              firebase.auth().signOut;
              //this.props.navigation.navigate('SignedOut');
              context.props.navigator.pop();
            });
            //onSignOut().then(() => this.props.navigation.navigate("SignedOut"))}
          }}
        />
        <Button
            backgroundColor="#03A9F4"
            onPress={() => this.props.navigation.navigate('DrawerOpen')}
            title="Open Drawer Navigator"
        />
      </Card>
    </View>}
    
};