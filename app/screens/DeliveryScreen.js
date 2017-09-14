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
    
static navigationOptions = {
    headerTitle: 'Orders',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

constructor(props) {
    super(props);
    this.state = {

        orderuid:'',
        loading: false,

        error: null,
        refreshing: false,

        currentcups: 1,
        currentuid: '',
    }

    const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            data: dataSource
        };
  }

//Makes a request to listen to all the this.state values needed
_makeRemoteRequest = () => {

    this.setState({currentuid: firebase.auth().currentUser.uid})

    firebase.database().ref('rooms/' + firebase.auth().currentUser.uid).on('value', snapshot => {
        if (snapshot.exists()){
            this.setState({
                currentcups: snapshot.val().cups
            })
        }
    })

    this.setState({ loading: true });

    firebase.database().ref('orders/').on('value', (dataSnapshot) => {
        if(dataSnapshot.exists()){
          var tasks = [];
          dataSnapshot.forEach((child) => {
            tasks.push({
              "coffeeorder": child.val().coffeeorder,
              "drinktype": child.val().drinktype,
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
        }
        else{this.setState({
            data: []
        })}
        });
};

//Used to Add orders to your own room
//Order is removed
//Order becomes an ACTIVE Order
//Spot in room is updated with Username
//Number of spots is updated
_doesUserHaveRoom(uid,myuid,username,currentcups,drinktype,size,coffeeorder,comment) {
    firebase.database().ref('rooms/' + myuid).once('value',snapshot => {
        if (snapshot.exists()) {
            if(currentcups==1){    
                firebase.database().ref('orders/' + uid).remove().then(() => {
                    firebase.database().ref('rooms/' + myuid).update({
                        drinktype1: drinktype,
                        size1: size,
                        coffeeorder1: coffeeorder,
                        comment1: comment
                    })
                    firebase.database().ref('rooms/' + myuid).update({
                        spot1:username,
                        cups:2})
                })
            } if(currentcups==2){
                firebase.database().ref('orders/' + uid).remove().then(() => {
                    firebase.database().ref('rooms/' + myuid).update({
                        drinktype2: drinktype,
                        size2: size,
                        coffeeorder2: coffeeorder,
                        comment2: comment
                    })
                    firebase.database().ref('rooms/' + myuid).update({
                        spot2:username,
                        cups:3,})
                })
            } if (currentcups==3) {
                firebase.database().ref('orders/' + uid).remove().then(() => {
                    firebase.database().ref('rooms/' + myuid).update({
                        drinktype3: drinktype,
                        size3: size,
                        coffeeorder3: coffeeorder,
                        comment3: comment
                    })
                    firebase.database().ref('rooms/' + myuid).update({
                        spot3:username,
                        cups: 4,})
                })
            }
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
                        title={`${item.size} ${item.drinktype} ${item.coffeeorder}`}
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
                            this._doesUserHaveRoom(item._key,this.state.currentuid,
                                item.username,this.state.currentcups,item.drinktype,
                                item.size,item.coffeeorder,item.comment)
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

static navigationOptions = {
    headerTitle: 'Place an Order',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

constructor(props) {
    super(props);
    this.state = {
        username: '',
        coffeeshop: '', 
        coffeeorder: '',
        size: '',
        drinktype: '',
        dropoffloc: '',
        comment: '',
        loading: false,

        currentuid: '',
}}

//Makes an order 
_createOrder(uid,coffeeshop,coffeeorder,comment,size,dropoffloc,username,drinktype) {
    firebase.database().ref('orders/' + uid)
    .set({
        coffeeshop,
        drinktype,
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

    this.setState({currentuid:uid})

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
    let index3 = 0;
    const drinks = [
        { key: index3++, section: true, label: 'Choose a Drink' },
        { key: index3++, label: "Coffee" },
        { key: index3++, label: "Tea" },
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
                    data={drinks}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({drinktype:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Drink ..."
                            value={this.state.drinktype} />
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
                
                <View style = {{
                    width: 180,
                    marginTop: 20,
                    alignSelf: 'center'
                }}>
                <Button
                    color='#b18d77'
                    title="Create Order"
                    onPress={() => {
                        this._createOrder(this.state.currentuid,this.state.coffeeshop,
                        this.state.coffeeorder,this.state.comment,this.state.size,this.state.dropoffloc,
                        this.state.username, this.state.drinktype)

                        this.props.navigation.navigate('Deliver_FirstScreen')
                        Keyboard.dismiss()
                    }}
                    style={{
                        width: 250,
                        alignSelf: 'center'
                    }}
                />
                </View>
        </View>
}}


export default stackNav = StackNavigator(
    {
        Deliver_FirstScreen: {
            screen: Deliver_FirstScreen,
            title: 'hello',
        },
        Deliver_SecondScreen: {
            screen: Deliver_SecondScreen,
        },
    },
        {
            headerMode: 'screen',
        }
    );


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },

});