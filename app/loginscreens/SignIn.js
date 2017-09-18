import React from "react";
import { 
    View, 
    Keyboard, 
    BackHandler,
    AsyncStorage
} from "react-native";
import { Button, FormInput } from "react-native-elements";
//import { onSignIn } from "../auth";

import styles from "../styles/Styles";
import firebase from '../firebase/FirebaseController.js';

import ProfileButton from '../components/ProfileButton.js';

import { NavigationActions } from 'react-navigation';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK; 

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
                                this.props.navigation.navigate("SignedIn");
                                //onSignIn();
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
            
            <View style = {{alignSelf: 'center',marginTop: 20}}>
            <LoginButton 
                publishPermissions={["publish_actions"]}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            alert("Login failed with error: " + result.error);
                        } else if (result.isCancelled) {
                            alert("Login was cancelled");
                        } else {
                            LoginManager
                                .logInWithReadPermissions(['public_profile', 'email'])
                                .then((result) => {
                                    if (result.isCancelled) {
                                        return Promise.resolve('cancelled');
                                    }
                                    console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                                    // get the access token
                                    return AccessToken.getCurrentAccessToken();
                                })
                                .then(data => {
                                    // create a new firebase credential with the token
                                    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                                    // login with credential
                                    return firebase.auth().signInWithCredential(credential);
                                })
                                .then((currentUser) => {
                                    if (currentUser === 'cancelled') {
                                        console.log('Login cancelled');
                                    } else {
                                        // now signed in
                                        console.warn(JSON.stringify(currentUser.toJSON()));
                                    }
                                })
                                .catch((error) => {
                                    console.log(`Login fail with error: ${error}`);
                                });
                            //onSignIn()
                            this.props.navigation.navigate("SignedIn");
                        }
                    }
            }/></View>
  </View>
  }
};