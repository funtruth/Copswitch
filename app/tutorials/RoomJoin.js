
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    FlatList,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    Keyboard,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { CustomButton } from '../components/CustomButton.js';

import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';
const AnimatedDot = Animated.createAnimatedComponent(MaterialCommunityIcons);
const MENU_ANIM = 200;

export class Join1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname:'',
            errormessage:'Code must be 4 Digits long',
        };
        
    }

    _continue(roomname) {
        if(roomname.length==4){
            firebase.database().ref('rooms/' + roomname).once('value', snap => {
                if(snap.exists() && (snap.val().phase == 0)){
                    this._joinRoom(roomname)
                } else if (snap.exists() && (snap.val().phase > 0)) {
                    this.setState({errormessage:'Game has already started'})
                    this.refs.error.shake(800)
                } else {
                    this.setState({errormessage:'Invalid Room Code'})
                    this.refs.error.shake(800)
                }
            })
                
        } else {
            this.setState({errormessage:'Code must be 4 Digits long'})
            this.refs.error.shake(800)
        }
    }
    _backspace() {
        this.setState({ roomname: null })
    }
    _digit(digit) {
        if(this.state.roomname){
            if(this.state.roomname.length > 3 ){
                this.setState({errormessage:'Code must be 4 Digits long'})
                this.refs.error.shake(800)
            } else {
                this.setState({
                    roomname: this.state.roomname + digit.toString()
                })
            }
        } else {
            this.setState({
                roomname: digit.toString()
            })
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('rooms/' + roomname 
            + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                presseduid:         'foo',
        }).then(()=>{
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'LobbyTutorial',
                    action: NavigationActions.navigate({ 
                        routeName: 'LobbyPager',
                        params: {roomname:roomname}
                    })
                })
            )
        })   
    }

    render() {

        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(NavigationActions.back());
                        }} >
                        <MaterialCommunityIcons name='close-circle'
                            style={{color:colors.shadow,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flex:0.02}}/>

                <View style = {{flexDirection:'row', flex:0.1, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {[styles.concerto,{color:colors.shadow}]}>Enter the</Text>
                        <Text style = {[styles.roomcode,{color:colors.shadow}]}>ROOM CODE</Text>
                    </View>
                </View>

                <View style = {{flex:0.03}}/>

                <View style = {{flex:0.12, justifyContent:'center', 
                alignItems:'center', flexDirection:'row'}}>
                    <TextInput
                        style={{
                            backgroundColor: colors.main,
                            flex:0.7,
                            fontFamily:'ConcertOne-Regular',
                            fontSize: 40,
                            color:colors.menubtn,
                            textAlign:'center',
                            borderRadius:2,
                        }}
                        editable={false}
                        value={this.state.roomname}/>
                </View>

                <View style = {{flex:0.03}}/>

                <View style = {{flex:0.5, justifyContent:'center', alignItems:'center',
                 marginLeft:10, marginRight:10, borderRadius:2, paddingTop:5, paddingBottom:5}}>
                    <Animatable.Text style = {[styles.sconcerto,{color:colors.shadow}]}ref='error'>
                        {this.state.errormessage}</Animatable.Text>
                    <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(1) 
                            }}
                            component = {<Text style={styles.dconcerto}>1</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(2) 
                            }}
                            component = {<Text style={styles.dconcerto}>2</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(3) 
                            }}
                            component = {<Text style={styles.dconcerto}>3</Text>}/>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(4) 
                            }}
                            component = {<Text style={styles.dconcerto}>4</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(5) 
                            }}
                            component = {<Text style={styles.dconcerto}>5</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(6) 
                            }}
                            component = {<Text style={styles.dconcerto}>6</Text>}/>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(7) 
                            }}
                            component = {<Text style={styles.dconcerto}>7</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(8) 
                            }}
                            component = {<Text style={styles.dconcerto}>8</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(9) 
                            }}
                            component = {<Text style={styles.dconcerto}>9</Text>}/>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {25}
                            onPress = {()=>{
                                this._backspace()
                            }}
                            component = {<Text style={styles.concerto}>CLEAR</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.digit} radius = {25}
                            onPress = {()=>{
                                this._digit(0) 
                            }}
                            component = {<Text style={styles.dconcerto}>0</Text>}/>
                        <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                            color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {25}
                            onPress = {()=>{
                                this._continue(this.state.roomname)
                            }}
                            component = {<Text style={styles.concerto}>DONE</Text>}/>
                    </View>
                </View>

                <View style = {{flex:0.1}}/>
            </View>
        </TouchableWithoutFeedback>
    }
}


export class LobbyPager extends Component {
    
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {
            page: 1,

            roomname: params.roomname,
            alias:'',
            loading:true,

            transition: false,
            transitionOpacity: new Animated.Value(0),
            modal: false,
            modalOpacity: new Animated.Value(0),
            menuHeight: new Animated.Value(0),
        };

        this.width  = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.nameRef        = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid)
                            .child('name');
        this.listPlayerRef  = this.roomRef.child('listofplayers');
        this.phaseRef       = this.roomRef.child('phase');
        
    }

    
    componentWillMount() {
        this.nameRef.on('value',snap=>{
            this.setState({
                alias:snap.val(),
                loading:false,
            })
        })

        this.phaseRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val() == 1){
                    this._transition();
                    this.setState({transition:true})
                } else if(snap.val()>1){
                    AsyncStorage.setItem('GAME-KEY',this.state.roomname);

                    this.props.navigation.dispatch(
                        NavigationActions.navigate({
                            routeName: 'Mafia',
                            action: NavigationActions.navigate({ 
                                routeName: 'MafiaRoom',
                                params: {roomname:this.state.roomname}
                            })
                        })
                    )

                    this.setState({transition:false})
                }
            }
        })

        BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
    }

    componentWillUnmount() {
        if(this.nameRef){
            this.nameRef.off();
        }
        if(this.phaseRef){
            this.phaseRef.off();
        }
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }

    _onBackPress = () => {
        firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
        .child(firebase.auth().currentUser.uid).remove()
        .then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Room'}));
            return true
        })  
    }

    _leaveRoom() {
        firebase.database().ref('rooms').child(this.state.roomname).remove()
        .then(()=>{
            this.props.navigation.dispatch(NavigationActions.back());
        })
    }

    _menuPress() {
        if(this.state.modal){
            setTimeout(()=>{this.setState({modal:false})},MENU_ANIM)
            Animated.parallel([
                Animated.timing(
                    this.state.modalOpacity,{
                        toValue:0,
                        duration:MENU_ANIM
                    }
                ),
                Animated.timing(
                    this.state.menuHeight,{
                        toValue:0,
                        duration:MENU_ANIM
                    }
                )
            ]).start()
        } else {
            this.setState({modal:true})
            Animated.parallel([
                Animated.timing(
                    this.state.modalOpacity,{
                        toValue:1,
                        duration:MENU_ANIM
                    }
                ),
                Animated.timing(
                    this.state.menuHeight,{
                        toValue:this.height*0.3,
                        duration:MENU_ANIM
                    }
                )
            ]).start()
        }
    }

    _transition() {
        this.setState({transition:true})
        Animated.timing(
            this.state.transitionOpacity,{
                toValue:1,
                duration:MENU_ANIM
            }
        ).start()
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.shadow}}>
            <View style = {{flexDirection:'row', height:this.height*0.1, 
            justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{ this._menuPress() }}>
                    <MaterialCommunityIcons name='menu' style={{color:'white',fontSize:30}}/>
                </TouchableOpacity>
                <View style = {{flex:0.7, justifyContent:'center', borderRadius:30,
                    backgroundColor:'white'}}> 
                    <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                </View>
                <View style = {{flex:0.15}}/>
                
            </View>
            <View style = {{height:this.height*0.9}}>
                <ScrollView style = {{flex:1,backgroundColor:colors.background}}
                    horizontal showsHorizontalScrollIndicator={false} ref='scrollView' 
                    scrollEnabled = {false}>
                    <Lobby1
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                    />
                    <Lobby2 
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                    />
                </ScrollView>

                {this.state.modal?
                    <TouchableWithoutFeedback style = {{flex:1}} onPress={()=>{this._menuPress()}}>
                        <Animated.View
                        style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                        backgroundColor:'rgba(0, 0, 0, 0.5)',  alignItems:'center',
                        opacity:this.state.modalOpacity,}}>
                            <Animated.View style = {{height:this.state.menuHeight, width:this.width*0.85,
                                backgroundColor:colors.shadow, justifyContent:'center', alignItems:'center',
                                borderBottomLeftRadius:30, borderBottomRightRadius:30}}>
                                <TouchableOpacity
                                    style = {styles.optionBox}
                                    onPress = {()=>{
                                        this.refs.scrollView.scrollTo({x:0,animated:true})
                                        this._menuPress()
                                    }}>
                                    <Text style = {styles.options}>Edit Name</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {styles.optionBox}
                                    onPress = {()=>{
                                        this.refs.scrollView.scrollTo({x:this.width,animated:true})
                                        this._menuPress()
                                    }}>
                                    <Text style = {styles.options}>Lobby</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {[styles.optionBox,{backgroundColor:colors.menubtn}]}
                                    onPress = {()=>{this._leaveRoom()}}>
                                    <Text style = {[styles.options,{color:'white'}]}>Leave Room</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>:null}
            </View>

            {this.state.transition?<Animated.View
                style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                backgroundColor:colors.shadow, opacity:this.state.transitionOpacity}}>
                <ActivityIndicator size='large' color={colors.font} 
                    style = {{position:'absolute',bottom:25,right:25}}/>
            </Animated.View>:null}
        </View>
    }
}

export class Lobby1 extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            alias:null,
            errormessage:null,
        };

        this.height = Dimensions.get('window').height;
    }


    _onBackPress = () => {
        firebase.database().ref('rooms').child(this.props.roomname).child('listofplayers')
        .child(firebase.auth().currentUser.uid).remove().then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Join1'}));
            return true
        })  
    }


    _continue(name) {
        if(name && name.trim().length>0 && name.trim().length < 11){
            firebase.database().ref('rooms').child(this.props.roomname).child('listofplayers')
            .child(firebase.auth().currentUser.uid).update({
                name:               name.trim(),
                presseduid:         'foo',
            }).then(()=>{
                firebase.database().ref('rooms').child(this.props.roomname).child('ready')
                .child(firebase.auth().currentUser.uid).set(false).then(()=>{
                    this.setState({errormessage:null})
                    this.props.refs.scrollView.scrollTo({x:this.props.width,y:0,animated:true})
                })
            })
        } else {
            this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
            this.refs.nameerror.shake(800)
        }
        
    }

    render() {
        return <View style = {{flex:0.7, justifyContent:'center', alignItems:'center',
            width:this.props.width}}>

            <View style = {{height:this.height*0.13, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.mconcerto}>You joined the Room!</Text>
                <Text style = {styles.subtitle}>What is your name?</Text>
            </View>
            <View style = {{height:this.height*0.1,flexDirection:'row'}}>
                <TextInput
                    style={{
                        backgroundColor: colors.main,
                        flex:0.6,
                        fontFamily:'ConcertOne-Regular',
                        fontSize: 20,
                        color:colors.dshadow,
                        textAlign:'center',
                        borderTopLeftRadius:25,
                        borderBottomLeftRadius:25,
                    }}
                    value={this.state.alias}
                    onChangeText = {(text) => {this.setState({alias: text})}}
                    onEndEditing = {()=>{
                        this._continue(this.state.alias);
                    }}
                />
                <CustomButton
                    size = {0.2}
                    flex = {1}
                    depth = {6}
                    leftradius = {0}
                    rightradius = {25}
                    color = {colors.menubtn}
                    onPress = {()=>{
                        this._continue(this.state.alias);
                    }}
                    component = {<Text style = {styles.concerto}>GO</Text>}
                />
            </View>
            <Animatable.Text style = {[styles.sconcerto,{height:this.height*0.05}]} ref = 'nameerror'>
                {this.state.errormessage}</Animatable.Text>
            <View style = {{flex:0.5}}/>
        </View>
    }
}

export class Lobby2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namelist:[],
        };

        this.height = Dimensions.get('window').height;
        this.width  = Dimensions.get('window').width;
    }

    componentWillMount() {
        this.listofplayersRef = firebase.database().ref('rooms')
            .child(this.props.roomname).child('listofplayers')
        this.listofplayersRef.on('value',snap=>{
            var list = [];
            snap.forEach((child)=> {
                list.push({
                    name: child.val().name,
                    key: child.key,
                })
            })
            this.setState({
                namelist:list
            })
        })
    }

    componentWillUnmount() {
        if(this.listofplayersRef){
            this.listofplayersRef.off();
        }
    }


    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <Text style = {{
                    fontSize: 25,
                    fontFamily: 'ConcertOne-Regular',
                    textAlign:'center',
                    color: colors.shadow,
                    margin:5,
                }}>{item.name}</Text>
            )}
            contentContainerStyle = {{marginTop:10, marginBottom:10}}
            numColumns={1}
            keyExtractor={item => item.key}
        />
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, width:this.props.width,
            alignItems:'center'}}>
            <View style = {{height:this.height*0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.mconcerto}>You are in the Lobby</Text>
                <Text style = {[styles.concerto,{color:colors.shadow}]}>Wait for Owner to start game.</Text>
            </View>
            
            <View style = {{height:this.height*0.6, width:this.width*0.7, justifyContent:'center'}}>
                {this._renderListComponent()}
            </View>
        </View>
    }
}


const styles = StyleSheet.create({
    roomcode: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    options: {
        fontSize: 25,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
        marginTop:7,
        marginBottom:7
    },
    optionBox: {
        width:Dimensions.get('window').width*0.7, 
        borderRadius:30, 
        backgroundColor:colors.background,
        marginTop:5,
        marginBottom:5
    },
    subtitle : {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    mconcerto: {
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    bigdarkconcerto: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
    },
    dconcerto: {
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    digit: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:2,
        margin:5
    },
    digitBox: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:2,
        margin:5
    },
    symbol: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.color2, 
        borderRadius:10,
        margin:5
    },
    

});