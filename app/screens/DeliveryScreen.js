import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    AsyncStorage,
    Keyboard,
    ListView,
    FlatList,
    StyleSheet,
    TextInput
}   from 'react-native';
import { Card, FormInput, List, ListItem, Button } from "react-native-elements";
import ActionButton from "react-native-action-button";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalPicker from 'react-native-modal-picker';

import HeaderButton from '../components/HeaderButton.js';
import NormalListItem from '../components/NormalListItem.js';

import { StackNavigator, NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class ViewOrder_Screen extends Component {
    
static navigationOptions = ({navigation}) => ({

    headerTitle: 'Orders',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    },
    headerRight: 
    <HeaderButton
        title="Filter"
        onPress={() => {navigation.navigate('Filter_Screen')}}
    />
})

constructor(props) {
    super(props);
    this.currentRouteName = 'Deliverfirst';
    this.state = {

        orderuid:'',
        loading: false,

        error: null,
        refreshing: false,

        currentcups: 1,
        currentuid: firebase.auth().currentUser.uid,
        roomname: '',

        activecoffeeshop: '',
    };

    this.state = {
        data: [],
        coffeeshopfilter: null,
    };

    this.ref = firebase.database().ref('rooms/' + firebase.auth().currentUser.uid);
    this.ref2 = firebase.database().ref('orders/');

  }

//Makes a request to listen to all the this.state values needed
_makeRemoteRequest = () => {

    //Listens to the data from your Room if it exists
    this.ref.on('value', snapshot => {
        if (snapshot.exists()){
            this.setState({
                currentcups: snapshot.val().cups,
                roomname: snapshot.val().roomname,
            })
        }
    })

    firebase.database().ref('filters/' + firebase.auth().currentUser.uid).once('value',snapshot => {
        this.ref2.orderByChild("coffeeshop")
        .equalTo(snapshot.val().coffeeshop).once('value', (dataSnapshot) => {

        var tasks = [];

        dataSnapshot.forEach((child) => {
            tasks.push({
            "coffeeorder": child.val().coffeeorder,
            "drinktype": child.val().drinktype,
            "coffeeshop": child.val().coffeeshop,
            "size": child.val().size,
            "comment": child.val().comment,
            "username": child.val().username,
            "firstname":child.val().firstname,
            "lastname":child.val().lastname,
            "_key": child.key
            });
        });
    
        this.setState({
            data: tasks
        });

        }); 
    })  

};

componentWillUnmount() {
    if(this.ref){
        this.ref.off();
    }
    alert('unmounting')
}

//Used to Add orders to your own room
//Order is removed
//Order becomes an ACTIVE Order
//Spot in room is updated with Username
//Number of spots is updated
_doesUserHaveRoom(uid,myuid,username,currentcups,drinktype,size,coffeeorder,comment,myroomname) {
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
            this.props.navigation.navigate('CreateRoom_Screen');
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
                        containerStyle={{
                            marginLeft: 5,
                            
                        }}
                        title={`${item.size} ${item.drinktype} (${item.coffeeorder})`}
                        titleStyle={{
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                        subtitle={item.coffeeshop + "\n" + item.dropoffloc + "\n" 
                            + item.firstname+" "+item.lastname+" ("+item.username+")" +
                            "\n" + item.comment}
                        subtitleNumberOfLines={4}
                        subtitleStyle={{
                            color: '#decfc6'
                        }}
                        onPress={() => {
                            this._doesUserHaveRoom(item._key,this.state.currentuid,
                                item.username,this.state.currentcups,item.drinktype,
                                item.size,item.coffeeorder,item.comment,this.state.roomname)
                        }}
                    />
                )}
                keyExtractor={item => item._key}
            />
        </List>

        <ActionButton 
          buttonColor="rgba(222, 207, 198, 1)"
          onPress={() => this.props.navigation.navigate('MakeOrder_Screen')}
          icon={<MaterialIcons name="add" style={styles.actionButtonIcon }/>}
        />

      </View>
    );
}}


class MakeOrder_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Place an Order',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

constructor(props) {
    super(props);
    this.currentRouteName = 'Deliversecond';
    this.state = {
        username: '',
        firstname: '',
        lastname: '',

        activegroup: '',
        refreshflag: true,

        coffeeshop: '', 
        coffeeorder: '',
        size: '',
        drinktype: '',
        comment: '',

        loading: false,

        currentuid: '',
    }
    this.ref = null;
    this.ref2 = null;
}

//Makes an order 
_createOrder(groupid,uid,firstname,lastname,username,coffeeshop,drinktype,size,coffeeorder,dropoffloc,comment) {
    firebase.database().ref('orders/' + groupid + '/' + dropoffloc + '/' + uid)
    .set({
        firstname,
        lastname,
        username,
        coffeeshop,
        drinktype,
        size,
        coffeeorder,
        comment
    })
}

componentWillMount() {
    const uid = firebase.auth().currentUser.uid
    this.setState({currentuid:uid})

    this.ref = firebase.database().ref("users/" + uid)
    this.ref.on('value',snapshot => {
        this.setState({
            username: snapshot.val().username,
            firstname: snapshot.val().firstname,
            lastname: snapshot.val().lastname,

            activegroup: snapshot.val().activegroup,
            refreshflag: snapshot.val().refreshflag,
        })
    })

    this.ref2 = firebase.database().ref('defaults/' + uid)
    this.ref2.on('value', snapshot => {
        if(snapshot.val()._coffeeshop){
            this.setState({
                coffeeshop: snapshot.val().coffeeshop,
            })
        }
        if(snapshot.val()._coffeeorder){
            this.setState({
                coffeeorder: snapshot.val().coffeeorder,
            })
        }
        if(snapshot.val()._drinktype){
            this.setState({
                drinktype: snapshot.val().drinktype,
            })
        }
        if(snapshot.val()._size){
            this.setState({
                size: snapshot.val().size,
            })
        }
        if(snapshot.val()._dropoffloc){
            this.setState({
                dropoffloc: snapshot.val().dropoffloc,
            })
        }      
    })
}

componentWillUnmount(){
    if(this.ref){
        this.ref.off();
    }
    if(this.ref2){
        this.ref2.off();
    }
}

_resetStack(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'ViewOrder_Screen'})
                    ]
                  }));
  }

render(){

    let index = 0;
    const shops = [
        { key: index++, section: true, label: 'Coffeeshops' },
        { key: index++, label: "Tim Horton's" },
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
    let index4 = 0;
    const locations = [
        { key: index4++, section: true, label: 'Choose a Location' },
        { key: index4++, label: "room1" },
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
                                color:'#666b75',
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
                                color:'#666b75',
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
                                color:'#666b75',
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

                <ModalPicker
                    data={locations}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({dropoffloc:option.label})}}>
                        <TextInput
                            style={{
                                color:'#666b75',
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Select a Location ..."
                            value={this.state.dropoffloc} />
                </ModalPicker>

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
                    backgroundColor='#b18d77'
                    borderRadius={15}
                    color='white'
                    title="Create Order"
                    onPress={() => {
                        this._createOrder(this.state.activegroup,this.state.currentuid,this.state.firstname,
                            this.state.lastname,this.state.username,this.state.coffeeshop,
                            this.state.drinktype,this.state.size,this.state.coffeeorder,
                            this.state.dropoffloc,this.state.comment)

                        this._resetStack()
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

class Filter_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Filters',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
        coffeeorder: '',
        locationdata: dataSource,
    }

    this.coffeeshopref = firebase.database().ref('filters/' + firebase.auth().currentUser.uid)

}


_resetStack(){
    return this.props
        .navigation
        .dispatch(NavigationActions.reset(
            {
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'ViewOrder_Screen'})
            ]
            }));
  }

componentWillMount() {
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).once('value', snapshot => {
        
        firebase.database().ref('groups/' + snapshot.val().activegroup + '/coffeeshops/')
            .once('value', snapshot2 => {

                const coffeeshops = [];
                snapshot2.forEach((child)=>{
                    coffeeshops.push({name:child.key})
                })
                this.setState({locationdata:coffeeshops})
            })

    });
}

render(){

    return <View style={{
                backgroundColor: '#e6ddd1',
                flex: 1,
            }}>

                <Text style={{
                    color: '#987057',
                    marginLeft: 10,
                    marginBottom: 5,
                    marginTop: 15,
                }}>Coffeeshop</Text>
          
                <List style = {{borderBottomWidth:0, borderTopWidth: 0,}} >
                    <FlatList
                        data={this.state.locationdata}
                        renderItem={({item}) => (
                            <NormalListItem
                                title={item.name}
                                onPress = {() => {
                                    this.coffeeshopref.update({
                                        coffeeshop: item.name,
                                    });
                                    this._resetStack();
                                }}
                            />
                        
                        )}
                        keyExtractor={item => item.name} 
                    />
                  
                </List>
                
        </View>
    }
}

export default stackNav = StackNavigator(
    {
        ViewOrder_Screen: {
            screen: ViewOrder_Screen,
        },
        MakeOrder_Screen: {
            screen: MakeOrder_Screen,
        },
        Filter_Screen: {
            screen: Filter_Screen,
        },
    },
        {
            headerMode: 'screen',
            initialRoute: 'ViewOrder_Screen',
        }
    );


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },

});