
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar,
    BackHandler,
    ScrollView
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Deliver_FirstScreen extends Component {

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
                <ScrollView>
                <Card title='Order 1'>
 
                    <FormInput
                        value="Order 1"
                    />
                    
                    <Button
                        backgroundColor="#03A9F4"
                        title="Take Order"
                        onPress={() => {
                            this.props.navigation.navigate('Deliver_SecondScreen')} 
                        }
                        style={{
                            width: 80
                        }}
                    />
                </Card>

                <Card title='Order 2'>
                
                    <FormInput
                        value="Order 2"
                    />
                    
                    <Button
                    backgroundColor="#03A9F4"
                    title="Take Order"
                    onPress={() => {
                        this.props.navigation.navigate('Deliver_SecondScreen')} 
                    }
                    style={{
                        width: 80
                    }}
                />
                </Card>

                <Card title='Order 3'>
                
                    <FormInput
                        value="Order 3"
                    />
                    
                    <Button
                    backgroundColor="#03A9F4"
                    title="Take Order"
                    onPress={() => {
                        this.props.navigation.navigate('Deliver_SecondScreen')} 
                    }
                    style={{
                        width: 80
                    }}
                />
                </Card>
                </ScrollView>
            </View>
        }
}

class Deliver_SecondScreen extends Component {
    
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

                            this.props.navigation.navigate('Deliver_FirstScreen')
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
        Deliver_FirstScreen: {
            screen: Deliver_FirstScreen,
        },
        Deliver_SecondScreen: {
            screen: Deliver_SecondScreen,
        },
    },
        {
            headerMode: 'none',
        }
    );

