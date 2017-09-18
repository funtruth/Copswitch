import React from "react";
import { View, Keyboard, Text } from "react-native";
import { Button, FormInput, FormLabel } from "react-native-elements";
import { onSignIn } from "../auth";

import firebase from '../firebase/FirebaseController.js';

export default class SignUpScreen extends React.Component {

constructor(props){
  super(props);
  this.state = { 
    firstname: '',
    lastname: '',
    email: '', 
    password: '',
    confirmpassword: '',
    loading: false,
  };
}

//Creates user and Signs them in
_SignUpProcess(email,password){
  firebase.auth().createUserWithEmailAndPassword(
    email,password).then(() =>
    {
        firebase.auth().signInWithEmailAndPassword(
        email, password).then(() => 
            {
                firebase.database().ref('users/' + firebase.auth().currentUser.uid)
                .set({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    email: email,
                    username: this.state.username,
                })
                this.props.navigation.navigate("SignedIn");
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
    return <View style={{
      backgroundColor: '#e6ddd1',
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      }}>
    
        <View style = {{flexDirection: "row"}}>
            <FormInput 
              placeholder="First Name ..."
              value={this.state.firstname}
              onChangeText={firstname => this.setState({ firstname })}
              containerStyle={{
                flex: 0.5,
              }}
            />
            <FormInput 
              placeholder="Last ..."
              value={this.state.lastname}
              onChangeText={lastname => this.setState({ lastname })}
              containerStyle={{
                flex:0.5,
              }}
            />
        </View>
        
        
        <FormInput 
          placeholder="Email address ..."
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <FormInput 
          secureTextEntry 
          placeholder="Password ..."
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <FormInput 
          secureTextEntry 
          placeholder="Confirm Password ..." 
          value={this.state.confirm}
          onChangeText={confirm => this.setState({ confirm })}
        />


        <View style={{flexDirection: 'row', marginTop:25,}}>
            <View style = {{flex:0.7}}>
              <FormInput
                  placeholder="Choose a Username ..."
                  value = {this.state.username}
                  onChangeText={username => this.setState({ username })}
              />
            </View>
            <View style = {{flex:0.3}}>
                <Button
                  backgroundColor="#b18d77"
                  color='white'
                  title="Sign Up"
                  borderRadius={10}
                  fontSize={12}
                  onPress={() => {
                    this._SignUpProcess(this.state.email,this.state.password);
                  }}
                  buttonStyle={{marginTop:10}}
            /></View>
        </View>
  </View>
  }
};