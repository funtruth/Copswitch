
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar,
    BackHandler,
    AsyncStorage
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Create_FirstScreen extends Component {

_MakeRoomDB(roomname,coffeeshop,roomsize,dropoffloc,dropofftime,uid,cups,username){
    firebase.database().ref('rooms/' + uid)
    .set({
        username,
        roomname,
        coffeeshop,
        roomsize,
        dropoffloc,
        dropofftime,
        cups,
        spot1: '',
        spot2: '',
        spot3: ''
    })
    AsyncStorage.setItem("is_there_a_room", "true")

}

constructor(props) {
    super(props);
    this.state = {
        username: '',
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',
        cups: '',
        loading: false,
    }
  }

componentWillMount() {
    //Grabs the username and email of current user
    const uid = firebase.auth().currentUser.uid
    const UserDB = firebase.database().ref("users/" + uid)

    UserDB.child('username').on('value',snapshot => {
        this.setState({
            username: snapshot.val(),
        })
    })
}

render(){
    return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'        
            }}
            >

                <FormInput
                    placeholder={this.state.username + "'s Room"}
                    value={this.state.roomname}
                    onChangeText={roomname => this.setState({ roomname })}
                />
                
                <FormInput
                    placeholder="Coffeeshop..."
                    value={this.state.coffeeshop}
                    onChangeText={coffeeshop => this.setState({ coffeeshop })}
                />

                <FormInput
                    placeholder="Cups of Coffee..."
                    value={this.state.roomsize}
                    onChangeText={roomsize => this.setState({ roomsize })}
                />

                <FormInput
                    placeholder="Location..."
                    value={this.state.dropoffloc}
                    onChangeText={dropoffloc => this.setState({ dropoffloc })}
                />

                <FormInput
                    placeholder="Time..."
                    value={this.state.dropofftime}
                    onChangeText={dropofftime => this.setState({ dropofftime })}
                />
                
                <Button
                    backgroundColor="#8b6f4b"
                    color='#8b6f4b'
                    title="Create Room"
                    onPress={() => {
                        this._MakeRoomDB(this.state.roomname,this.state.coffeeshop,
                            this.state.roomsize,this.state.dropoffloc,this.state.dropofftime,
                            firebase.auth().currentUser.uid,1,this.state.username);

                        this.props.navigation.navigate('Create_SecondScreen')} 
                    }
                    style={{
                        width: 80
                    }}
                    
                />
            </View>
        }
}

class Create_SecondScreen extends Component {

_DeleteRoomDB(uid){
    firebase.database().ref('rooms/' + uid).remove()
    AsyncStorage.removeItem("is_there_a_room")
}

    render(){
        return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
                }}>

                <Button
                    color='#8b6f4b'
                    title="Delete Room"
                    onPress={() => {
                        this._DeleteRoomDB(firebase.auth().currentUser.uid)

                        this.props.navigation.navigate('Create_FirstScreen')
                    }}
                    style={{
                        width: 80
                    }}
                />
            </View>
}}


export default stackNav = StackNavigator(
{
    Create_FirstScreen: {
        screen: Create_FirstScreen,
    },
    Create_SecondScreen: {
        screen: Create_SecondScreen,
    },
},
    {
        headerMode: 'none',
    }
);

