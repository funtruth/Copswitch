import React from "react";
import { View, Keyboard } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { onSignIn } from "../auth";

import firebase from '../firebase/FirebaseController.js';

export default class SignUpScreen extends React.Component {
  
  state = { 
    email: '', 
    password: '',
    confirm: '',
    loading: false,
  };

//Creates user and Signs them in
_SignUpProcess(email,password){
  firebase.auth().createUserWithEmailAndPassword(
    email,password).then(() =>
    {
        firebase.auth().signInWithEmailAndPassword(
        email, password).then(() => 
            {
                this.props.navigation.navigate("CreateUsername");
                Keyboard.dismiss();
            }).catch((error)=>
                {
                    this.setState({
                      loading: false,
                    })
                    alert('Login Failed');
                });

    }).catch((error) => {
      this.setState({
        loading: false,
      })
      alert('Account Creation Failed.');
    });
  }

  render(){
    return <View style={{ paddingVertical: 20 }}>
    <Card>
      <FormInput 
        placeholder="Email address..."
        value={this.state.email}
        onChangeText={email => this.setState({ email })}
      />
      <FormInput 
        secureTextEntry 
        placeholder="Password..."
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
            this._SignUpProcess(this.state.email,this.state.password);
        }}
        />
    
    </Card>
  </View>
  }
};