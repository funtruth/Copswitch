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
    FlatList,
    StyleSheet,
    TextInput
}   from 'react-native';
import { Card, FormInput, List, ListItem } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalPicker from 'react-native-modal-picker';

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
              "size": child.val().size,
              "dropoffloc": child.val().dropoffloc,
              "comment": child.val().comment,
              "username": child.val().username,
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
            flex: 1,
            backgroundColor:'#e6ddd1'
        }}>

        <List style={{ borderTopWidth:0, borderBottomWidth:0, backgroundColor:'#b18d77' }}>
            <FlatList
                data={this.state.data}
                renderItem={({item}) => (
                    <ListItem 
                        title={`${item.size} ${item.coffeeorder}`}
                        titleStyle={{
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                        subtitle={item.coffeeshop + "\n" + item.dropoffloc + "\n" + item.comment
                            + "\n" + item.username}
                        subtitleNumberOfLines={4}
                        subtitleStyle={{
                            color: '#ece4df'
                        }}
                        onPress={() => {
                            this._doesUserHaveRoom(item._key,item.coffeeorder)
                        }}
                        rightTitle= 'Take Order'
                        rightTitleStyle={{
                            color: 'white'
                        }}
                    />
                )}
                keyExtractor={item => item._key}
            />
        </List>

        <ActionButton 
          buttonColor="rgba(222, 207, 198, 1)"
          onPress={() => this.props.navigation.navigate('Deliver_SecondScreen')}
          icon={<MaterialIcons name="add" style={styles.actionButtonIcon }/>}
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
        size: '',
        dropoffloc: '',
        comment: '',
        loading: false,
}}

_createOrder(uid,coffeeshop,coffeeorder,comment,size,dropoffloc,username) {
    firebase.database().ref('orders/' + uid)
    .set({
        coffeeshop,
        coffeeorder,
        dropoffloc,
        size,
        comment,
        username
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

    let index = 0;
    const shops = [
        { key: index++, section: true, label: 'Coffeeshops' },
        { key: index++, label: "Tim Horton's" },
        { key: index++, label: "William's" },
        { key: index++, label: "Starbucks" },
        { key: index++, label: "Second Cup" },
    ];
    let index2 = 0;
    const sizes = [
        { key: index2++, section: true, label: 'Select Size' },
        { key: index2++, label: "Small" },
        { key: index2++, label: "Medium" },
        { key: index2++, label: "Large" },
    ];

    return <View style={{
                backgroundColor: '#e6ddd1',
                flex: 1,
                justifyContent: 'center',
            }}>
                <ModalPicker
                    data={shops}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({coffeeshop:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Select a Coffeeshop ..."
                            value={this.state.coffeeshop} />
                </ModalPicker>

                <ModalPicker
                    data={sizes}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({size:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Size ..."
                            value={this.state.size} />
                </ModalPicker>

                <FormInput
                    placeholder="Coffee Order ..."
                    value={this.state.coffeeorder}
                    onChangeText={coffeeorder => this.setState({ coffeeorder })}
                    style={{
                        width: 250,
                        alignSelf: 'center'
                    }}
                />

                <FormInput
                    placeholder="Drop-off Location ..."
                    value={this.state.dropoffloc}
                    onChangeText={dropoffloc => this.setState({ dropoffloc })}
                    style={{
                        width: 250,
                        alignSelf: 'center'
                    }}
                />

                <FormInput
                    placeholder="Comments ..."
                    value={this.state.comment}
                    onChangeText={comment => this.setState({ comment })}
                    style={{
                        width: 250,
                        alignSelf: 'center'
                    }}
                />

                <Button
                    color='#b18d77'
                    title="Create Order"
                    onPress={() => {
                        this._createOrder(firebase.auth().currentUser.uid,this.state.coffeeshop,
                        this.state.coffeeorder,this.state.comment,this.state.size,this.state.dropoffloc,
                        this.state.username)

                        this.props.navigation.navigate('Deliver_FirstScreen')
                        Keyboard.dismiss()
                    }}
                    style={{
                        width: 250,
                        alignSelf: 'center'
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


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },

});