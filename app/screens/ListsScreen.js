
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
            neutrallist: [],
            roleid:   'a',
            index: 0,
            descVisible: false,

            showtown:    true,
            showmafia:   false,
            showneutral: false,
        }

    }

    componentWillMount() {

        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            
            if(result != null){
                this.listOfRoles = firebase.database().ref('listofroles/' + result);
                
                this.listOfRoles.on('value',snap=>{
                    if(snap.exists()){
                        var mafialist = [];
                        var townlist = [];
                        var neutrallist = [];
                        snap.forEach((child)=>{
                            if(Rolesheet[child.key].type == 1){
                                mafialist.push({
                                    name:           Rolesheet[child.key].name,
                                    index:          Rolesheet[child.key].index,
                                    key:            child.key,    
                                })
                            } else if (Rolesheet[child.key].type == 2) {
                                townlist.push({
                                    name:           Rolesheet[child.key].name,
                                    index:          Rolesheet[child.key].index,
                                    key:            child.key,    
                                })
                            } else {
                                neutrallist.push({
                                    name:           Rolesheet[child.key].name,
                                    index:          Rolesheet[child.key].index,
                                    key:            child.key,    
                                })
                            }
                        })
                        this.setState({
                            mafialist:mafialist,
                            townlist:townlist,
                            neutrallist:neutrallist
                        })
                    }
                })
            } else {
                var keys = Object.keys(Rolesheet).sort()
                
                var townlist = [];
                var mafialist = [];
                var neutrallist = [];
        
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
                    } else {
                        neutrallist.push({
                            name:           Rolesheet[key].name,
                            index:          Rolesheet[key].index,
                            key:            key,
                        })
                    }
                })
                this.setState({
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist,
                })
            }
        })

        
    }

    _roleBtnPress(key) {
        this.setState({roleid:key, descVisible:true})
    }

    render(){
        return <View style = {{flex:1, alignItems:'center'}}>

            <Header title = 'Roles' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <View style = {{flex:0.1, flexDirection:'row', justifyContent:'center', marginBottom:5}}>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showtown?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showtown?colors.shadow:colors.lightshadow}
                    leftradius = {30}
                    rightradius = {0}
                    onPress = {()=>{
                        this.setState({
                            showtown:true,
                            showmafia:false,
                            showneutral:false
                        })
                    }}
                    component = {<Text style = {this.state.showtown?
                        styles.centeredBtn:styles.centeredBtnPressed}>Town</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showmafia?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showmafia?colors.shadow:colors.lightshadow}
                    radius = {0}
                    onPress = {()=>{
                        this.setState({
                            showtown:false,
                            showmafia:true,
                            showneutral:false
                        })
                    }}
                    component = {<Text style = {this.state.showmafia?
                        styles.centeredBtn:styles.centeredBtnPressed}>Fowl</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showneutral?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showneutral?colors.shadow:colors.lightshadow}
                    rightradius = {30}
                    leftradius = {0}
                    onPress = {()=>{
                        this.setState({
                            showtown:false,
                            showmafia:false,
                            showneutral:true
                        })
                    }}
                    component = {<Text style = {this.state.showneutral?
                        styles.centeredBtn:styles.centeredBtnPressed}>Neutral</Text>}
                />
            </View>

            <View style = {{flex:0.9,paddingLeft:20,paddingRight:20}}>
                <FlatList
                    data={this.state.showtown?this.state.townlist:
                        (this.state.showmafia?this.state.mafialist:this.state.neutrallist)}
                    renderItem={({item}) => (
                        <View style = {{flex:0.5, flexDirection:'row',justifyContent:'center'}}>
                            <View style = {{flex:0.9, backgroundColor:colors.lightbutton, 
                                borderRadius:40,justifyContent:'center', margin:5}}>
                                <TouchableOpacity
                                    style = {{ justifyContent:'center', alignItems:'center'}}
                                    onPress = {()=>{ this._roleBtnPress(item.key,item.index) }}>
                                    <Text style = {{ color:colors.font, fontFamily: 'LuckiestGuy-Regular',
                                        fontSize:15, marginTop:8, marginBottom:8}}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    numColumns = {2}
                    keyExtractor={item => item.key}/>
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
            title:null,
            disabled:false,
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
            title:      (Menus.headers)[menu],
        })
    }

    _renderMenuButton(item) {
        return <CustomButton
            size = {1}
            flex = {1}
            backgroundColor = {colors.background}
            onPress = {()=>{
                item.type==1?
                    this.props.navigation.navigate('Menu',{menu:item.route}) 
                    :this.props.navigation.navigate('InfoPage',{section:item.route}) 
            }}
            disabled = {this.state.disabled}
        ><Text style = {styles.listButton}>{item.desc}</Text>
        </CustomButton>
        
    }

    render(){
        return <View style = {{flex:1, alignItems:'center'}}>
            
            <Header title = {this.state.title} onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <View style = {{flex:0.9, width:this.width*0.7}}>
                <FlatList
                    data={this.state.menulist}
                    renderItem={({item}) => this._renderMenuButton(item) }
                    keyExtractor={item => item.key}
                />
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
            return <View style = {styles.linkContainer}><CustomButton size = {0.05}
                depth = {3} radius = {15} fontSize = {15} textMargin = {5}
                color = {colors.link} shadow = {colors.linkshadow}
                title = {item.desc}
                onPress = {()=>{this.props.navigation.navigate('InfoPage',{section:item.route})}}
            /></View>
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
            
            <View style = {{flex:1, backgroundColor:colors.font,borderRadius:15}}>
                <FlatList
                    data={this.state.infolist}
                    renderItem={({item}) => this._renderListItem(item) }
                    keyExtractor={item => item.key}
                />
            </View>

            <Pager height={this.height*0.08}
                currentpage={this.state.page}
                lastpage = {this.state.lastpage}
                goBack = {() => this._pageBack()}
                goForward = {() => this._pageForward()}
                finish = {() => { this.props.navigation.goBack() }}
            /> 

        </View>
    }
}


const RuleBook = StackNavigator(
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

export default class ListScreen extends Component{

    render(){
        return <RuleBook/>
    }
}