
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import RulebookListItem from '../components/RulebookListItem.js';

class Mafia_Screen extends Component {
    
constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        roles: dataSource,
        loading:true,

    }

    this.listListener = firebase.database()
        .ref('listofroles/' + firebase.auth().currentUser.uid).orderByChild('roleid');
    
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
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
            .once('value',outsnap=>{
                firebase.database().ref(outsnap.val() + '/roles').once('value', deepshot => {
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
            })
        }

    })

    this.setState({loading:false})

}

render(){
    return <View style = {{flex:1, backgroundColor:'white'}}>

        <View style = {{flex:9}}>
        <View><FlatList
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
        </View>
    </View>
    }
}


class Town_Screen extends Component {
    
constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        roles: dataSource,
        loading:true,

    }

    this.listListener = firebase.database()
        .ref('listofroles/' + firebase.auth().currentUser.uid).orderByChild('roleid');
    
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
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
            .once('value',outsnap=>{
                firebase.database().ref(outsnap.val() + '/roles').once('value', deepshot => {
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
            })
        }

    })

    this.setState({loading:false})

}

render(){
    return <View style = {{flex:1, backgroundColor:'white'}}>

        <View style = {{flex:9}}>
        <View><FlatList
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
        </View>
    </View>
    }
}



class Neutral_Screen extends Component {
    
constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        roles: dataSource,
        loading:true,

    }

    this.listListener = firebase.database()
        .ref('listofroles/' + firebase.auth().currentUser.uid).orderByChild('roleid');
    
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
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
            .once('value',outsnap=>{
                firebase.database().ref(outsnap.val() + '/roles').once('value', deepshot => {
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
            })
        }

    })

    this.setState({loading:false})

}

render(){
    return <View style = {{flex:1, backgroundColor:'white'}}>

        <View style = {{flex:9}}>
        <View><FlatList
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
        </View>
    </View>
    }
}


class General_Screen extends Component {

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        mafialist: dataSource,
        townlist: dataSource,
        neutrallist: dataSource,
        
        mafiaview: false,
        townview: true,
        neutralview: false,

    }

    this.listListener = firebase.database()
        .ref('listofroles/' + firebase.auth().currentUser.uid).orderByChild('roleid');
    
}


componentWillMount() {

    this.listListener.on('value',snap=>{
        if(snap.exists()){
            var mafia = [];
            var town = [];
            var neutral = [];
            snap.forEach((child)=> {
                if(child.val().type == 1){
                    mafia.push({
                        name: child.key,
                        desc: child.val().desc,
                        color: child.val().color,
                        count:child.val().count,
                        hideChevron:false,

                        key: child.val().roleid,
                    })
                } else if (child.val().type == 2){
                    town.push({
                        name: child.key,
                        desc: child.val().desc,
                        color: child.val().color,
                        count:child.val().count,
                        hideChevron:false,

                        key: child.val().roleid,
                    })
                } else if (child.val().type == 3){
                    neutral.push({
                        name: child.key,
                        desc: child.val().desc,
                        color: child.val().color,
                        count:child.val().count,
                        hideChevron:false,

                        key: child.val().roleid,
                    })
                }
                    
            })
            this.setState({ mafialist:mafia, townlist:town, neutrallist:neutral })

        } else {
            firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
            .once('value',outsnap=>{
                firebase.database().ref(outsnap.val() + '/roles').once('value', deepshot => {
                    var mafia = [];
                    var town = [];
                    var neutral = [];
                    deepshot.forEach((child)=> {
                        if(child.val().type == 1){
                            mafia.push({
                                name: child.val().name,
                                desc: child.val().desc,
                                color: child.val().color,
                                count:1,
                                hideChevron:true,

                                key: child.key,
                            })
                        } else if (child.val().type == 2){
                            town.push({
                                name: child.val().name,
                                desc: child.val().desc,
                                color: child.val().color,
                                count:1,
                                hideChevron:true,

                                key: child.key,
                            })
                        } else if (child.val().type == 3){
                            neutral.push({
                                name: child.val().name,
                                desc: child.val().desc,
                                color: child.val().color,
                                count:1,
                                hideChevron:true,

                                key: child.key,
                            })
                        }
                            
                    })
                    this.setState({ mafialist:mafia, townlist:town, neutrallist:neutral }) 
                })
            })
        }

    })

    this.setState({loading:false})

}

render(){
    return <View style = {{flex:1, backgroundColor:'white'}}>

        <View style = {{flex:1,flexDirection:'row',backgroundColor:'black'}}>

            <TouchableOpacity style = {{flex:1,justifyContent:'center',alignItems:'center'}}
                onPress = {()=>{
                    this.setState({
                        mafiaview:true,
                        townview:false,
                        neutralview:false,
                    })  
                }}>
            <MaterialCommunityIcons 
                name="emoticon-sad" 
                style = {{height: 26,color: '#ffffff',fontSize: 20}}/>
            </TouchableOpacity>

            <TouchableOpacity style = {{flex:1,justifyContent:'center',alignItems:'center'}}
                onPress = {()=>{
                    this.setState({
                        mafiaview:false,
                        townview:true,
                        neutralview:false,
                    })
                }}>
            <MaterialCommunityIcons 
                name="emoticon-happy" 
                style = {{height: 26,color: '#ffffff',fontSize: 20}}/>
            </TouchableOpacity>

            <TouchableOpacity style = {{flex:1,justifyContent:'center',alignItems:'center'}}
                onPress = {()=>{
                    this.setState({
                        mafiaview:false,
                        townview:false,
                        neutralview:true,
                    })  
                }}>
            <MaterialCommunityIcons 
                name="emoticon-neutral" 
                style = {{height: 26,color: '#ffffff',fontSize: 20}}/>
            </TouchableOpacity>

        </View>

        <View style = {{flex:9}}>
        <View><FlatList
            data={this.state.townview?this.state.townlist:
                (this.state.mafiaview?this.state.mafialist:this.state.neutrallist)}
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
        </View>
    </View>
    }
}

export default RuleBook = StackNavigator(
    {
      Mafia_Screen: {
        screen: Mafia_Screen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="emoticon-sad" style = {{height: 26,
                color: '#ffffff',
                fontSize: 20}}/>
          ),
        }
      },
      Town_Screen: {
        screen: Town_Screen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="emoticon-happy" style = {{height: 26,
                color: '#ffffff',
                fontSize: 20}}/>
          ),
        }
      },
      Neutral_Screen: {
        screen: Neutral_Screen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="emoticon-neutral" style = {{height: 26,
                color: '#ffffff',
                fontSize: 20}}/>
          ),
        }
      },
      General_Screen: {
        screen: General_Screen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="home" style = {{height: 26,
                color: '#ffffff',
                fontSize: 20}}/>
          ),
        }
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'none',
    }
  );