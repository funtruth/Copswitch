
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
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

class General_Screen extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    _goToRules(type) {
        this.props.navigation.navigate('Roles_Screen',{type:type})
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <View style = {{justifyContent:'center',flex:0.1}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',fontSize:30,color:colors.main,
                    alignSelf:'center'}}>Roles
                </Text>
            </View>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Town'
                onPress = {()=>{ this._goToRules(2)}}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Mafia'
                onPress = {()=>{ this._goToRules(1)}}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Neutral'
                onPress = {()=>{ this._goToRules(3)}}
            />
            <View style = {{flex:0.02}}/>
            <View style = {{justifyContent:'center',flex:0.08}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',fontSize:30,color:colors.main,
                    alignSelf:'center'}}>How-to-Play
                </Text>
            </View>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Rules'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Phases'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Setup'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Tutorial'
                onPress = {()=>{ }}
            />
            <View style = {{flex:0.06}}/>
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

        this.state = {
            rolelist: dataSource,
        }
        
    }


    componentWillMount() {

        const { params } = this.props.navigation.state;
        const type = params.type;

        var keys = Object.keys(Rolesheet).sort()
        var rolelist = [];
        keys.forEach(function(key){
            if(Rolesheet[key].type == type)
            rolelist.push({
                name:   Rolesheet[key].name,
                desc:   Rolesheet[key].desc,
                key:    key,
            })
        })
        this.setState({rolelist:rolelist})

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

        const { params } = this.props.navigation.state;
        const roleid = params.roleid;

        this.state = {
            roleid: params.roleid,

            name:           '',
            image:          '',
            desc:           '',
            team:           '',
            suspicious:     '',
            blood:          '',
            visits:         '',
            rules:          '',
        }
    }


    componentWillMount() {
        this.setState({
            name:           Rolesheet[this.state.roleid].name,
            image:          Rolesheet[this.state.roleid].image,
            desc:           Rolesheet[this.state.roleid].desc,
            team:           Rolesheet[this.state.roleid].type,
            suspicious:     Rolesheet[this.state.roleid].suspicious,
            blood:          Rolesheet[this.state.roleid].blood,
            visits:         Rolesheet[this.state.roleid].visits,
            rules:          Rolesheet[this.state.roleid].rules,
        })
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