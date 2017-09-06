import React from "react";
import { View } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { onSignIn } from "../auth";

import firebase from '../FirebaseController.js';

export default class SignUpScreen extends React.Component {
  
  state = { 
    email: '', 
    password: '',
    confirm: '',
  };

  render(){
    return <View style={{ paddingVertical: 20 }}>
    <Card>
      <FormInput 
        placeholder="Email address..."
        value={this.state.email}
        onChangeText={email => this.setState({ email })}
      />
      <FormInput 
        secureTextEntry placeholder="Password..."
        value={this.state.password}
        onChangeText={password => this.setState({ password })}
      />
      <FormInput 
        secureTextEntry 
        placeholder="Confirm Password..." 
        value={this.state.confirm}
        onChangeText={confirm => this.setState({ confirm })}
      />

      <Button
        buttonStyle={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        title="SIGN UP"
        onPress={() => {
          firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
          onSignIn().then(() => this.props.navigation.navigate("SignIn"));

        }}
        />
    </Card>
  </View>
  }
};