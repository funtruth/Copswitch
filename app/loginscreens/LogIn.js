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
import colors from '../misc/colors.js';

import { NavigationActions } from 'react-navigation';

export class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonListener = null;

        this.state = { 
            email: '', 
            password: '',
            };
      }

    _logIn(){
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            onSignIn();
            this.props.navigation.navigate("SignedIn");
            Keyboard.dismiss();
        }).catch((error)=> { alert('Login Failed') });
    }

    _signInAnon(){
        firebase.auth().signInAnonymously().then(() => {
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                .set({
                    phase: 1,
                    type:'Original',
                })
            onSignIn();
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    key: null,
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'SignedIn'})
                    ]
                })
            )
        })
    }

    render(){
        return <TouchableWithoutFeedback 
            style = {{ flex:1 }}
            onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.loginbackground,justifyContent:'center',alignItems:'center'}}>
                
                
                <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TextInput
                        placeholder="Email Address ..."
                        style={{
                            backgroundColor: colors.loginbackground,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize:22,
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
                            backgroundColor: colors.loginbackground,
                            flex:0.6,
                            fontFamily:'ConcertOne-Regular',
                            fontSize:22,
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
                        color={colors.lightfont}
                        fontSize={30}
                        borderRadius={15}
                        backgroundColor={colors.loginbuttoncolor}
                        onPress={()=>{
                            this._logIn();
                        }}
                    /></View>
                </View>

                <View style ={{flex:0.2}}/>

                <View style = {{justifyContent: 'center', alignItems:'center', flexDirection: 'row', marginBottom:5 }}>
                    <View style = {{flex:0.75}}>
                    <Button
                        title="Sign Up"
                        fontFamily='ConcertOne-Regular'
                        color={colors.lightfont}
                        fontSize={25}
                        borderRadius={15}
                        backgroundColor={colors.loginbuttoncolor}
                        onPress={() => this.props.navigation.navigate("SignUp")}
                    /></View>
                </View>
                
                <View style = {{justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                    <View style = {{flex:0.75}}>
                    <Button
                        title="Continue Anonymously"
                        fontFamily='ConcertOne-Regular'
                        color={colors.lightfont}
                        borderRadius={10}
                        backgroundColor={colors.loginbuttoncolor}
                        onPress={()=>{
                            this._signInAnon();
                        }}
                    /></View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
};

export class SignUp extends React.Component {
    
    constructor(props){
        super(props);
        this.state = { 
            email: '', 
            password: '',
            confirmpassword: '',
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
                      .set({email: email})
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                      .set({
                        phase:1,
                        type:'Original'})
                    onSignIn();
                    this.props.navigation.navigate("SignedIn");
                    Keyboard.dismiss();
                }).catch((error)=> {
                    alert('Login Failed');
                });
    
        }).catch((error) => {
            alert('Account Creation Failed.');
        });
      }
    
    render(){
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
        <View style = {{flex:1,backgroundColor:colors.loginbackground,justifyContent:'center',alignItems:'center'}}>
            
            
            <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput
                    placeholder="Email Address ..."
                    style={{
                        backgroundColor: colors.loginbackground,
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                        fontSize:18,
                    }}
                    value={this.state.email}
                    keyboardType = 'email-address'
                    onChangeText = {(text) => {this.setState({email: text})}}
                    onSubmitEditing = {()=>this.refs['password'].focus()}
                />
            </View>

            <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                <TextInput
                    ref='password'
                    placeholder="Password ..."
                    style={{
                        backgroundColor: colors.loginbackground,
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                        fontSize:18,
                    }}
                    value={this.state.password}
                    secureTextEntry = {true}
                    onChangeText = {(text) => {this.setState({password: text})}}
                    onSubmitEditing = {()=>this.refs['confirm'].focus()}
                />
            </View>

            <View style = {{ justifyContent: 'center', flexDirection: 'row', marginBottom:10 }}>
                <TextInput
                    ref='confirm'
                    placeholder="Confirm ..."
                    style={{
                        backgroundColor: colors.loginbackground,
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                        fontSize:18,
                    }}
                    value={this.state.confirm}
                    secureTextEntry = {true}
                    onChangeText = {(text) => {this.setState({confirm: text})}}
                    onSubmitEditing = {()=>{Keyboard.dismiss()}}
                />
            </View>

            <View style = {{ justifyContent: 'center', alignItems:'center', flexDirection: 'row' }}>
                <View style = {{flex:0.75}}>
                <Button
                    title="Create Account"
                    fontFamily='ConcertOne-Regular'
                    color={colors.lightfont}
                    fontSize={30}
                    borderRadius={15}
                    backgroundColor={colors.loginbuttoncolor}
                    onPress={()=>{
                        this._SignUpProcess(this.state.email,this.state.password);
                    }}
                /></View>
            </View>

            <View style = {{flex:0.5}}/>

        </View>
    </TouchableWithoutFeedback>
            
    }
};