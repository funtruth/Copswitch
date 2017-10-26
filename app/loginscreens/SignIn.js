import React from "react";
import { 
    View, 
    Keyboard, 
    AsyncStorage,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { Button } from "react-native-elements";
import { onSignIn } from "../auth";

import firebase from '../firebase/FirebaseController.js';

import { NavigationActions } from 'react-navigation';

export default class SignInScreen extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonListener = null;

        this.state = { 
            email: '', 
            password: '',
            loading: false,
            };
      }

render(){
    return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
        <View style = {{flex:1,backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
            
            
            <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput
                    placeholder="Email Address ..."
                    style={{
                        backgroundColor: 'white',
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                    }}
                    value={this.state.email}
                    keyboardType = 'email-address'
                    onChangeText = {(text) => {this.setState({email: text})}}
                    onSubmitEditing = {()=>this.refs['password'].focus()}
                />
            </View>

            <View style = {{ justifyContent: 'center', flexDirection: 'row', marginBottom:10 }}>
                <TextInput
                    ref='password'
                    placeholder="Password ..."
                    style={{
                        backgroundColor: 'white',
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                    }}
                    value={this.state.password}
                    secureTextEntry = {true}
                    onChangeText = {(text) => {this.setState({password: text})}}
                    onSubmitEditing = {()=>{Keyboard.dismiss()}}
                />
            </View>

            <View style = {{ justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                <View style = {{flex:0.75}}>
                <Button
                    title="Log In"
                    fontFamily='ConcertOne-Regular'
                    fontSize={30}
                    borderRadius={15}
                    backgroundColor='black'
                    onPress={()=>{
                        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                            .then(() => {
                                onSignIn();
                                this.props.navigation.navigate("SignedIn");
                                Keyboard.dismiss();
                            }).catch((error)=> { alert('Login Failed') });
                    }}
                /></View>
            </View>

            <View style ={{flex:0.2}}/>

            <View style = {{justifyContent: 'center', alignItems:'center', flexDirection: 'row', marginBottom:5 }}>
                <View style = {{flex:0.75}}>
                <Button
                    title="Sign Up"
                    fontFamily='ConcertOne-Regular'
                    fontSize={25}
                    borderRadius={15}
                    backgroundColor='black'
                    onPress={() => this.props.navigation.navigate("SignUp")}
                /></View>
            </View>
            
            <View style = {{justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                <View style = {{flex:0.75}}>
                <Button
                    title="Continue Anonymously"
                    fontFamily='ConcertOne-Regular'
                    borderRadius={10}
                    backgroundColor='black'
                    onPress={()=>{
                        firebase.auth().signInAnonymously().then(() => {
                            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                                .set({
                                    phase: 1,
                                    type:'Original',
                                })
                            onSignIn();
                            this.props.navigation.navigate("SignedIn")
                        })
                    }}
                /></View>

            </View>
        </View>
    </TouchableWithoutFeedback>
  }
};
