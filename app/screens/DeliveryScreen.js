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

    this.tasksRef = firebase.database().ref('orders/');
    const dataSauce = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
        dataSource: dataSauce
    };
  }

listenForTasks(tasksRef) {
    tasksRef.on('value', (dataSnapshot) => {
      var tasks = [];
      dataSnapshot.forEach((child) => {
        tasks.push({
          name: child.val().name,
          _key: child.key
        });
        //alert(child.key)
      });
  
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(tasks)
      });
    });
  }

_addOrder(orderuid,myuid) {

    firebase.database().ref('rooms/' + myuid)
    .set({
        orderuid
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

    this.listenForTasks(this.tasksRef);
}

_renderRow(item) {
    return (
        <View>    
        <Button 
            title="I hate ListViews"
            onPress={() => {
                alert(this.state.dataSource.getRowAndSectionCount())
            }}
                
        />
        <Text> Debugging </Text>
        </View>
    );
       }
_renderItem({item, index}) {
    return <Text>{item}</Text>;
}

render(){
    return <View>
        <FlatList
            data={this.state.dataSource}
            renderItem={this._renderItem}
        />
        <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <Text>{rowData.toString()}</Text>}
        />

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
                            this._addOrder(firebase.auth().currentUser.uid,
                                firebase.auth().currentUser.uid);
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

        <Card>
        <Button
            backgroundColor="#03A9F4"
            title="Add Order"
            onPress={() => {
                this.props.navigation.navigate('Deliver_SecondScreen');      
            }}

        />
        </Card>

        </ScrollView>
        </View>
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

