
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
const MENU_ANIM = 200;
const GAME_ANIM = 1000;
import randomize from 'randomatic';

export class CreationPager extends Component {

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.state = {

            page:1,

            roomname: params.roomname,
            alias:'',
            loading:true,
            errormessage:null,

            playernum: null,
            playercount: null,
            difficulty: null,

            transition:false,
            transitionOpacity: new Animated.Value(0),
            
            modal: false,
            modalOpacity: new Animated.Value(0),
            menuHeight: new Animated.Value(0),
        };

        this.dot1           = new Animated.Value(1);
        this.dot2           = new Animated.Value(0.3);
        this.dot3           = new Animated.Value(0.3);
        this.dot4           = new Animated.Value(0.3);
        this.dot5           = new Animated.Value(0.3);

        this.height         = Dimensions.get('window').height;
        this.width          = Dimensions.get('window').width;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.nameRef        = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid)
                            .child('name');
        this.playerRef      = this.roomRef.child('playernum');
        this.difficultyRef  = this.roomRef.child('difficulty');
        this.phaseRef       = this.roomRef.child('phase');
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
        this.phaseRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val()==1){
                    this._startGame(this.state.roomname)
                }
            }
        })
        this.difficultyRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({
                    difficulty:snap.val()
                })
            }
        })
        this.playerRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({
                    playernum:snap.val()
                })
            }
        })
        this.listOfRolesRef.on('value',snap=>{
            if(snap.exists()){
                var playercount = 0;
                snap.forEach((child)=>{
                    playercount = playercount + child.val()
                })
                this.setState({
                    playercount:playercount
                })
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
        if(this.difficultyRef){
            this.difficultyRef.off();
        }
        if(this.listOfRolesRef){
            this.listOfRolesRef.off();
        }
        if(this.playerRef){
            this.playerRef.off();
        }
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }

    _onBackPress = () => {
        if(this.state.modal){
            this._menuPress()
        } else if(this.state.currentpage > 1){
            this.refs.scrollView.scrollTo({x:(this.state.currentpage-2)*this.width,animated:true})
            this.setState({currentpage:this.state.currentpage-1})
        }
        return true
    }

    _deleteRoom() {
        this.roomRef.remove()
        .then(()=>{
            this.props.navigation.dispatch(NavigationActions.back());
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

    _handleDots(position) {
        Animated.parallel([
            Animated.timing(
                this.dot1, {
                    toValue:position<180?1:0.3,
                    duration:50,
                } 
            ),
            Animated.timing(
                this.dot2, {
                    toValue:position>179 && position<540?1:0.3,
                    duration:50,
                } 
            ),
            Animated.timing(
                this.dot3, {
                    toValue:position>539 && position<900?1:0.3,
                    duration:50,
                } 
            ),
            Animated.timing(
                this.dot4, {
                    toValue:position>899 && position<1260?1:0.3,
                    duration:50,
                } 
            ),
            Animated.timing(
                this.dot5, {
                    toValue:position>1259?1:0.3,
                    duration:50,
                } 
            )
        ]).start()
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
                        toValue:this.height*0.6,
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
                duration:2000
            }
        ).start()
    }

    _updatePage(page){
        this.setState({page:page, currentpage:page})
    }

    _changePage(page){
        this.refs.scrollView.scrollTo({x:(page-1)*this.width,animated:true})
        this.setState({currentpage:page})
        this._menuPress()
    }

    _startGame(roomname) {
        AsyncStorage.setItem('GAME-KEY',roomname);
        
        this._handOutRoles(roomname);
        this._transition();

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

            this.listPlayerRef.once('value',insidesnap=>{
                insidesnap.forEach((child)=>{

                    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
                    var randomrole = randomstring.charAt(randomnumber-1);

                    this.listPlayerRef.child(child.key).update({
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
                    randomstring = randomstring.slice(0,randomnumber-1) 
                        + randomstring.slice(randomnumber);
                })
            })

        })
    }

    render() {
        return <View style = {{flex:1, backgroundColor:colors.background}}>
            <View style = {{flexDirection:'row', height:this.height*0.1, 
            justifyContent:'center', alignItems:'center', backgroundColor:colors.shadow}}>
                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{ this._menuPress() }}>
                    <MaterialCommunityIcons name='menu' style={{color:'white',fontSize:30}}/>
                </TouchableOpacity>
                <View style = {{flex:0.7, justifyContent:'center', borderRadius:30}}> 
                    <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                </View>
                <View style = {{flex:0.15}}/>
            </View>

            <View style = {{height:this.height*0.9}}>
                <ScrollView style = {{flex:1,backgroundColor:colors.background}}
                    horizontal showsHorizontalScrollIndicator={false} ref='scrollView'
                    scrollEnabled = {false}>
                    
                    <Creation1
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        updatePage = {val => this._updatePage(val)}
                    />
                    <Creation2 
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        updatePage = {val => this._updatePage(val)}
                    />
                    <Creation3
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        updatePage = {val => this._updatePage(val)}
                    />
                    <Creation4
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        playernum = {this.state.playernum}
                        playercount = {this.state.playercount}
                        updatePage = {val => this._updatePage(val)}
                    />
                    <Creation5
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        navigation = {this.props.navigation}
                    />
                </ScrollView>
                {this.state.modal?
                    <TouchableWithoutFeedback style = {{flex:1}} onPress={()=>{this._menuPress()}}>
                        <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                            backgroundColor:'rgba(0, 0, 0, 0.5)', alignItems:'center',
                            opacity:this.state.modalOpacity}}>
                            <Animated.View style = {{height:this.state.menuHeight, width:this.width*0.85,
                                backgroundColor:colors.shadow, justifyContent:'center', alignItems:'center',
                                borderBottomLeftRadius:30, borderBottomRightRadius:30}}>
                                <TouchableOpacity
                                    style = {styles.optionBox}
                                    onPress = {()=>{ this._changePage(1) }}>
                                    <Text style = {styles.options}>Edit Name</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {this.state.page<2?styles.disabledBox:styles.optionBox}
                                    onPress = {()=>{ this.state.page<2?{}:this._changePage(2) }}>
                                    <Text style = {styles.options}># of Players</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {this.state.page<3?styles.disabledBox:styles.optionBox}
                                    onPress = {()=>{ this.state.page<3?{}:this._changePage(3) }}>
                                    <Text style = {styles.options}>Difficulty</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {this.state.page<4?styles.disabledBox:styles.optionBox}
                                    onPress = {()=>{ this.state.page<4?{}:this._changePage(4) }}>
                                    <Text style = {styles.options}>Select Roles</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {this.state.page<5?styles.disabledBox:styles.optionBox}
                                    onPress = {()=>{ this.state.page<5?{}:this._changePage(5) }}>
                                    <Text style = {styles.options}>Lobby</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {[styles.optionBox,{backgroundColor:colors.menubtn}]}
                                    onPress = {()=>{this._deleteRoom()}}>
                                    <Text style = {[styles.options,{color:'white'}]}>Delete Room</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>:null}
            </View>

            {/*<View style = {{height:this.height*0.1, flexDirection:'row',
                justifyContent:'center', alignItems:'center'}}>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, opacity:this.dot1}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.dot2}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.dot3}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.dot4}}/>
                <AnimatedDot name='checkbox-blank-circle'
                    style={{color:colors.dots,fontSize:15, marginLeft:20, opacity:this.dot5}}/>
            </View>*/}

            {this.state.transition?<Animated.View
                style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                backgroundColor:colors.shadow, opacity:this.state.transitionOpacity}}>
                <ActivityIndicator size='large' color={colors.font} 
                    style = {{position:'absolute',bottom:25,right:25}}/>
            </Animated.View>:null}
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
        if(name && name.trim().length>0 && name.trim().length < 11){

            this.props.updatePage(2)

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
        return <View style = {{flex:1, backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center', width:this.props.width}}>
            
            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Step 1 of 4</Text>
                <Text style = {styles.subtitle}>What is your name?</Text>
            </View>

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
                    value={this.state.alias}
                    onChangeText = {(text) => {this.setState({alias: text})}}
                    onSubmitEditing = {()=>{ 
                        this._continue(this.state.alias);
                    }}
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

            <View style = {{justifyContent:'center',alignItems:'center', flex:0.07}}>
                <Animatable.Text style = {styles.sconcerto} ref = 'nameerror'>
                    {this.state.errormessage}</Animatable.Text>
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
            errormessage:'Must be between 6 - 15',
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
        if(this.state.playercount && this.state.playercount.toString().length == 1){
            this.setState({ playercount: null })
        } else if (this.state.playercount && this.state.playercount.length == 2){
            this.setState({ playercount: this.state.playercount.slice(0,1)})
        }
        
    }
    _clear() {
        this.setState({ playercount: null })
    }
    _done() {
        if(!this.state.playercount || this.state.playercount < 0 || this.state.playercount > 15){
            this.refs.error.shake(800)
            this.setState({playercount:null})
        } else {

            this.props.updatePage(3)

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

            <View style = {{flex:0.05}}/>

            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Step 2 of 4</Text>
                <Text style = {styles.subtitle}>{'How many people' + '\n' +  'are playing?'}</Text>
            </View>

            <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.7, flexDirection:'row'}}>
                    <View style = {{flex:0.8, justifyContent:'center', alignItems:'center',
                        backgroundColor:colors.font, borderRadius:5, flexDirection:'row'}}>
                        <View style = {{flex:0.3}}/>
                        <Text style = {[styles.bigconcerto,
                            {color:colors.menubtn, flex:0.4}]}>
                            {this.state.playercount?this.state.playercount:'?'}</Text>
                        <TouchableOpacity style = {{flex:0.3}} onPress = {()=>{this._backspace()}}>
                            <MaterialCommunityIcons name = 'backspace'
                                style={{ color:colors.menubtn, fontSize: 40, alignSelf:'center'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style = {{flex:0.5, justifyContent:'center', alignItems:'center',
                marginLeft:10, marginRight:10, borderRadius:2, paddingTop:5, paddingBottom:5}}>
                <Animatable.Text style = {styles.error}ref='error'>
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
                            this._clear()
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

        this.props.updatePage(4)

        firebase.database().ref('rooms').child(this.props.roomname).update({
            difficulty: difficulty
        }).then(()=>{
            this.setState({difficulty:difficulty})
            this.props.refs.scrollView.scrollTo({x:this.props.width*3,y:0,animated:true})
        })
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, alignItems:'center',
            width: this.props.width, justifyContent:'center', borderWidth:1}}>

                <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.title}>Step 3 of 4</Text>
                    <Text style = {styles.subtitle}>{'How experienced' + '\n' + 'is your Group?'}</Text>
                </View>

                <View style = {{flex:0.03}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {10} radius = {80}
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
                <View style = {{flex:0.02}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {10} radius = {80}
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
                <View style = {{flex:0.02}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {10} radius = {80}
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
                <View style = {{flex:0.1}}/>


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

            listOpacity: new Animated.Value(1),
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
                    count:          0,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    count:          0,
                    key:            key,
                })
            } else {
                neutrallist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    count:          0,
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

    _selectionDone() {
        this.props.updatePage(5)
        this.props.refs.scrollView.scrollTo({x:this.props.width*4,animated:true})
    }

    _roleBtnPress(key,index,count) {
        this.listOfRoles.child(key).transaction((count)=>{
            return count + 1;
        })

        if(this.props.playercount + 1 == this.props.playernum){
            this._selectionDone()
        }
    }

    _removeRole(key, index) {
        this.listOfRoles.child(key).transaction((count)=>{
            return count - 1;
        })
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

    render() {

        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width:this.props.width,justifyContent:'center'}}>

            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Step 4 of 4</Text>
                <Text style = {styles.subtitle}>
                    {'Select ' + (this.props.playernum - this.props.playercount) + ' more roles'}</Text>
            </View>

            <View style = {{flex:0.1, flexDirection:'row', justifyContent:'center'}}>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showtown?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showtown?colors.shadow:colors.lightshadow}
                    leftradius = {30}
                    rightradius = {2}
                    onPress = {()=>{
                        this._viewChange(true,false,false)
                    }}
                    component = {<Text style = {this.state.showtown?
                        styles.centeredBtn:styles.centeredBtnPressed}>Town</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showmafia?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showmafia?colors.shadow:colors.lightshadow}
                    radius = {2}
                    onPress = {()=>{
                        this._viewChange(false,true,false)
                    }}
                    component = {<Text style = {this.state.showmafia?
                        styles.centeredBtn:styles.centeredBtnPressed}>Mafia</Text>}
                />
                <View style = {{width:4, backgroundColor:colors.background}}/>
                <CustomButton
                    size = {0.25}
                    flex = {1}
                    opacity = {1}
                    depth = {6}
                    color = {this.state.showneutral?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.showneutral?colors.shadow:colors.lightshadow}
                    rightradius = {30}
                    leftradius = {2}
                    onPress = {()=>{
                        this._viewChange(false,false,true)
                    }}
                    component = {<Text style = {this.state.showneutral?
                        styles.centeredBtn:styles.centeredBtnPressed}>Neutral</Text>}
                />
            </View>

            <Animated.View style = {{flex:0.65, opacity:this.state.listOpacity, marginTop:10}}>
                <FlatList
                    data={this.state.showtown?this.state.townlist:
                        (this.state.showmafia?this.state.mafialist:this.state.neutrallist)}
                    renderItem={({item}) => (
                        <View style = {{marginBottom:3, flexDirection:'row',justifyContent:'center'}}>
                            <View style = {{flex:0.75, backgroundColor:colors.lightbutton, marginBottom:5,
                                borderRadius:40, flexDirection:'row',justifyContent:'center'}}>
                                <TouchableOpacity
                                    style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}
                                    onPress = {()=>{ this._removeRole(item.key,item.index) }}
                                    disabled = {!item.count}
                                ><MaterialCommunityIcons name={item.count?'close-circle':null}
                                    style={{color:colors.menubtn,fontSize:30}}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style = {{flex:0.7, justifyContent:'center', alignItems:'center'}}
                                    onPress = {()=>{ this._roleBtnPress(item.key,item.index) }}>
                                    <Text style = {{ color:colors.font, fontFamily: 'ConcertOne-Regular',
                                        fontSize:18, marginTop:8, marginBottom:8}}>{item.name}</Text>
                                </TouchableOpacity>
                                <Text style = {{ flex:0.2, color:colors.font,
                                    fontFamily: 'ConcertOne-Regular', fontSize:18, 
                                    alignSelf:'center'}}>
                                    {item.count?item.count:null}
                                </Text>
                            </View>
                        </View>
                    )}
                    style={{margin:3}}
                    numColumns = {1}
                    keyExtractor={item => item.key}/>
            </Animated.View>
            <View style = {{flex:0.05}}/>
        </View>
    }
}

export class Creation5 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            namelist:[],

            players:null,       //ListOfPlayers count
            playernum: null,    //Creation2 number
            rolecount:null,     //ListOfRoles count

            warning1:           true,
            warning2:           true,
        };

        this.height = Dimensions.get('window').height;
        this.width  = Dimensions.get('window').width;
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
            } else {
                this.setState({warning2:true})
            }
        })

        this.playernumRef = firebase.database().ref('rooms').child(this.props.roomname).child('playernum')
        this.playernumRef.on('value',snap=>{
            this.setState({
                playernum: snap.val(),
            })

            if(snap.val() == this.state.players){
                this.setState({warning2:false})
            } else {
                this.setState({warning2:true})
            }
            if(snap.val() == this.state.rolecount){
                this.setState({warning1:false})
            } else {
                this.setState({warning1:true})
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
                } else {
                    this.setState({warning1:true})
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
        firebase.database().ref('rooms').child(roomname).child('phase').set(1)
    }

    _renderWarning1() {
        return <Animated.View 
            style = {{ height:80, justifyContent:'center', position:'absolute', 
                left:0, right:0, bottom:0 }}>
            <CustomButton size = {1} flex = {0.9} opacity = {1} depth = {8}
                color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {50}
                onPress = {()=>{
                    this.props.refs.scrollView.scrollTo({x:this.props.width*3,y:0,animation:true})
                }}
                component = {<Text style = {styles.concerto}>
                {'Role Selection' + '\n' + 'does not match Room Size!'}</Text>}/>
        </Animated.View>
    }
    _renderWarning2() {
        return <Animated.View 
            style = {{ height:80, justifyContent:'center', position:'absolute', 
                left:0, right:0, bottom:90 }}>
            <CustomButton size = {1} flex = {0.9} opacity = {1} depth = {8}
                color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {50}
                onPress = {()=>{
                    this.props.refs.scrollView.scrollTo({x:this.props.width,y:0,animation:true})
                }}
                component = {<Text style = {styles.concerto}>
                {'No. of Players' + '\n' + 'does not match Room Size!'}</Text>}/>
        </Animated.View>
    }

    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <Text style = {{
                    fontSize: 20,
                    fontFamily: 'ConcertOne-Regular',
                    textAlign:'center',
                    color: colors.shadow }}>{item.name}</Text>
            )}
            numColumns={1}
            keyExtractor={item => item.key}/>
    }

    _renderOptions() {
        return <View style = {{height:this.height*0.1, width:this.width*0.7}}>
            <CustomButton size = {1} flex = {1} opacity = {1} depth = {6}
                color = {colors.menubtn} radius = {40}
                onPress = {()=>{ 
                    !this.state.warning1 && !this.state.warning2 ? 
                    this._startGame(this.props.roomname) : alert('Unable to Start game.')
                }}
                component = {<Text style={styles.mconcerto}>START GAME</Text>}/>
        </View>
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background,width:this.props.width,
            alignItems:'center'}}>

            <View style = {{height:this.height*0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Game Lobby</Text>
                <Text style = {styles.subtitle}>Players:</Text>
            </View>

            <View style = {{height:this.height*0.55, width:this.width*0.7, justifyContent:'center'}}>
                {this._renderListComponent()}
            </View>

            {this._renderOptions()}
            <View style = {{height:this.height*0.04}}/>

            {this.state.transition?<Animated.View
                style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                backgroundColor:colors.shadow, opacity:this.state.transitionOpacity}}>
                <ActivityIndicator size='large' color={colors.font} 
                    style = {{position:'absolute',bottom:25,right:25}}/>
            </Animated.View>:null}
        </View>
    }
}

const styles = StyleSheet.create({
    roomcode: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    
    options: {
        fontSize: 25,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
        marginTop:10,
        marginBottom:10
    },
    optionBox: {
        width:Dimensions.get('window').width*0.7, 
        borderRadius:30, 
        backgroundColor:colors.background,
        marginTop:5,
        marginBottom:5
    },
    disabledBox: {
        width:Dimensions.get('window').width*0.7, 
        borderRadius:30, 
        backgroundColor:colors.background,
        opacity:0.5,
        marginTop:5,
        marginBottom:5
    },
    title : {
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
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
        fontSize: 30,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
    },
    error: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.shadow,
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

});