import React from "react";
import { View, Keyboard, BackHandler } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";
import { onSignIn } from "../auth";

import styles from "../styles/Styles";
import firebase from '../firebase/FirebaseController.js';


import { NavigationActions } from 'react-navigation';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
} = FBSDK; 

export default class SignInScreen extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'SignIn';
      }

    componentWillMount() {
        this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.currentRouteName !== 'Kekekekke') {
                return false;
            }
              return true;
        });
    }

    componentWillUnmount() {
        this.backButtonListener.remove();
    }
    
state = { 
    email: '', 
    password: '',
    loading: false,
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
        secureTextEntry 
        placeholder="Password..." 
        value={this.state.password}
        onChangeText={password => this.setState({ password })}
        />

      <Button
        buttonStyle={{ marginTop: 10 }}
        backgroundColor="#03A9F4"
        title="LOG IN"
        onPress={() => {
            firebase.auth().signInWithEmailAndPassword(
                this.state.email, this.state.password).then(() => 
                    {
                        this.props.navigation.navigate("SignedIn");
                        Keyboard.dismiss();
                    }

                    ).catch((error)=>
                    {
                        alert('Login Failed');
                    });
        }}
      />
      <Button
        backgroundColor="transparent"
        textStyle={{ color: "#bcbec1" }}
        title="Sign Up"
        onPress={() => this.props.navigation.navigate("SignUp")}
      />
    </Card>
    <View style={{
        marginTop: 30,
        alignItems: 'center'
    }}
    >
    <LoginButton 
        publishPermissions={["publish_actions"]}
        onLoginFinished={
            (error, result) => {
                if (error) {
                    alert("Login failed with error: " + result.error);
                } else if (result.isCancelled) {
                    alert("Login was cancelled");
                } else {
                    //AccessToken.getCurrentAccessToken().then((data) => {
                        //const { accessToken } = data
                        //this.initUser(accessToken)
                    //})
                    onSignIn().then(() => this.props.navigation.navigate("SignedIn"));
                }
            }
        }/>
      </View>
  </View>}
};