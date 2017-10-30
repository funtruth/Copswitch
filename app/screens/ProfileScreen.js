
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    FlatList,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { Button, List } from "react-native-elements";
import { onSignOut } from "../auth";
import colors from '../misc/colors.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    

    this.state = {
      inagame:false,
    }
    this.userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room');

  }

componentWillMount() {
    this.userRef.on('value',snap=>{
        if(snap.exists()){
            if(snap.val().phase > 1){
                this.setState({ inagame: true })
            } else {
                this.setState({ inagame:false })
            }
        }
        
    })
}

componentWillUnmount() {

    if(this.userRef){
      this.userRef.off();
    }
}

_leaveGame() {

    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .update({ name: null, phase:1, actionbtnvalue: false, presseduid: 'foo' })
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({ routeName: 'SignedIn'})
            ]
        })
    )
}

_logOutPress() {
    if(firebase.auth().currentUser.isAnonymous){
        onSignOut().then(() => { firebase.auth().currentUser.delete() })
        this.props.navigation.navigate('SignedOut');
    } else {
        onSignOut().then(() => { firebase.auth().signOut() }) 
        this.props.navigation.navigate('SignedOut');
    }
}

  render(){
    return <View style={{ flex: 1, backgroundColor: colors.background }}>

            <View style = {{flex:0.3}}/>

            <View style = {{flex:10, flexDirection:'row'}}>

                <View style = {{flex:0.3}}/>

                <View style = {{flex:4, borderRadius:15, backgroundColor:colors.main}}>
                
                </View>
                
                <View style = {{flex:0.7}}>
                    <View style = {{flex:9}}/>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=> {
                            this._leaveGame(); 
                        }}
                        disabled={!this.state.inagame}>
                        <MaterialIcons name='cancel'
                            style={{color:this.state.inagame?colors.color1:'gray',
                            fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={()=> {
                            this._logOutPress(); 
                        }}>
                        <MaterialCommunityIcons name='exit-to-app'
                            style={{color:colors.color1, fontSize:26,alignSelf:'center'}}/>
                    </TouchableOpacity>
                </View>

            </View>

            <View style = {{flex:0.3}}/>

    </View>
}};
