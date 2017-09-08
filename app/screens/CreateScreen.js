
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar,
    BackHandler
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Create_FirstScreen extends Component {

_MakeRoomDB(roomname,coffeeshop,roomsize,dropoffloc,dropofftime,uid){
    firebase.database().ref('rooms/' + uid)
    .set({
        roomname,
        coffeeshop,
        roomsize,
        dropoffloc,
        dropofftime          
    })
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
            }}>
                <Card title='Create a Room'>

                    <FormInput
                        placeholder={this.state.username + 's Room'}
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
                        backgroundColor="#03A9F4"
                        title="Create Room"
                        onPress={() => {
                            this._MakeRoomDB(this.state.roomname,this.state.coffeeshop,
                                this.state.roomsize,this.state.dropoffloc,this.state.dropofftime,
                                firebase.auth().currentUser.uid);

                            this.props.navigation.navigate('Create_SecondScreen')} 
                        }
                        style={{
                            width: 80
                        }}
                    />
                </Card>
            </View>
        }
}

class Create_SecondScreen extends Component {

_DeleteRoomDB(uid){
    firebase.database().ref('rooms/' + uid).remove()
}

    render(){
        return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card title='View Room'>

                    <Button
                        backgroundColor="#03A9F4"
                        title="Delete Room"
                        onPress={() => {
                            this._DeleteRoomDB(firebase.auth().currentUser.uid)

                            this.props.navigation.navigate('Create_FirstScreen')
                        }}
                        style={{
                            width: 80
                        }}
                    />
                </Card>
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

