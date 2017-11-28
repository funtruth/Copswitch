
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
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';
import { PushButton } from '../components/PushButton.js';
import { CustomButton } from '../components/CustomButton.js';
import { Header } from '../components/Header.js';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import Rules from '../misc/rules.json';
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
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
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
                    this.props.navigation.navigate('Rulebook') 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Rulebook</Text>}
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
                    this.props.navigation.navigate('InfoPage',{section:'about'})
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>About</Text>}
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

            townSize:       new Animated.Value(0.98),
            mafiaSize:      new Animated.Value(0.01),
            neutralSize:    new Animated.Value(0.01),
            
            townOpacity:    new Animated.Value(1),
            mafiaOpacity:   new Animated.Value(0),
            neutralOpacity: new Animated.Value(0),
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
                                    category:       Rolesheet[child.key].category,
                                    count:          child.val(),
                                    image:          Rolesheet[child.key].image,
                                    color:          Rolesheet[child.key].color,
                                    key:            child.key,    
                                })
                            } else if (Rolesheet[child.key].type == 2) {
                                townlist.push({
                                    name:           Rolesheet[child.key].name,
                                    index:          Rolesheet[child.key].index,
                                    category:       Rolesheet[child.key].category,
                                    count:          child.val(),
                                    image:          Rolesheet[child.key].image,
                                    color:          Rolesheet[child.key].color,
                                    key:            child.key,    
                                })
                            } else {
                                neutrallist.push({
                                    name:           Rolesheet[child.key].name,
                                    index:          Rolesheet[child.key].index,
                                    category:       Rolesheet[child.key].category,
                                    count:          child.val(),
                                    image:          Rolesheet[child.key].image,
                                    color:          Rolesheet[child.key].color,
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
                            category:       Rolesheet[key].category,
                            image:          Rolesheet[key].image,
                            color:          Rolesheet[key].color,
                            key:            key,
                        })
                    } else if (Rolesheet[key].type == 2) {
                        townlist.push({
                            name:           Rolesheet[key].name,
                            index:          Rolesheet[key].index,
                            category:       Rolesheet[key].category,
                            image:          Rolesheet[key].image,
                            color:          Rolesheet[key].color,
                            key:            key,
                        })
                    } else {
                        neutrallist.push({
                            name:           Rolesheet[key].name,
                            index:          Rolesheet[key].index,
                            category:       Rolesheet[key].category,
                            image:          Rolesheet[key].image,
                            color:          Rolesheet[key].color,
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
            Animated.parallel([
                Animated.timing(
                    this.state.townOpacity, {
                        duration: FADEOUT_ANIM,
                        toValue: 0
                }),
                Animated.timing(
                    this.state.mafiaOpacity, {
                        duration: FADEOUT_ANIM,
                        toValue: 0
                }),
                Animated.timing(
                    this.state.neutralOpacity, {
                        duration: FADEOUT_ANIM,
                        toValue: 0
                })
            ]),
            Animated.parallel([
                Animated.timing(
                    this.state.townSize, {
                        duration: SIZE_ANIM,
                        toValue: town?0.98:0.01
                }),
                Animated.timing(
                    this.state.mafiaSize, {
                        duration: SIZE_ANIM,
                        toValue: mafia?0.98:0.01
                }),
                Animated.timing(
                    this.state.neutralSize, {
                        duration: SIZE_ANIM,
                        toValue: neutral?0.98:0.01
                })
            ]),
            Animated.parallel([
                Animated.timing(
                    this.state.townOpacity, {
                        duration: FADEIN_ANIM,
                        toValue: town?1:0
                }),
                Animated.timing(
                    this.state.mafiaOpacity, {
                        duration: FADEIN_ANIM,
                        toValue: mafia?1:0
                }),
                Animated.timing(
                    this.state.neutralOpacity, {
                        duration: FADEIN_ANIM,
                        toValue: neutral?1:0
                })
            ])
        ]).start()
    }

    _renderTitle() {
        return <View style = {{flex:0.7, flexDirection:'row',
            justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.titleFont}>
                {Rolesheet[this.state.roleid].name}</Text>
        </View>
    }
    _renderDesc() {
        return <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.normalFont}>
                {Rolesheet[this.state.roleid].desc}</Text>
        </View>
    }
    _renderImage(){
        return <View style = {{flex:4,justifyContent:'center',alignItems:'center'}}>
            <Image 
                style={{width:200,height:200}}
                source={{uri: Rolesheet[this.state.roleid].image}}
            />
        </View>
    }
    _renderInfoBox() {
        return <View style = {{flex:3,marginLeft:10,marginRight:10}}>
            <Text style = {styles.normalFont}>{'Team: ' + Rolesheet[this.state.roleid].type}</Text>
            <Text style = {styles.normalFont}>{'Suspicious: ' + Rolesheet[this.state.roleid].suspicious}</Text>
            <Text style = {styles.normalFont}>{'Visits: ' + Rolesheet[this.state.roleid].visits}</Text>
            <Text style = {styles.normalFont}>{'Rules: ' + Rolesheet[this.state.roleid].rules}</Text>
        </View>
    }
    _renderCloseBtn() {
        return <MenuButton
            viewFlex = {1}
            flex = {0.6}
            fontSize = {20}
            title = 'CLOSE'
            onPress = {()=>{this.setState({modalVisible:false})}}
        />
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
                    <View style = {{flex:1, backgroundColor:'rgba(109, 132, 156, 0.73)',
                        justifyContent:'center',alignItems:'center'}}>
                        <TouchableWithoutFeedback>
                            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <View style = {{backgroundColor:colors.main,flex:0.9,borderRadius:10}}>
                                    {this._renderTitle()}
                                    {this._renderDesc()}
                                    {this._renderImage()}
                                    {this._renderInfoBox()}
                                    {this._renderCloseBtn()}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Header title = 'Roles' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <View style = {{position:'absolute', top:60, left:0, right:0, height:42,
                flexDirection:'row', justifyContent:'center'}}>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showtown?colors.menubtn:colors.lightbutton}
                    leftradius = {15}
                    onPress = {()=>{
                        this._viewChange(true,false,false)
                    }}
                    component = {<Text style = {this.state.showtown?
                        styles.centeredBtn:styles.centeredBtnPressed}>Town</Text>}
                />
                <View style = {{width:2, backgroundColor:colors.shadow}}/>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showmafia?colors.menubtn:colors.lightbutton}
                    radius = {0}
                    onPress = {()=>{
                        this._viewChange(false,true,false)
                    }}
                    component = {<Text style = {this.state.showmafia?
                        styles.centeredBtn:styles.centeredBtnPressed}>Mafia</Text>}
                />
                <View style = {{width:2, backgroundColor:colors.shadow}}/>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {4}
                    color = {this.state.showneutral?colors.menubtn:colors.lightbutton}
                    rightradius = {15}
                    onPress = {()=>{
                        this._viewChange(false,false,true)
                    }}
                    component = {<Text style = {this.state.showneutral?
                        styles.centeredBtn:styles.centeredBtnPressed}>Neutral</Text>}
                />
            </View>

            <View style = {{height:110}}/>

            <Animated.View style = {{flex:this.state.townSize, opacity:this.state.townOpacity}}>
                <FlatList
                    data={this.state.townlist}
                    renderItem={({item}) => (
                        <View style = {{marginBottom:10}}>
                        <CustomButton
                            size = {1}
                            flex = {0.75}
                            opacity = {1}
                            depth = {4}
                            color = {colors.lightbutton}
                            radius = {5}
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index) 
                            }}
                            component = {<View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Text style = {{
                                    color:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>}
                        /></View>
                    )}
                    style={{margin:3}}
                    numColumns = {1}
                    keyExtractor={item => item.key}/>
            </Animated.View>

            <Animated.View style = {{flex:this.state.mafiaSize, opacity:this.state.mafiaOpacity}}>
                <FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <View style = {{flex:1, marginBottom:10}}>
                            <CustomButton
                                size = {0.5}
                                flex = {0.9}
                                opacity = {1}
                                depth = {4}
                                color = {colors.lightbutton}
                                radius = {5}
                                onPress = {()=>{
                                    this._roleBtnPress(item.key,item.index) 
                                }}
                                component = {<View style = {{justifyContent:'center',alignItems:'center'}}>
                                    <Text style = {{
                                        color:colors.font,
                                        fontFamily: 'ConcertOne-Regular',
                                        fontSize:18,
                                        marginTop:5}}>{item.name}</Text>
                                    <Text style = {{
                                        color:colors.font,
                                        fontFamily: 'ConcertOne-Regular',
                                        fontSize:14,
                                        marginBottom:5}}>{item.category}</Text>
                                </View>}
                        /></View>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}/>
            </Animated.View>

            <Animated.View style = {{flex:this.state.neutralSize, opacity:this.state.neutralOpacity}}>
                <FlatList
                    data={this.state.neutrallist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index)  
                            }}
                            style = {{backgroundColor:colors.background,flex:0.33,
                                borderRadius:10, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {3}
                    keyExtractor={item => item.key}/>
            </Animated.View>
        </View>
    }
}

class Rulebook extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled:false,
        }
    }

    _buttonPress() {
        this.setState({disabled:true});
        setTimeout(() => {this.setState({disabled: false})}, 200);
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            
            <Header title = 'How to Play' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{
                    this._buttonPress();
                    this.props.navigation.navigate('InfoPage',{section:'general'}) 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>General</Text>}
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
                    this.props.navigation.navigate('Setup') 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Set Up</Text>}
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
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>My Role</Text>}
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
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Phases</Text>}
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
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Messages</Text>}
            />
        </View>
    }
}

class Setup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled:false,
        }
    }
    
    _buttonPress() {
        this.setState({disabled:true});
        setTimeout(() => {this.setState({disabled: false})}, 600);
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>

            <Header title = 'Setting Up' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back())
            }}/>

            <PushButton
                size = {0.1}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{
                    this._buttonPress();
                    this.props.navigation.navigate('InfoPage',{section:'making'}) 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Making a Room</Text>}
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
                    this.props.navigation.navigate('InfoPage',{section:'joining'}) 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Joining a Room</Text>}
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
                    this.props.navigation.navigate('InfoPage',{section:'selection'}) 
                }}
                disabled = {this.state.disabled}
                component = {<Text style = {styles.menuBtn}>Role Selection</Text>}
            />
            <View style = {{flex:0.1}}/>
        </View>
    }
}

class InfoPage extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            infolist: [],
        }
    }


    componentWillMount(){

        const { params } = this.props.navigation.state;
        const section = params.section;

        var keys = Object.keys(Rules[section]).sort()
        var infolist = [];
        keys.forEach(function(key){
            infolist.push({
                type:           (Rules[section])[key].type,
                desc:           (Rules[section])[key].desc,
                onpressroute:   (Rules[section])[key].route,
                key:            key,
            })
        })
        this.setState({infolist:infolist})
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
        }
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>

            <Header title = 'TEMPTITLE' onPress = {()=>{
                this.props.navigation.dispatch(NavigationActions.back());
            }}/>

            <View style = {{flex:0.1}}/>

            <FlatList
                data={this.state.infolist}
                renderItem={({item}) => this._renderListItem(item) }
                numColumns = {1}
                keyExtractor={item => item.key}
            />
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
      Rulebook: {
        screen: Rulebook,
      },
      Setup: {
        screen: Setup,
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
        color: colors.background,
    },
    centeredBtn: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.background,
        alignSelf:'center',
    },
    centeredBtnPressed: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
        alignSelf:'center',
    },
    menuBtn : {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center'
    },
    titleFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.main,
    },
    detail: {
        color:colors.font,
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
        color:colors.font,
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
    }
});