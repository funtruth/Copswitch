import React from "react";
import { 
    View, 
    Keyboard, 
    BackHandler,
    AsyncStorage
} from "react-native";
import { Button, FormInput } from "react-native-elements";
import { onSignIn } from "../auth";

import styles from "../styles/Styles";
import firebase from '../firebase/FirebaseController.js';

import ProfileButton from '../components/ProfileButton.js';

import { NavigationActions } from 'react-navigation';

export default class SignInScreen extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'SignIn';

        this.state = { 
            email: '', 
            password: '',
            loading: false,
            };
      }

render(){
    return <View style={{
        backgroundColor: '#e6ddd1',
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        }}>
            
            
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

            <View style ={{marginTop:10}}>
            <ProfileButton
                title="LOG IN"
                onPress={() => {
                    firebase.auth().signInWithEmailAndPassword(
                        this.state.email, this.state.password).then(() => 
                            {
                                onSignIn();
                                this.props.navigation.navigate("SignedIn");
                                Keyboard.dismiss();
                            }

                            ).catch((error)=>
                            {
                                alert('Login Failed');
                            });
                }}
            /></View>
            
            <View style = {{marginTop: 10}}>
            <ProfileButton
                title="Sign Up"
                onPress={() => this.props.navigation.navigate("SignUp")}
            /></View>
            <View style = {{marginTop:10}}>
            <ProfileButton
                title="Continue Anonymously"
                onPress={() => {
                    firebase.auth().signInAnonymously().then(() => {
                        this.props.navigation.navigate("SignedIn")
                    })
                }}
            /></View>
            
  </View>
  }
};