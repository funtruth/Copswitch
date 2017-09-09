
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar,
    BackHandler,
    ScrollView,
    AsyncStorage,
    Keyboard
}   from 'react-native';
import { Card, FormInput } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Deliver_FirstScreen extends Component {

constructor(props) {
    super(props);
    this.state = {
        username: '',
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',

        orderuid1:'',
        loading: false,
    }
  }

_addOrder(orderuid1,myuid) {
    firebase.database().ref('rooms/' + myuid)
    .set({
        orderuid1
    })
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
                            AsyncStorage.getItem("is_there_a_room")
                            .then(res => {
                                if (res !== null) {
                                    //this._addOrder();
                                } else {
                                    this.props.navigation.navigate('Create_FirstScreen');
                                }
                            }) 
                        }}
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
                        AsyncStorage.getItem("is_there_a_room")
                            .then(res => {
                                if (res !== null) {
                                    //this._addOrder();
                                } else {
                                    this.props.navigation.navigate('Create_FirstScreen');
                                }
                            })
                    }}
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
                        AsyncStorage.getItem("is_there_a_room")
                            .then(res => {
                                if (res !== null) {
                                    //this._addOrder();
                                } else {
                                    this.props.navigation.navigate('Create_FirstScreen');
                                }
                            }) 
                    }}
                    style={{
                        width: 80
                    }}
                />
                </Card>

                <Button
                    backgroundColor="#03A9F4"
                    title="Add Order"
                    onPress={() => {
                        this.props.navigation.navigate('Deliver_SecondScreen');      
                    }}
                    style={{
                        width: 80
                    }}
                />

                </ScrollView>
            </View>
        }
}

//Second Screen is for ADDING orders with the (+) button at the bottom
//Future Update
class Deliver_SecondScreen extends Component {

constructor(props) {
    super(props);
    this.state = {
        username: '',
        coffeeshop: '', 
        coffeeorder: '',
        comment: '',
        loading: false,
}}

_createOrder(uid,coffeeshop,coffeeorder,comment) {
    firebase.database().ref('orders/' + uid)
    .set({
        coffeeshop,
        coffeeorder,
        comment
    })
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
            <Card title='Create your Order'>

                <FormInput
                    placeholder="Coffeshop..."
                    value={this.state.coffeeshop}
                    onChangeText={coffeeshop => this.setState({ coffeeshop })}
                />

                <FormInput
                    placeholder="Coffee Order..."
                    value={this.state.coffeeorder}
                    onChangeText={coffeeorder => this.setState({ coffeeorder })}
                />

                <FormInput
                    placeholder="Comments..."
                    value={this.state.comment}
                    onChangeText={comment => this.setState({ comment })}
                />

                <Button
                    backgroundColor="#03A9F4"
                    title="Create Order"
                    onPress={() => {
                        this._createOrder(firebase.auth().currentUser.uid,this.state.coffeeshop,
                        this.state.coffeeorder,this.state.comment)

                        this.props.navigation.navigate('Deliver_FirstScreen')
                        Keyboard.dismiss()
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

