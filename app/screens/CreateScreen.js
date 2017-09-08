
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar
    //Picker
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class FirstScreen extends Component {

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

    state = { 
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',
        loading: false,
      };


    render(){
        return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Card title='Create a Room'>

                        <FormInput
                            placeholder="Placeholder's Room"
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

                                this.props.navigation.navigate('SecondScreen')} 
                            }
                            style={{
                                width: 80
                            }}
                        />
                    </Card>
                </View>
            }
}

class SecondScreen extends Component {
    render(){
        return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 30, color: 'red'}}>
                        Second Screen Stack
                    </Text>
                </View>
            }
}

export default stackNav = StackNavigator(
{
    FirstScreen: {
        screen: FirstScreen,
    },
    SecondScreen: {
        screen: SecondScreen,
    },
},
    {
        headerMode: 'none',
    }
);

