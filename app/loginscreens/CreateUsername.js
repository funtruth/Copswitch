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
            this._WriteToDB(firebase.auth().currentUser.uid,this.state.username,
                firebase.auth().currentUser.email).then(() => {
                  onSignIn();
                }) 

            this.props.navigation.navigate('Profile');
        }}
        />

    </Card>
  </View>
  }
};