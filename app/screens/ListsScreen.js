
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    StyleSheet,
    Keyboard,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import RulebookListItem from '../components/RulebookListItem.js';

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
                style = {{color: '#ffffff',fontSize: this.state.mafiaview?30:20}}/>
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
                style = {{color: '#ffffff', fontSize: this.state.townview?30:20}}/>
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
                style = {{color: '#ffffff', fontSize: this.state.neutralview?30:20}}/>
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
      General_Screen: {
        screen: General_Screen,
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'none',
    }
  );