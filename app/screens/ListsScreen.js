
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    AsyncStorage,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import { Button } from '../components/Button.js';
import { Slide } from '../parents/Slide.js';
import { Header } from '../components/Header.js';
import { Pager } from '../components/Pager.js';
import { RoleView } from '../components/RoleView.js';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import Rules from '../misc/rules.json';
import Menus from '../misc/menus.json';
import firebase from '../firebase/FirebaseController.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 100;
const FADEIN_ANIM = 300;

class General extends Component {

    constructor(props) {
        super(props);

        this.height = Dimensions.get('window').height
    }

    //TODO: Create button in bottom left
    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
        this.props.screenProps.quit();
    }

    render(){
        return <View>

            <Button
                horizontal = {0.4}
                margin = {10}
                onPress = {()=>
                    this.props.navigation.navigate('Roles')
                }
                ><Text style = {styles.listfont}>Roles</Text>
            </Button>
                
            <Button
                horizontal = {0.4}
                margin = {10}
                onPress = {()=>
                    this.props.navigation.navigate('Menu',{menu:'rules'}) 
                }
                ><Text style = {styles.listfont}>Rulebook</Text>
            </Button>

            <Button
                horizontal = {0.4}
                onPress = {()=>{ 
                    this.props.navigation.navigate('InfoPage',{section:'about'})
                }}
                ><Text style = {styles.listfont}>About</Text>
            </Button>
            
        </View>
    }
}

export class Roles extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return <View style = {{flex:1}}>
            <RoleView/>
        </View>
    }
}

class Menu extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            menulist: [],
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }

    componentWillMount() {
        
        const { params } = this.props.navigation.state;
        const menu = params.menu;

        var keys = Object.keys(Menus[menu]).sort()
        var menulist = [];
        keys.forEach(function(key){
            menulist.push({
                type:           (Menus[menu])[key].type,
                desc:           (Menus[menu])[key].desc,
                route:          (Menus[menu])[key].route,
                key:            key,
            })
        })
        this.setState({
            menulist:   menulist,
        })
    }

    _renderMenuButton(item) {
        return <Button
            horizontal = {0.4}
            margin = {10}
            onPress = {()=>{item.type==1?
                this.props.navigation.navigate('Menu',{menu:item.route}) 
                :this.props.navigation.navigate('InfoPage',{section:item.route}) 
            }}><Text numberOfLines={1} style = {styles.listfont}>{item.desc}</Text>
        </Button>
        
    }

    //TODO back button
    render(){
        return <View style = {{backgroundColor:colors.background}}>

            <FlatList
                data={this.state.menulist}
                renderItem={({item}) => this._renderMenuButton(item) }
                keyExtractor={item => item.key}
            />

        </View>
    }
}

class InfoPage extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            infolist: [],
            title:null,

            page: 1,
            lastpage: 10,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }


    componentWillMount(){
        this._newPage(this.state.page)
    }

    _renderListItem(item) {
        if(item.type == 1){
            return <View style = {styles.detailContainer}>
                <Text style = {styles.detail}>{item.desc}</Text>
            </View>
        } else if (item.type == 2){
            return <View style = {styles.commentContainer}>
                <Text style = {styles.comment}>{item.desc}</Text>
            </View>
        } else if (item.type == 3){
            return <View style = {styles.linkContainer}><Button size = {0.15} backgroundColor = {colors.link}
                onPress = {()=>{this.props.navigation.navigate('InfoPage',{section:item.route})}}>
                <Text style = {styles.link}>{item.desc}</Text>
            </Button></View>
        }
    }

    _pageBack() {
        this._newPage(this.state.page>1?this.state.page-1:1)
    }
    _pageForward() {
        this._newPage(this.state.page<this.state.lastpage?this.state.page+1:this.state.page)
    }

    _newPage(page){
        const { params } = this.props.navigation.state;
        const section = params.section;

        var keys = Object.keys((Rules[section])[page]).sort()
        var infolist = [];
        keys.forEach(function(key){
            infolist.push({
                type:           ((Rules[section])[page])[key].type,
                desc:           ((Rules[section])[page])[key].desc,
                route:          ((Rules[section])[page])[key].route,
                key:            key,
            })
        })
        this.setState({
            infolist:   infolist,
            section:    section,
            page:       page,
            title:      (Rules.headers)[section],
            lastpage:       Object.keys(Rules[section]).length,
        })
    }

    render(){
        return <View style = {{ flex:1, alignItems:'center' }}>

            <Header title = {this.state.title} onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back());
            }}/>
            
            <View style = {{flex:1, width:this.width*0.8, backgroundColor:colors.font,borderRadius:15}}>
                <FlatList
                    data={this.state.infolist}
                    renderItem={({item}) => this._renderListItem(item) }
                    keyExtractor={item => item.key}
                />
            </View>

            <TouchableOpacity style = {{position:'absolute', left:0, top:0, bottom:0, width:this.width*0.13}}
                onPress = {()=>{ this._pageBack() }}/>

            <TouchableOpacity style = {{position:'absolute', right:0, top:0, bottom:0, width:this.width*0.13}}
                onPress = {()=>{ this._pageForward() }}/>

        </View>
    }
}

export const RuleBook = StackNavigator(
    {
      General: {
        screen: General,
      },
      Roles: {
        screen: Roles,
      },
      Menu: {
        screen: Menu,
      },
      InfoPage: {
        screen: InfoPage,
      },
    },
    {
      initialRouteName: 'General',
      headerMode: 'none',
      cardStyle: {backgroundColor: 'transparent', justifyContent:'center'}
    }
  );
