
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
    
    static navigationOptions = {
        header: null
    };

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

    static navigationOptions = {
        title: 'Roles',
        headerStyle: { backgroundColor: 'black' },
        titleStyle: { fontFamily:'ConcertOne-Regular' },
        headerTintColor: 'white',
    };

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
            room: false,
        }
        
        this.roomListener = firebase.database()
            .ref('users/' + firebase.auth().currentUser.uid + '/room');
    
        
    }


    componentWillMount() {

        this.roomListener.on('value',snap=>{
            if(snap.val().name && snap.val().phase == 1){
                firebase.database().ref('rooms/' + snap.val().name + '/owner').once('value',owner=>{
                    if(owner.val() == firebase.auth().currentUser.uid){
                        this.setState({room:true})
                    } else {
                        this.setState({room:false})
                    }
                })
            } else {
                this.setState({room:false})
            }
        })

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

                            key: child.key,
                        })
                    }
                        
                })
                this.setState({ rolelist:list }) 
            })
        })

    }

    componentWillUnmount() {
        if(this.roomListener){
            this.roomListener.off();
        }
    }

    _addRole(rolename,roleid,color) {
        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
        + '/' + rolename + '/count')
            .transaction((count)=>{
                return count + 1;
            })

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
        + '/' + rolename).update({roleid:roleid,color:color})
    }

    render(){
        return <View style = {{flex:1, backgroundColor:'white'}}>

            <View style = {{flex:9}}>
            <View><FlatList
                data={this.state.rolelist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{this.state.room?
                            this._addRole(item.name,item.key,item.color)
                            :
                            this.props.navigation.navigate('Character_Screen',{roleid:item.key})    
                        }}
                    >
                        <Text style = {{
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            color:item.color,
                            fontFamily: 'ConcertOne-Regular',
                            fontSize:25}}>{item.name}</Text>
                        <Text style = {{
                            marginLeft: 10,
                            marginRight: 10,
                            color:'black',
                            fontFamily: 'ConcertOne-Regular',
                            fontSize:18}}>{item.desc}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.key}
            /></View>
            </View>
        </View>
    }
}

class Character_Screen extends Component {

    static navigationOptions = {
        title: 'Rules',
        headerStyle: { backgroundColor: 'black' },
        headerTintColor: 'white',
    };

    constructor(props) {
        super(props);
    
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        const { params } = this.props.navigation.state;
        const roleid = params.roleid;

        this.state = {
            roleid: params.roleid,
        }
        
        this.characterRef = firebase.database().ref('Original/roles/' + params.roleid);
    
    }


    componentWillMount() {

    }

    componentWillUnmount() {

    }

    render(){
        return <View style = {{flex:1, backgroundColor:'white',justifyContent:'center'}}>
            <Text>{'future info about role ' + this.state.roleid}</Text>
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
      Character_Screen: {
        screen: Character_Screen,
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'screen',
    }
  );