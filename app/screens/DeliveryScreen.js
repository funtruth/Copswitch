import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    ScrollView,
    AsyncStorage,
    Keyboard,
    ListView,
    FlatList
}   from 'react-native';
import { Card, FormInput, List, ListItem } from "react-native-elements";

import { StackNavigator } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class Deliver_FirstScreen extends Component {
    
constructor(props) {
    super(props);
    this.state = {

        orderuid:'',
        loading: false,

        error: null,
        refreshing: false
    }

    const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            data: dataSource
        };
  }

_makeRemoteRequest = () => {

    this.setState({ loading: true });

    firebase.database().ref('orders/').on('value', (dataSnapshot) => {
          var tasks = [];
          dataSnapshot.forEach((child) => {
            tasks.push({
              "coffeeorder": child.val().coffeeorder,
              "coffeeshop": child.val().coffeeshop,
              "comment": child.val().comment,
              "_key": child.key
            });
          });
      
          this.setState({
            //data: this.state.data.cloneWithRows(tasks)
            data: tasks
          });
        });
};

_addOrder(orderuid,myuid) {
    firebase.database().ref('rooms/' + myuid)
    .set({
        orderuid
    })
}

_doesUserHaveRoom(uid,coffeeorder) {
    firebase.database().ref('rooms/' + uid).on('value',snapshot => {
        if (snapshot.exists()) {
            firebase.database().ref('orders/' + uid).remove().then(() => {
                firebase.database().ref('rooms/' + uid).update({spot1:coffeeorder})
            })
        } else {
            this.props.navigation.navigate('Create_FirstScreen');
        }
    })
}

componentWillMount() {
    //Request from Firebase
    this._makeRemoteRequest();
}

render(){

    return (
        <View style={{
            backgroundColor: '#e6ddd1',
        }}>

        <List style={{ borderTopWidth:0, borderBottomWidth:0 }}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => (
                    <ListItem 
                        title={`${item.coffeeshop} ${item.coffeeorder}`}
                        subtitle={item.comment}
                        onPress={() => {
                            this._doesUserHaveRoom(item._key,item.coffeeorder)
                        }}
                    />
                )}
                keyExtractor={item => item._key}
            />
        </List>

        <Button
            color='#8b6f4b'
            title="Place an Order"
            onPress={() => {
                this.props.navigation.navigate('Deliver_SecondScreen');      
            }}
            style={{
                width: 150,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />
        </View>
    );
}}

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
                backgroundColor: '#e6ddd1',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>

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
                    color='#8b6f4b'
                    title="Create Order"
                    onPress={() => {
                        this._createOrder(firebase.auth().currentUser.uid,this.state.coffeeshop,
                        this.state.coffeeorder,this.state.comment)

                        this.props.navigation.navigate('Deliver_FirstScreen')
                        Keyboard.dismiss()
                    }}
                />
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

