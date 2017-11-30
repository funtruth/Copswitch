
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    StyleSheet,
    FlatList,
    AsyncStorage,
    Keyboard,
    BackHandler,
    ActivityIndicator,
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
import randomize from 'randomatic';

export class CreationPager extends Component {

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {
            page: 1,

            roomname: params.roomname,
            alias:'',
            loading:true,
            errormessage:null,

            difficulty: null,

            dot1: new Animated.Value(1),
            dot2: new Animated.Value(0.3),
            dot3: new Animated.Value(0.3),
            dot4: new Animated.Value(0.3),
            dot5: new Animated.Value(0.3),
        };

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.nameRef        = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid)
                            .child('name');
        this.playerRef      = this.roomRef.child('playernum');
        this.difficultyRef  = this.roomRef.child('difficulty');
        this.listOfRolesRef = firebase.database().ref('listofroles').child(roomname);
        this.listPlayerRef  = this.roomRef.child('listofplayers')
        
    }

    
    componentWillMount() {
        this.nameRef.on('value',snap=>{
            this.setState({
                alias:snap.val(),
                loading:false,
            })
        })

        this.difficultyRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({
                    difficulty:snap.val()
                })
            }
        })

        BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
    }

    componentWillUnmount() {
        if(this.nameRef){
            this.nameRef.off();
        }
        if(this.difficultyRef){
            this.difficultyRef.off();
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
        const width  = Dimensions.get('window').width;
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
        Animated.timing(
            this.state.dot4, {
                toValue:1,
                duration:1000,
            }
        ).start()
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
                    this.props.refs.scrollView.scrollTo({x:this.props.width*1,y:0,animation:true})
                })
            } else {
                this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
                this.refs.nameerror.shake(800)
            }
        }
    }

    render() {

        let position = Animated.divide(this.scrollX, 360);

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
                
                <Creation1
                    roomname = {this.state.roomname}
                    width = {Dimensions.get('window').width}
                    refs = {this.refs}
                />
                <Creation2 
                    roomname = {this.state.roomname}
                    width = {Dimensions.get('window').width}
                    refs = {this.refs}
                />
                <Creation3
                    roomname = {this.state.roomname}
                    width = {Dimensions.get('window').width}
                    refs = {this.refs}
                />
                <Creation4
                    roomname = {this.state.roomname}
                    width = {Dimensions.get('window').width}
                    refs = {this.refs}
                />
                <Creation5
                    roomname = {this.state.roomname}
                    width = {Dimensions.get('window').width}
                    refs = {this.refs}
                />
            </ScrollView>

            <View style = {{flex:0.1, flexDirection:'row',
                justifyContent:'center', alignItems:'center'}}>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, opacity:this.state.dot1}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.state.dot2}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.state.dot3}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.state.dot4}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.state.dot5}}/>
            </View>
        </View>
    }
}

export class Creation1 extends Component {
 
    constructor(props) {
        super(props);

        this.state = {
            errormessage: '',
        };
    }

    _continue(name) {
        if(name && name.length>0 && name.length < 11){
            firebase.database().ref('rooms').child(this.props.roomname).child('listofplayers')
            .child(firebase.auth().currentUser.uid).update({
                name:               name,
                readyvalue:         false,
                presseduid:         'foo',
            }).then(()=>{
                this.setState({errormessage:null})
                this.props.refs.scrollView.scrollTo({x:this.props.width*1,y:0,animated:true})
            })
        } else {
            this.setState({ errormessage:'Your name must be 1 - 10 Characters' })
            this.refs.nameerror.shake(800)
        }
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center', width:this.props.width}}>
                    
            <Text style = {styles.subtitle}>What is your name?</Text>

            <Animatable.Text style = {styles.sconcerto} ref = 'nameerror'>
                {this.state.errormessage}</Animatable.Text>

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
                    autoFocus = {true}
                    value={this.state.alias}
                    onChangeText = {(text) => {this.setState({alias: text})}}
                    onSubmitEditing = {()=>{ 
                        this._continue(this.state.alias.trim());
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
                        this._continue(this.state.alias.trim());
                    }}
                    component = {<Text style = {styles.concerto}>GO</Text>}
                />
            </View>
            
            <View style = {{ flex:0.4 }}/>
        </View>
    }
}

export class Creation2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            playercount: null,
            playernum: 1,
            loading:true,
        };
    }

    componentWillMount() {
            firebase.database().ref('rooms').child(this.props.roomname)
            .child('playernum').once('value',snap=>{
                if(snap.exists()){
                    this.setState({
                        playercount: snap.val().playernum,
                        loading: false,
                    })
                } else {
                    this.setState({
                        loading:false,
                    })
                }
                    
            })
    }

    _digit(digit) {
        if(this.state.playercount){
            if(this.state.playercount.length > 1){
                this.refs.error.shake(800)
            } else if (Number(this.state.playercount + digit.toString()>15)) {
                this.refs.error.shake(800)
            } else {
                this.setState({
                    playercount: this.state.playercount + digit.toString()
                })
            }
        } else {
            this.setState({
                playercount: digit
            })
        }
    }
    _backspace() {
        this.setState({ playercount: null })
    }
    _done() {
        if(!this.state.playercount || this.state.playercount < 6 || this.state.playercount > 15){
            this.refs.error.shake(800)
            this.setState({playercount:null})
        } else {
            firebase.database().ref('rooms').child(this.props.roomname).update({
                playernum: Number(this.state.playercount)
            }).then(()=>{
                this.props.refs.scrollView.scrollTo({x:this.props.width*2,y:0,animated:true})
            })
        }
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, 
            width:this.props.width}}>

            <View style = {{flex:0.35, justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.5, flexDirection:'row'}}>
                    <TouchableOpacity style = {styles.digit} >
                        <Text style = {[styles.bigconcerto,{color:colors.menubtn}]}>
                            {this.state.playercount?this.state.playercount:'?'}</Text>
                    </TouchableOpacity>
                </View>
                <Text style = {[styles.subtitle,{marginTop:5}]}>How many Players?</Text>
            </View>

            <View style = {{flex:0.6, justifyContent:'center', alignItems:'center',
                marginLeft:10, marginRight:10, borderRadius:2, paddingTop:5, paddingBottom:5}}>
                <Animatable.Text style = {styles.sconcerto}ref='error'>
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
                            this._done()
                        }}
                        component = {<Text style={styles.concerto}>DONE</Text>}/>
                </View>
            </View>
            <View style = {{flex:0.05}}/>

        </View>
    }
}

export class Creation3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            difficulty:null,
        }
    }

    _selectDifficulty(difficulty) {
        firebase.database().ref('rooms').child(this.props.roomname).update({
            difficulty: difficulty
        }).then(()=>{
            this.setState({difficulty:difficulty})
            this.props.refs.scrollView.scrollTo({x:this.props.width*3,y:0,animated:true})
        })
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width: this.props.width}}>

                <View style = {{flex:0.1,backgroundColor:colors.background, 
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.subtitle}>
                        {'How experienced' + '\n' + 'is your Group?'}</Text>
                </View>
                <View style = {{flex:0.09}}/>
                <CustomButton size = {0.25} flex = {0.8} depth = {10} radius = {20}
                    color = {this.state.difficulty==1?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==1?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(1) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <Text style = {styles.concerto}>New</Text>
                        <Text style = {styles.sconcerto}>
                            {'We are just trying out' + '\n' + 'Mafia for the first time!'}</Text>
                    </View>}
                />
                <View style = {{flex:0.04}}/>
                <CustomButton size = {0.25} flex = {0.8} depth = {10} radius = {20}
                    color = {this.state.difficulty==2?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==2?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(2) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                    </View><Text style = {styles.concerto}>Average</Text>
                        <Text style = {styles.sconcerto}>
                            {'We play once and a while' + '\n' + 'and know most of the roles.'}</Text>
                    </View>}
                />
                <View style = {{flex:0.04}}/>
                <CustomButton size = {0.25} flex = {0.8} depth = {10} radius = {20}
                    color = {this.state.difficulty==3?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==3?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(3) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                    </View><Text style = {styles.concerto}>Experts</Text>
                        <Text style = {styles.sconcerto}>
                            {'We play very frequently' + '\n' + 'and enjoy complicated gameplay.'}</Text>
                    </View>}
                />
                <View style = {{flex:0.03}}/>


        </View>
    }
}

export class Creation4 extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            townlist: [],
            mafialist: [],
            neutrallist: [],

            showtown:    true,
            showmafia:   false,
            showneutral: false,
        }  
    }

    componentWillMount() {

        this.listOfRoles = firebase.database().ref('listofroles').child(this.props.roomname)
        this.listOfRoles.on('value',snap=>{
            if(snap.exists()){
                var mafialist = this.state.mafialist;
                var townlist = this.state.townlist;
                var neutrallist = this.state.neutrallist;
                snap.forEach((child)=>{
                    if(Rolesheet[child.key].type == 1){
                        mafialist[Rolesheet[child.key].index]['count'] = child.val()
                    } else if (Rolesheet[child.key].type == 2) {
                        townlist[Rolesheet[child.key].index]['count'] = child.val()
                    } else {
                        neutrallist[Rolesheet[child.key].index]['count'] = child.val()
                    }
                })
                this.setState({
                    ownermode:true,
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist
                })
            } else {
                this.setState({ownermode:false})
            }
        })
        

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
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
                    key:            key,
                })
            } else {
                neutrallist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    difficulty:     Rolesheet[key].difficulty,
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

    componentWillUnmount(){
        if(this.listOfRoles){
            this.listOfRoles.off();
        }
    }

    _roleBtnPress(key,index,count) {
        if(count>0){
            this.listOfRoles.child(key).transaction((count)=>{
                return count - 1;
            })
        } else {
            this.listOfRoles.child(key).transaction((count)=>{
                return count + 1;
            })
        }
    }

    render() {

        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width:Dimensions.get('window').width}}>

            <View style = {{flex:1, justifyContent:'center', marginLeft:4, marginRight:4}}>

                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6, 
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showtown:true,
                            showmafia:false,
                            showneutral:false,
                        })
                    }} >
                    <Text style = {styles.mdconcerto}>Town</Text>
                </TouchableOpacity>
    
                {!this.state.showtown? null: <View style = {{flex:0.7}}><FlatList
                    data={this.state.townlist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:(
                                item.difficulty==this.state.difficulty?colors.color2:colors.disabled),
                                flex:0.5, borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
    
                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6, 
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showmafia:true,
                            showtown:false,
                            showneutral:false,
                        }) 
                    }} >
                    <Text style = {styles.mdconcerto}>Mafia</Text>
                </TouchableOpacity>
    
                {!this.state.showmafia?null:<View style = {{flex:0.7}}><FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:colors.color2,flex:0.5,
                                borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
    
                <TouchableOpacity
                    style = {{backgroundColor:colors.font, borderRadius:2,
                        justifyContent:'center', alignItems:'center',
                        marginBottom:3, marginTop:3, marginLeft:6, marginRight:6,  
                        flex:0.075}}
                    onPress = {()=>{
                        this.setState({
                            showneutral:true,
                            showtown:false,
                            showmafia:false,
                        })
                    }} >
                    <Text style = {styles.mdconcerto}>Neutral</Text>
                </TouchableOpacity>
    
                {!this.state.showneutral?null:<View style = {{flex:0.7}}><FlatList
                    data={this.state.neutrallist}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress = {()=>{
                                this._roleBtnPress(item.key,item.index,item.count)  
                            }}
                            style = {{backgroundColor:item.count?colors.main:colors.color2,flex:0.5,
                                borderRadius:2, margin:3}}>
                            <View style = {{justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    style={{width:70,height:70}}
                                    source={{uri: Rolesheet[item.key].image}}
                                />
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:18}}>{item.name}</Text>
                                <Text style = {{
                                    color:item.count?colors.background:colors.font,
                                    fontFamily: 'ConcertOne-Regular',
                                    fontSize:14,
                                    marginBottom:5}}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={{margin:3}}
                    numColumns = {2}
                    keyExtractor={item => item.key}
                />
                </View>}
            </View>
        </View>
    }
}

export class Creation5 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            starting:false,

            namelist:[],

            players:null,       //ListOfPlayers count
            playernum: null,    //Creation2 number
            rolecount:null,     //ListOfRoles count

            warning1:           true,
            warning1Opacity:    new Animated.Value(1),
            warning1Size:       new Animated.Value(0.05),
            warning2:           true,
            warning2Opacity:    new Animated.Value(1),
            warning2Size:       new Animated.Value(0.05),
            start:              false,
            startOpacity:       new Animated.Value(0),
            startSize:          new Animated.Value(0.005),
        };
        
    }

    componentWillMount() {
           
        this.listofplayersRef = firebase.database().ref('rooms').child(this.props.roomname).child('listofplayers')
        this.listofplayersRef.on('value',snap=>{
            var list = [];
            snap.forEach((child)=> {
                list.push({
                    name: child.val().name,
                    key: child.key,
                })
            })
            this.setState({
                namelist:list,
                players:snap.numChildren(),
                loading:false
            })

            if(snap.numChildren() == this.state.playernum){
                this.setState({warning2:false})
                this._viewChange(this.state.warning1,false)
            } else {
                this.setState({warning2:true})
                this._viewChange(this.state.warning1,true)
            }
        })

        this.playernumRef = firebase.database().ref('rooms').child(this.props.roomname).child('playernum')
        this.playernumRef.on('value',snap=>{
            this.setState({
                playernum: snap.val(),
            })

            if(snap.val() == this.state.players){
                this.setState({warning2:false})
                this._viewChange(this.state.warning1,false)
            } else {
                this.setState({warning2:true})
                this._viewChange(this.state.warning1,true)
            }
            if(snap.val() == this.state.rolecount){
                this.setState({warning1:false})
                this._viewChange(false,this.state.warning2)
            } else {
                this.setState({warning1:true})
                this._viewChange(true,this.state.warning2)
            }
        })

        this.listOfRolesRef = firebase.database().ref('listofroles').child(this.props.roomname)
        this.listOfRolesRef.on('value',snap=>{
            if(snap.exists()){
                var rolecount = 0;
                snap.forEach((child)=>{
                    rolecount = rolecount + child.val();
                })
                this.setState({rolecount:rolecount})

                if(rolecount == this.state.playernum){
                    this.setState({warning1:false})
                    this._viewChange(false,this.state.warning2)
                } else {
                    this.setState({warning1:true})
                    this._viewChange(true,this.state.warning2)
                }
            }
        })
        

        
    }

    componentWillUnmount() {
        if(this.listOfRolesRef){
            this.listOfRolesRef.off();
        }
        if(this.listofplayersRef){
            this.listofplayersRef.off();
        }
        if(this.playernumRef){
            this.playernumRef.off();
        }
    }

    _startGame(roomname) {
        AsyncStorage.setItem('GAME-KEY',roomname);
        
        this._handOutRoles(roomname);

        this.setState({starting:true})

        setTimeout(()=>{
            firebase.database().ref('rooms').child(roomname).child('phase').set(2).then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Mafia',
                        action: NavigationActions.navigate({ 
                            routeName: 'MafiaRoom',
                            params: {roomname:roomname}
                        })
                    })
                )
            })
        },2000)
    }

    _handOutRoles(roomname){
        
        var randomstring = '';
        var charcount = 0;

        firebase.database().ref('listofroles/' + roomname).once('value',snap=>{

            snap.forEach((child)=>{
                for(i=0;i<child.val();i++){
                    randomstring = randomstring + randomize('?', 1, {chars: child.key})
                    charcount++
                }
            })

            var min = Math.ceil(1);
            var max = Math.ceil(charcount);

            this.listofplayersRef.once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    var randomrole = randomstring.charAt(randomnumber-1);

                    this.listofplayersRef.child(child.key).update({
                        roleid:         randomrole,
                        charges:        Rolesheet[randomrole].charges,
                        suspicious:     Rolesheet[randomrole].suspicious,
                        type:           Rolesheet[randomrole].type,
                    })

                    if(randomrole == randomrole.toLowerCase()){
                        firebase.database().ref('rooms/' + roomname + '/mafia/' 
                        + child.key).update({
                            roleid:randomrole,
                            name: child.val().name,
                            alive: true,
                        })
                    }
                    
                    max = max - 1;
                    randomstring = randomstring.slice(0,randomnumber-1) + randomstring.slice(randomnumber);
                })
            })

        })
    }

    _viewChange(warning1,warning2) {
        Animated.timing(
            this.state.warning1Size, {
                duration: 600,
                toValue: warning1?0.05:0.005
        }).start(),
        Animated.timing(
            this.state.warning1Opacity, {
                duration: 600,
                toValue: warning1?1:0
        }).start(),
        Animated.timing(
            this.state.warning2Size, {
                duration: 600,
                toValue: warning2?0.05:0.005
        }).start(),
        Animated.timing(
            this.state.warning2Opacity, {
                duration: 600,
                toValue: warning2?1:0
        }).start(),
        Animated.timing(
            this.state.startSize, {
                duration: 600,
                toValue: (warning1 || warning2)?0.005:0.075
        }).start(),
        Animated.timing(
            this.state.startOpacity, {
                duration: 600,
                toValue: (warning1 || warning2)?0:1
        }).start()
    }

    _renderWarning1() {
        return <Animated.View 
            style = {{flex:this.state.warning1Size, opacity:this.state.warning1Opacity,
            backgroundColor:colors.color2, borderRadius:2, justifyContent:'center',
            marginLeft:10, marginRight:10, marginTop:5, marginBottom:5
            }}>
            <TouchableOpacity
                onPress = {()=>{
                    this.props.refs.scrollView.scrollTo({x:this.props.width*3,y:0,animation:true})
                }}
                disabled = {!this.state.warning1}
            >
                <Text style = {styles.sconcerto}>Role Selection does not match Room Size!</Text>
            </TouchableOpacity>
        </Animated.View>
    }
    _renderWarning2() {
        return <Animated.View 
            style = {{flex:this.state.warning2Size, opacity:this.state.warning2Opacity,
            backgroundColor:colors.color2, borderRadius:2, justifyContent:'center',
            marginLeft:10, marginRight:10, marginTop:5, marginBottom:5
            }}>
            <TouchableOpacity
                onPress = {()=>{
                    this.props.refs.scrollView.scrollTo({x:this.props.width,y:0,animation:true})
                }}
                disabled = {!this.state.warning2}
            >
                <Text style = {styles.sconcerto}>No. of Players does not match Room Size!</Text>
            </TouchableOpacity>
        </Animated.View>
    }

    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <Text style = {styles.concerto}>{item.name}</Text>
            )}
            numColumns={1}
            keyExtractor={item => item.key}
        />
    }

    _renderOptions() {
        return <Animated.View style = {{flex:this.state.startSize, opacity: this.state.startOpacity}}>
            <TouchableOpacity
                style = {{
                backgroundColor:colors.font, alignItems:'center',
                justifyContent:'center', marginLeft:10, marginRight:10, borderRadius:2}}
                onPress = {()=>{
                    this._startGame(this.props.roomname);
                }} 
                disabled = {this.state.warning1 || this.state.warning2}>
                <Text style = {styles.mdconcerto}>START GAME</Text>
            </TouchableOpacity>
        </Animated.View>
    }

    render() {

        if(this.state.starting){
            return <View style = {{
                backgroundColor: colors.background,
                flex: 1,
                justifyContent:'center'}}>
                    <ActivityIndicator size='large' color={colors.font}/>
                    <Text style = {{fontSize:23,
                    fontFamily:'ConcertOne-Regular',
                    color:colors.font,
                    alignSelf: 'center',
                    }}>Handing out Roles</Text>
                    <View style = {{flex:0.25}}/>
                </View>
        }

        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width:Dimensions.get('window').width}}>
                        
                {this._renderWarning1()}
                {this._renderWarning2()}
                
                <View style = {{flex:0.075,backgroundColor:colors.main, 
                    justifyContent:'center', alignItems:'center', borderRadius:2,
                    marginLeft:10, marginRight:10, marginTop:5, marginBottom:5}}>
                    <Text style = {styles.mdconcerto}>Players:</Text>
                </View>

                <View style = {{flex:0.51, justifyContent:'center', alignItems:'center',
                    backgroundColor:colors.color2, borderRadius:2, 
                    marginLeft:10, marginRight:10, marginTop:5, marginBottom:10}}>
                    {this._renderListComponent()}
                </View>

                {this._renderOptions()}

                <View style = {{flex:0.03}}/>

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
        color: colors.font,
    },
    mdconcerto: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25, color: colors.background,
        marginTop:5, marginBottom:5
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
    bigconcerto: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
    },
    //digit concerto
    dconcerto: {
        fontSize: 25,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    dsconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    digit: {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:30,
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