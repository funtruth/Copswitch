
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
        }

    }

    _goToRules(type) {
        this.props.navigation.navigate('Roles_Screen',{type:type})
    }


    render(){
        return <View style = {{flex:1, backgroundColor:'white'}}>

            <TouchableOpacity
                style={{flex:1,justifyContent:'center'}}
                onPress={()=>{this._goToRules(2)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:'black',
                        fontSize:30,
                        justifyContent:'center'}}>Town</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{flex:1,backgroundColor:'black',justifyContent:'center'}}
                onPress={()=>{this._goToRules(1)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:'white',
                        fontSize:30,
                        justifyContent:'center'}}>Mafia</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{flex:1,justifyContent:'center'}}
                onPress={()=>{this._goToRules(3)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:'black',
                        fontSize:30,
                        justifyContent:'center'}}>Neutral</Text>
                </View>
            </TouchableOpacity>
            
        </View>
    }
}

class Roles_Screen extends Component {
    
    constructor(props) {
        super(props);
    
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        const { params } = this.props.navigation.state;
        const type = params.type;

        this.state = {
            rolelist: dataSource,
            type: params.type,
        }

        this.listListener = firebase.database()
            .ref('listofroles/' + firebase.auth().currentUser.uid).orderByChild('roleid');
        
    }


    componentWillMount() {

        this.listListener.once('value',snap=>{
            if(snap.exists()){
                var list = [];
                snap.forEach((child)=> {
                    if(child.val().type == this.state.type){
                        list.push({
                            name: child.key,
                            desc: child.val().desc,
                            color: child.val().color,
                            count:child.val().count,
                            hideChevron:false,

                            key: child.val().roleid,
                        })
                    }
                        
                })
                this.setState({ rolelist:list })

            } else {
                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room/type')
                .once('value',outsnap=>{
                    firebase.database().ref(outsnap.val() + '/roles').once('value', deepshot => {
                        var list = [];
                        deepshot.forEach((child)=> {
                            if(child.val().type == this.state.type){
                                list.push({
                                    name: child.val().name,
                                    desc: child.val().desc,
                                    color: child.val().color,
                                    count:1,
                                    hideChevron:true,

                                    key: child.key,
                                })
                            }
                                
                        })
                        this.setState({ rolelist:list }) 
                    })
                })
            }

        })
    }

    render(){
        return <View style = {{flex:1, backgroundColor:'white'}}>

            <View style = {{flex:9}}>
            <View><FlatList
                data={this.state.rolelist}
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
      Roles_Screen: {
        screen: Roles_Screen,
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'none',
    }
  );