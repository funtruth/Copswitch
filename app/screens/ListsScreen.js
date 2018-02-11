
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
import { CustomButton } from '../components/CustomButton.js';
import { Header } from '../components/Header.js';
import { Pager } from '../components/Pager.js';
import { Desc } from '../components/Desc.js';

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

        this.state = {
            disabled:false,
        }

        this.height = Dimensions.get('window').height

        this.arr = []
        this.opacity = []
        for(var i=0;i<3;i++){
            this.arr.push(i)
            this.opacity[i] = new Animated.Value(0)
        }
    }

    //TODO: Create button in bottom left
    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
        this.props.screenProps.quit();
    }

    animate() {
        const animations = this.arr.map((item) => {
            return Animated.timing(
            this.opacity[item],
                {
                    toValue: 1,
                    duration: 150
                }
            )
        })
        Animated.stagger(80, animations).start()
    }

    componentDidMount(){
        this.animate()
    }

    render(){
        return <View style = {{justifyContent:'center', flex:1}}>

            <CustomButton
                opacity = {this.opacity[0]}
                onPress = {()=>
                    this.props.navigation.navigate('Roles')
                }
                ><Text style = {styles.listButton}>Roles</Text>
            </CustomButton>

            <CustomButton
                opacity = {this.opacity[1]}
                onPress = {()=>
                    this.props.navigation.navigate('Menu',{menu:'rules'}) 
                }
                ><Text style = {styles.listButton}>Rulebook</Text>
            </CustomButton>

            <CustomButton
                opacity = {this.opacity[2]}
                onPress = {()=>{ 
                    this.props.navigation.navigate('InfoPage',{section:'about'})
                }}
                ><Text style = {styles.listButton}>About</Text>
            </CustomButton>
            
        </View>
    }
}

class Roles extends Component {

    constructor(props) {
        super(props);

        this.state = {
            townlist: [],
            mafialist: [],
            roleid:   'a',
            index: 0,
            descVisible: false,

            showtown:    true,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }

    componentWillMount() {

        var keys = Object.keys(Rolesheet).sort()
        
        var townlist = [];
        var mafialist = [];

        keys.forEach(function(key){
            if(Rolesheet[key].type == 1){
                mafialist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    key:            key,
                })
            }
        })
        this.setState({
            mafialist:mafialist,
            townlist:townlist,
        })  
    }

    _roleBtnPress(key) {
        this.setState({roleid:key, descVisible:true})
    }

    _renderItem(item){
        return <TouchableOpacity
                style = {{ 
                    marginTop:5,
                    alignItems:'center',
                    width:this.width/2
                }}
                onPress = {()=>{ this._roleBtnPress(item.key,item.index) }}>
                <Text style = {styles.mfont}>{item.name}</Text>
            </TouchableOpacity>
    }

    render(){
        return <View style = {{flex:1, width:this.width*0.8, alignSelf:'center'}}>

            <FlatList
                data={this.state.showtown?this.state.townlist:this.state.mafialist}
                renderItem={({item}) => this._renderItem(item)}
                contentContainerStyle={{
                    alignItems:'center'
                }}
                showsVerticalScrollIndicator = {false}
                keyExtractor={item => item.key}/>
            
            <View style = {{position:'absolute', left:0, top:0, 
                width:this.width*0.2, height:this.height*0.25, 
                justifyContent:'center'}}>

                <CustomButton
                    size={0.3}
                    opacity={0.4}
                    onPress = {()=> this.props.navigation.dispatch(NavigationActions.back()) }
                >
                    <FontAwesome name='arrow-left'
                        style={{color:colors.font,fontSize:25, alignSelf:'center'}}/>
                    <Text style = {styles.mfont}>Back</Text>
                </CustomButton>
                <View style = {{flex:0.1}}/>
                <CustomButton
                    size={0.3}
                    opacity={this.state.showtown?1:0.4}
                    onPress = {()=>{ this.setState({ showtown:true }) }}
                >
                    <Foundation name='shield'
                        style={{color:colors.font,fontSize:25, alignSelf:'center'}}/>
                    <Text style = {styles.mfont}>Town</Text>
                </CustomButton>
                
                <CustomButton
                    size={0.3}
                    opacity={this.state.showtown?0.4:1}
                    onPress = {()=>{ this.setState({ showtown:false }) }}
                >
                    <Foundation name='skull'
                        style={{color:colors.font,fontSize:25, alignSelf:'center'}}/>
                    <Text style = {styles.mfont}>Mafia</Text>
                </CustomButton>
            </View>

            <Desc
                roleid = {this.state.roleid}
                visible = {this.state.descVisible}
                onClose = {val => this.setState({descVisible:val})}
            />

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
        return <CustomButton
            onPress = {()=>{
                item.type==1?
                    this.props.navigation.navigate('Menu',{menu:item.route}) 
                    :this.props.navigation.navigate('InfoPage',{section:item.route}) 
            }}
        ><Text style = {styles.listButton}>{item.desc}</Text>
        </CustomButton>
        
    }

    render(){
        return <View style = {{flex:1, width:this.width*0.8, 
            alignSelf:'center', alignItems:'center', justifyContent:'center'}}>

            <View style = {{width:this.width*0.7}}>
                <FlatList
                    data={this.state.menulist}
                    renderItem={({item}) => this._renderMenuButton(item) }
                    keyExtractor={item => item.key}
                />
            </View>

            <View style = {{position:'absolute', left:0, bottom:0, 
                width:this.width*0.2, height:this.height*0.23 }}>
                <CustomButton
                    opacity={0.4}
                    onPress = {()=> this.props.navigation.dispatch(NavigationActions.back()) }
                >
                    <FontAwesome name='arrow-left'
                        style={{color:colors.font,fontSize:25, alignSelf:'center'}}/>
                    <Text style = {styles.mfont}>Back</Text>
                </CustomButton>
            </View>

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
            return <View style = {styles.linkContainer}><CustomButton size = {0.15} backgroundColor = {colors.link}
                onPress = {()=>{this.props.navigation.navigate('InfoPage',{section:item.route})}}>
                <Text style = {styles.link}>{item.desc}</Text>
            </CustomButton></View>
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


export default RuleBook = StackNavigator(
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
      cardStyle: {backgroundColor: 'transparent'}
    }
  );
