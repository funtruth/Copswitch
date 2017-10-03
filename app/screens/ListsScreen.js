
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    TextInput,
    StyleSheet,
    Keyboard,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';
import { FormInput, List, ListItem, Button } from "react-native-elements";
import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import RulebookListItem from '../components/RulebookListItem.js';

export default class Roles_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Game',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: 'black',
    }
}


constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        roles: dataSource,

    }

    this.listListener = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
}


componentWillMount() {

    this.listListener.on('value',snap=>{

        if(snap.exists()){
            var roles = [];
            snap.forEach((child)=> {
                roles.push({
                    name: child.key,
                    desc: child.val().desc,
                    color: child.val().color,
                    hideChevron: false,
                    count:child.val().count,

                    key: child.val().roleid,
                })
            })
            this.setState({ roles:roles })
        } else {
            firebase.database().ref('rules').once('value', deepshot => {
                var roles = [];
                deepshot.forEach((child)=> {
                    roles.push({
                        name: child.val().name,
                        desc: child.val().desc,
                        color: child.val().color,
                        hideChevron: true,
                        count:1,

                        key: child.key,
                    })
                })
                this.setState({ roles:roles }) 
            })
        }

    })

}

render(){
    return <View><FlatList
            data={this.state.roles}
            renderItem={({item}) => (
                <RulebookListItem
                    title={item.name}
                    color= {item.color}
                    subtitle={item.desc}
                    hideChevron={item.hideChevron}
                    count={item.count}
                />

            )}
            keyExtractor={item => item.key}
        /></View>
    }
}

