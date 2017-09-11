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

   

makeRemoteRequest = () => {

this.setState({ loading: true });

firebase.database().ref('orders/').on('value', (dataSnapshot) => {
          var tasks = [];
          dataSnapshot.forEach((child) => {
            tasks.push({
              "coffeeorder": child.val().coffeeorder,
              "_key": child.key
            });
          });
      
          this.setState({
            //data: this.state.data.cloneWithRows(tasks)
            data: tasks
          });
          
          alert(this.state.data.join('\n'))
        });
};

_addOrder(orderuid,myuid) {
    firebase.database().ref('rooms/' + myuid)
    .set({
        orderuid
    })
}

componentWillMount() {
    //Request from Firebase
    this.makeRemoteRequest();
}

render(){

    return (
        <View>
        <Card style={{
            width: 350,
            height: 400    
        }}>
        <List style={{ borderTopWidth:0, borderBottomWidth:0 }}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => <ListItem title={item.coffeeorder}/>}
                keyExtractor={item => item.key}
            />
        </List>
        </Card>

        <Card>
        <Button
            backgroundColor="#03A9F4"
            title="Add Order"
            onPress={() => {
                this.props.navigation.navigate('Deliver_SecondScreen');      
            }}
        />
        </Card>
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
    return <View>
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

