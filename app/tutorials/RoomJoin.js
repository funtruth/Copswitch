
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
const AnimatedDot = Animated.createAnimatedComponent(MaterialCommunityIcons)

export class Join1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname:'',
            errormessage:'Code must be 6 Digits long',
        };
        
    }

    _continue(roomname) {
        if(roomname.length==6){
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
            this.setState({errormessage:'Code must be 6 Digits long'})
            this.refs.error.shake(800)
        }
    }
    _backspace() {
        this.setState({ roomname: null })
    }
    _digit(digit) {
        if(this.state.roomname){
            if(this.state.roomname.length > 5 ){
                this.setState({errormessage:'Code must be 6 Digits long'})
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
                readyvalue:         false,
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
        };

        this.dot1 = new Animated.Value(1);
        this.dot2 = new Animated.Value(0.3);
        this.width = Dimensions.get('window').width

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
        firebase.database().ref('rooms').child(this.state.roomname).remove().then(()=>{
            this.props.navigation.dispatch(NavigationActions.back({key:'Room'}));
            return true
        })  
    }

    _pagingEnabled(position){
        const width  = this.width;
        const half   = width/2;
        const clip   = position%width;
        const rev    = width - clip;
        if(clip>half){
            this.refs.scrollView.scrollTo({x:position+rev, animated:true})
        } else {
            this.refs.scrollView.scrollTo({x:position-clip, animated:true})
        }
    }

    _handleScroll(position) {
        Animated.parallel([
            Animated.timing(
                this.dot1, {
                    toValue:position<181?1:0.3,
                    duration:50,
                } 
            ),
            Animated.timing(
                this.dot2, {
                    toValue:position>180 && position<500?1:0.3,
                    duration:50,
                } 
            )
        ]).start()
    }

    _continue(name) {
        if(this.state.loading){
            this.setState({errormessage:'Wi-Fi connection Required.'})
            this.refs.nameerror.shake(800)
        } else {
            if(name && name.length>0 && name.length < 11){
                firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
                .child(firebase.auth().currentUser.uid).update({
                    name:               name,
                    readyvalue:         false,
                    presseduid:         'foo',
                }).then(()=>{
                    this.setState({errormessage:null})
                    this.refs.scrollView.scrollTo({x:this.width*1,y:0,animation:true})
                })
            } else {
                this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
                this.refs.nameerror.shake(800)
            }
        }
    }

    _transition() {
        
        this.setState({transition:true})
        Animated.timing(
            this.state.transitionOpacity,{
                toValue:1,
                duration:2000
            }
        ).start()
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background}}>
            <View style = {{flexDirection:'row', flex:0.15, justifyContent:'center',alignItems:'center'}}>
                <View style = {{flex:0.15}}/>
                <View style = {{flex:0.7, justifyContent:'center'}}> 
                    <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                </View>
                <TouchableOpacity
                    style = {{flex:0.15}}
                    onPress = {()=>{
                        firebase.database().ref('rooms').child(this.state.roomname).remove()
                        .then(()=>{
                            this.props.navigation.dispatch(NavigationActions.back());
                        })
                    }} >
                    <MaterialCommunityIcons name='close-circle'
                        style={{color:colors.menubtn,fontSize:30}}/>
                </TouchableOpacity>
            </View>

            <ScrollView style = {{flex:0.75,backgroundColor:colors.background}}
                horizontal showsHorizontalScrollIndicator={false} ref='scrollView' pagingEnabled
                scrollEventThrottle = {16}
                onScroll = {(event) => { this._handleScroll(event.nativeEvent.contentOffset.x) }}>
                
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

            <View style = {{flex:0.1, flexDirection:'row',
                justifyContent:'center', alignItems:'center'}}>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, opacity:this.dot1}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.dot2}}/>
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
                readyvalue:         false,
                presseduid:         'foo',
            }).then(()=>{
                this.setState({errormessage:null})
                this.props.refs.scrollView.scrollTo({x:this.props.width,y:0,animated:true})
            })
        } else {
            this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
            this.refs.nameerror.shake(800)
        }
        
    }

    render() {
        return <View style = {{flex:0.7, justifyContent:'center', alignItems:'center',
            width:this.props.width}}>

            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.mconcerto}>You joined the Room</Text>
                <Text style = {styles.subtitle}>What is your name?</Text>
            </View>
            <View style = {{flex:0.25}}/>
            <View style = {{flex:0.12,flexDirection:'row'}}>
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
                    //autoFocus = {true}
                    value={this.state.alias}
                    onChangeText = {(text) => {this.setState({alias: text})}}
                    onSubmitEditing = {()=>{ 
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
            <Animatable.Text style = {[styles.sconcerto,{flex:0.05}]} ref = 'nameerror'>
                {this.state.errormessage}</Animatable.Text>
            <View style = {{ flex:0.48 }}/>
        </View>
    }
}

export class Lobby2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namelist:[],
        };
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
            contentContainerStyle = {{marginTop:20, marginBottom:20}}
            numColumns={1}
            keyExtractor={item => item.key}
        />
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width:this.props.width}}>
            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.mconcerto}>You joined the Lobby</Text>
                <Text style = {[styles.concerto,{color:colors.shadow}]}>Wait for Owner to start game.</Text>
            </View>
            
            <View style = {{flex:0.8, flexDirection:'row', justifyContent:'center'}}>
                <View style = {{flex:0.7}}>
                    {this._renderListComponent()}
                </View>
            </View>

            <View style = {{flex:0.05}}/>
        </View>
    }
}


const styles = StyleSheet.create({
    roomcode: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.menubtn,
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