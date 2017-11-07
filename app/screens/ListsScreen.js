
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
import colors from '../misc/colors.js';

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
        return <View style = {{flex:1,backgroundColor:colors.background}}>
        
            <TouchableOpacity
                style={{flex:1,justifyContent:'center',backgroundColor:colors.color1}}
                onPress={()=>{this._goToRules(2)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font,
                        fontSize:30,
                        justifyContent:'center'}}>Town</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{flex:1,justifyContent:'center',backgroundColor:colors.color2,}}
                onPress={()=>{this._goToRules(1)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font,
                        fontSize:30,
                        justifyContent:'center'}}>Mafia</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{flex:1,justifyContent:'center',backgroundColor:colors.color3,}}
                onPress={()=>{this._goToRules(3)}}
            >   
                <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{
                        fontFamily:'ConcertOne-Regular',
                        color:colors.font,
                        fontSize:30,
                        justifyContent:'center'}}>Neutral</Text>
                </View>
            </TouchableOpacity>
            
        </View>
    }
}

class Roles_Screen extends Component {

    static navigationOptions = {
        headerTitle: <Text style = {{fontSize:20,
            fontFamily: 'ConcertOne-Regular',
            color:colors.font,
            marginLeft:15}}>Roles</Text>,
        headerStyle: { backgroundColor: colors.headerbackground},
        headerTintColor: colors.headerfont,
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
        }
        
    }


    componentWillMount() {

        firebase.database().ref('roles').once('value', deepshot => {
            var list = [];
            deepshot.forEach((child)=> {
                if(child.val().type == this.state.type){
                    list.push({
                        name: child.val().name,
                        desc: child.val().desc,
                        color: child.val().color,
                        suspicious: child.val().suspicious,

                        key: child.key,
                    })
                }
            })
            this.setState({ rolelist:list }) 
        })

    }

    _roleBtnPress(name,key,color,suspicious) {
        AsyncStorage.getItem('OWNER-KEY',(error,result)=>{
            if(result){
                this._addRole(name,key,color,suspicious,result)
            } else {
                this.props.navigation.navigate('Character_Screen',{roleid:key})
            }
        })
    }

    _addRole(rolename,roleid,color,suspicious,roomname) {
        firebase.database().ref('listofroles/' + roomname + '/' + rolename + '/count')
            .transaction((count)=>{
                return count + 1;
            })

        firebase.database().ref('listofroles/' + roomname + '/' + rolename)
            .update({roleid:roleid,color:color,suspicious:suspicious})
    }

    render(){
        return <View style = {{flex:1, backgroundColor:colors.background}}>

            <View style = {{flex:9}}>
            <View><FlatList
                data={this.state.rolelist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.name,item.key,item.color,item.suspicious)  
                        }}>
                        <Text style = {{
                            marginTop: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            color:colors.color1,
                            fontFamily: 'ConcertOne-Regular',
                            fontSize:25}}>{item.name}</Text>
                        <Text style = {{
                            marginLeft: 10,
                            marginRight: 10,
                            color:colors.main,
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
        headerTitle: <Text style = {{fontSize:20,
            fontFamily: 'ConcertOne-Regular',
            color:colors.font,
            marginLeft:15}}>Rules</Text>,
        headerStyle: { backgroundColor: colors.headerbackground },
        headerTintColor: colors.headerfont,
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

            name:           '',
            image:          "https://firebasestorage.googleapis.com/v0/b/huddlec-4205b.appspot.com/o/murderer.png?alt=media&token=f74a146c-4321-4ab9-80e3-f5dd0907f96b",
            desc:           '',
            team:           '',
            suspicious:     '',
            blood:          '',
            visits:         '',
            rules:          '',
        }
        
        this.characterRef = firebase.database().ref('roles/' + params.roleid);
    
    }


    componentWillMount() {
        this.characterRef.on('value',snap=>{
            this.setState({
                name:       snap.val().name,
                desc:       snap.val().desc,
                image:      snap.val().image,
                team:       snap.val().type,
                suspicious: snap.val().suspicious,
                rules:      snap.val().rules,
            })
        })
    }

    componentWillUnmount() {
        if(this.characterRef){
            this.characterRef.off();
        }
    }

    render(){
        return <View style = {{ flex:1, backgroundColor:colors.background }}>
            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:25,color:colors.main}}>
                    {this.state.name}</Text>
            </View>
            <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:20,color:colors.main}}>
                    {this.state.desc}</Text>
            </View>
            <View style = {{flex:4,justifyContent:'center',alignItems:'center'}}>
                <Image 
                    style={{width:250,height:250}}
                    source={{uri: this.state.image}}
                />
            </View>
            <View style = {{flex:3,marginLeft:10}}>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:20,color:colors.main}}>
                    {'Team: ' + this.state.team}</Text>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:20,color:colors.main}}>
                    {'Suspicious: ' + this.state.suspicious}</Text>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:20,color:colors.main}}>
                    {'Visits: ' + this.state.suspicious}</Text>
                <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:20,color:colors.main}}>
                    {'Rules: ' + this.state.rules}</Text>
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
      Character_Screen: {
        screen: Character_Screen,
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'screen',
    }
  );