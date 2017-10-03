
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import randomize from 'randomatic';

import { Button, List, ListItem, FormInput } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
import NormalListItem from '../components/NormalListItem.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Day_Screen extends React.Component {

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    
    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname: params.roomname,
        phase: '',

        rightlist: dataSource,
        leftlist: dataSource,
    };
    
    this.roomListener = firebase.database().ref('rooms/' + roomname);

}
componentWillMount() {
 
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.roomListener.on('value',snap=>{

        //Keep Phase updated
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({phase:snap.val().phase});
        this.setState({phase:snap.val().phase});


    })

    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value', snap=>{

        var leftlist = [];
        var rightlist = [];
        var counter = 1;

        snap.forEach((child)=> {
            if((counter%2) == 1){
                leftlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            } else {
                rightlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            }
            counter++;
        })

        this.setState({leftlist:leftlist})
        this.setState({rightlist:rightlist})
    })

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.roomListener){
        this.roomListener.off();
    }

}

_handleBackButton() {
    return true;
}

_renderComponent(phase) {
    
    if(phase == 2){
        return <View><Text>2</Text></View>
    }
    if(phase == 3){
        return <View><Text>3</Text></View>
    }
    if(phase == 4){
        return <View><Text>4</Text></View>
    }
}


render() {
    return <View style = {{
        flex:1,
        backgroundColor:'white',
        flexDirection:'row',
    }}>
        <View style = {{flex:3}}/>
        <View style = {{flex:2}}>

            {this._renderComponent(this.state.phase)}

        </View>
        <View style = {{flex:3}}/>

    </View>

}
}
