
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PushButton } from '../components/PushButton.js';
import { CustomButton } from '../components/CustomButton.js';
import { Header } from '../components/Header.js';
import { Pager } from '../components/Pager.js';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import Rules from '../misc/rules.json';
import Menus from '../misc/menus.json';
import firebase from '../firebase/FirebaseController.js';

import colors from '../misc/colors.js';
import { onSignOut } from "../auth";
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

        this.messageRef         = firebase.database().ref('messages')
                                .child(firebase.auth().currentUser.uid);
        this.listOfRolesRef     = firebase.database().ref('listofroles')
                                .child(firebase.auth().currentUser.uid);
    }

    _buttonPress() {
        this.setState({disabled:true});
        setTimeout(() => {this.setState({disabled: false})}, 600);
    }

    _logOut() {
        if(firebase.auth().currentUser.isAnonymous){
            onSignOut().then(() => { 
                firebase.auth().currentUser.delete().then(()=>{
                    this.props.navigation.dispatch(
                        NavigationActions.reset({
                            index: 0,
                            key: null,
                            actions: [
                                NavigationActions.navigate({ routeName: 'SignedOut'})
                            ]
                        })
                    )
                })
            })
            
        } else {
            onSignOut().then(() => { 
                firebase.auth().signOut()
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedOut'})
                        ]
                    })
                )
            }) 
            
        }
    }

    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        this.messageRef.remove().then(()=>{
            this.listOfRolesRef.remove().then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedIn'})
                        ]
                    })
                )
            })
        })
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background}}>
            <View style = {{flex:0.1}}/>
            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{ 
                    this._buttonPress();
                    this.props.navigation.navigate('Roles');
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Roles</Text>}
            />
            <View style = {{flex:0.02}}/>
            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{
                    this._buttonPress();
                    this.props.navigation.navigate('Menu',{menu:'rules'}) 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Rulebook</Text>}
            />
            <View style = {{flex:0.35}}/>
            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{ 
                    this._buttonPress();
                    this.props.navigation.navigate('InfoPage',{section:'about'})
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>About App</Text>}
            />
            <View style = {{flex:0.02}}/>
            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{ 
                    this._deleteRoom()
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Quit</Text>}
            />
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
            modalVisible: false,

            showtown:    true,
            showmafia:   false,
            showneutral: false,

            listOpacity:    new Animated.Value(1),
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
        this.setState({roleid:key, modalVisible:true})
    }

    _viewChange(town,mafia,neutral){
        this.setState({
            showtown:town,
            showmafia:mafia,
            showneutral:neutral,
        })

        Animated.sequence([
            Animated.timing(
                this.state.listOpacity, {
                    duration: 300,
                    toValue: 0
            }),
            Animated.timing(
                this.state.listOpacity, {
                    duration: 600,
                    toValue: 1
            })
        ]).start()
    }

    _renderInfoBox() {
        return 
    }
    _renderCloseBtn() {
        return 
    }

    render(){
        return <View style = {{flex:1, backgroundColor:colors.background}}>

            <Modal
                animationType = 'fade'
                transparent
                visible = {this.state.modalVisible}
                onRequestClose = {()=>{this.setState({modalVisible:false})}} >
                <TouchableWithoutFeedback 
                    style = {{flex:1}}
                    onPress = {()=>{this.setState({modalVisible:false})}}>
                    <View style = {{flex:1, backgroundColor:'rgba(249, 242, 222, 0.34)',
                        justifyContent:'center',alignItems:'center'}}>
                        <TouchableWithoutFeedback>
                            <View style = {{flex:0.5,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <View style = {{backgroundColor:colors.lightbutton,flex:0.9,borderRadius:10}}>
                                    <View style = {{flex:0.15, flexDirection:'row',
                                        justifyContent:'center',alignItems:'center'}}>
                                        <Text style = {styles.titleFont}>
                                            {Rolesheet[this.state.roleid].name}</Text>
                                    </View>
                                    <View style = {{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                        <Text style = {styles.normalFont}>
                                            {Rolesheet[this.state.roleid].desc}</Text>
                                    </View>
                                    <View style = {{flex:0.55,marginLeft:10,marginRight:10}}>
                                        <Text style = {styles.normalFont}>{'Team: ' + Rolesheet[this.state.roleid].type}</Text>
                                        <Text style = {styles.normalFont}>{'Suspicious: ' + Rolesheet[this.state.roleid].suspicious}</Text>
                                        <Text style = {styles.normalFont}>{'Visits: ' + Rolesheet[this.state.roleid].visits}</Text>
                                        <Text style = {styles.normalFont}>{'Rules: ' + Rolesheet[this.state.roleid].rules}</Text>
                                    </View>
                                    <CustomButton size = {0.2} flex = {0.4} opacity = {1} depth = {6} radius = {40}
                                        color = {colors.menubtn}
                                        onPress = {()=>{this.setState({modalVisible:false})}}
                                        component = {<Text style={styles.concerto}>CLOSE</Text>}/>
                                    <View style = {{flex:0.05}}/>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Header title = 'Roles' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <View style = {{flex:0.1, flexDirection:'row', justifyContent:'center'}}>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showtown?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showtown?colors.shadow:colors.lightshadow}
                    leftradius = {30}
                    rightradius = {0}
                    onPress = {()=>{
                        this._viewChange(true,false,false)
                    }}
                    component = {<Text style = {this.state.showtown?
                        styles.centeredBtn:styles.centeredBtnPressed}>Town</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showmafia?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showmafia?colors.shadow:colors.lightshadow}
                    radius = {0}
                    onPress = {()=>{
                        this._viewChange(false,true,false)
                    }}
                    component = {<Text style = {this.state.showmafia?
                        styles.centeredBtn:styles.centeredBtnPressed}>Mafia</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.3}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showneutral?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showneutral?colors.shadow:colors.lightshadow}
                    rightradius = {30}
                    leftradius = {0}
                    onPress = {()=>{
                        this._viewChange(false,false,true)
                    }}
                    component = {<Text style = {this.state.showneutral?
                        styles.centeredBtn:styles.centeredBtnPressed}>Neutral</Text>}
                />
            </View>

            <Animated.View style = {{flex:0.9, opacity:this.state.listOpacity, 
                marginLeft:10, marginRight:10}}>
                <FlatList
                    data={this.state.showtown?this.state.townlist:
                        (this.state.showmafia?this.state.mafialist:this.state.neutrallist)}
                    renderItem={({item}) => (
                        <View style = {{flex:1, flexDirection:'row',justifyContent:'center'}}>
                            <View style = {{flex:1, backgroundColor:colors.lightbutton, 
                                borderRadius:40,justifyContent:'center', margin:5}}>
                                <TouchableOpacity
                                    style = {{ justifyContent:'center', alignItems:'center'}}
                                    onPress = {()=>{ this._roleBtnPress(item.key,item.index) }}>
                                    <Text style = {{ color:colors.font, fontFamily: 'ConcertOne-Regular',
                                        fontSize:20, marginTop:8, marginBottom:8}}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    style={{margin:3}}
                    numColumns = {1}
                    keyExtractor={item => item.key}/>
            </Animated.View>

            <View style = {{flex:0.1}}/>
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
    }

    _buttonPress() {
        this.setState({disabled:true});
        setTimeout(() => {this.setState({disabled: false})}, 200);
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
        return <View style={{marginTop:5,marginBottom:5}}><PushButton
            size = {1}
            opacity = {1}
            depth = {8}
            color = {colors.menubtn}
            radius = {50}
            onPress = {()=>{
                this._buttonPress();
                item.type==1?
                    this.props.navigation.navigate('Menu',{menu:item.route}) 
                    :this.props.navigation.navigate('InfoPage',{section:item.route}) 
            }}
            disabled = {this.state.disabled}
            component = {<Text style = {styles.flatListBtn}>{item.desc}</Text>}
        /></View>
        
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background}}>
            
            <Header title = {this.state.title} onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <View style = {{flex:0.9, justifyContent:'center'}}>
                <FlatList
                    data={this.state.menulist}
                    renderItem={({item}) => this._renderMenuButton(item) }
                    numColumns = {1}
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
                depth = {6} radius = {15}
                color = {colors.link} shadow = {colors.linkshadow}
                component = {<Text style = {styles.link}>{item.desc}</Text>}
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
        return <View style = {{ flex:1,backgroundColor:colors.background }}>

            <Header title = {this.state.title} onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back());
            }}/>
            
            <View style = {{flex:1, backgroundColor:colors.dshadow, borderRadius:15,
                marginLeft:15, marginRight:15, marginBottom:10}}>
                <View style = {{flex:1, backgroundColor:colors.font,borderRadius:15, marginBottom:6}}>
                    <FlatList
                        data={this.state.infolist}
                        renderItem={({item}) => this._renderListItem(item) }
                        numColumns = {1}
                        keyExtractor={item => item.key}
                    />
                </View>
            </View>

            <Pager height={this.height*0.08} 
                currentpage={this.state.page} 
                lastpage = {this.state.lastpage}
                goBack = {() => this._pageBack()}
                goForward = {() => this._pageForward()}
                finish = {() => { this.props.navigation.goBack() }}
            /> 

            <View style = {{height:50}}/>
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
    }
  );

  const styles = StyleSheet.create({
    normalFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
    },
    centeredBtn: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
    },
    centeredBtnPressed: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    menuBtn : {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center'
    },
    flatListBtn : {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center',
        marginTop:10,
        marginBottom:10
    },
    titleFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.main,
    },
    detail: {
        color:colors.dshadow,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    detailContainer: {
        borderRadius:2,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    comment: {
        color:colors.dshadow,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    commentContainer: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    link: {
        color:colors.font,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    linkContainer: {
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    }
});