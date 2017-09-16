import React from "react";
import { View, Keyboard } from "react-native";
import { 
  Card, 
  Button, 
  FormLabel, 
  FormInput 
} from "react-native-elements";
import { onSignIn } from "../auth";

import firebase from '../firebase/FirebaseController.js';

export default class CreateUsername extends React.Component {
  
  state = { 
    uid: '',
    email: '', 
    username: '',
    loading: false,
  };

_WriteToDB(uid,username,email){
    firebase.database().ref('users/' + uid)
    .set({
        email,
        username
    })
    firebase.database().ref('defaults/' + uid)
    .set({
        coffeeshop: 'None',
        _coffeeshop: false,
        drinktype: 'None',
        _drinktype: false,
        coffeeorder: 'None',
        _coffeeorder: false,
        size: 'None',
        _size: false,
        dropoffloc: 'None',
        _dropoffloc: false,
        dropofftime: 'None',
        _dropofftime: false,
    })
    firebase.database().ref('settings/' + uid)
    .set({
        settings1: '',
        settings2: '',
        settings3: '',
    })
}

  render(){
    return <View style={{ paddingVertical: 20 }}>
    <Card>
      <FormLabel>Pick a Username</FormLabel>
      <FormInput 
        placeholder="Username..."
        value={this.state.username}
        onChangeText={username => this.setState({ username })}
      />

        <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="Do weird things"
        onPress={() => {
            //Write uid, email, and username to the Database
            this._WriteToDB(firebase.auth().currentUser.uid,this.state.username, firebase.auth().currentUser.email)

            this.props.navigation.navigate('Profile');
        }}
        />

    </Card>
  </View>
  }
};