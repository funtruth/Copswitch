
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
import { ListItem } from '../components/ListItem.js';
import { Pager } from '../components/Pager.js';

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
            currentpage:1,

            roomname: params.roomname,
            alias:'',
            loading:true,
            errormessage:null,

            playernum:          null,
            difficulty:         null,
            rolecount:          null,

            transition:false,
            transitionOpacity: new Animated.Value(0),
            
            modal: false,
            modalOpacity: new Animated.Value(0),
            menuWidth: new Animated.Value(0),
        };

        this.dot1           = new Animated.Value(1);
        this.dot2           = new Animated.Value(0.3);
        this.dot3           = new Animated.Value(0.3);
        this.dot4           = new Animated.Value(0.3);
        this.dot5           = new Animated.Value(0.3);

        this.height         = Dimensions.get('window').height;
        this.width          = Dimensions.get('window').width;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.phaseRef       = this.roomRef.child('phase');
        this.listPlayerRef  = this.roomRef.child('listofplayers')
        
    }

    
    componentWillMount() {
        this.phaseRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val()==1){
                    this._startGame(this.state.roomname)
                }
            }
        })

        BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
    }

    componentWillUnmount() {
        if(this.phaseRef){
            this.phaseRef.off();
        }
        BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);
    }

    _onBackPress = () => {
        if(this.state.modal){
            this._menuPress()
        } else if(this.state.currentpage > 1){
            this._changePage(this.state.currentpage - 1)
        }
        return true
    }

    _deleteRoom() {
        this.roomRef.remove()
        .then(()=>{
            this.props.navigation.dispatch(NavigationActions.back());
        })
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
                    this.state.menuWidth,{
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
                    this.state.menuWidth,{
                        toValue:this.width*0.8,
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
        if(page > this.state.page){
            this.setState({page:page, currentpage:page})
        } else {
            this.setState({currentpage:page})
        }
    }

    _changePage(page){
        if(page<6 && page>0){
            this.refs.scrollView.scrollTo({x:(page-1)*this.width,animated:true})
            this.setState({currentpage:page})
        }
    }

    _navigateTo(page){
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
            justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{ this._menuPress() }}>
                    <MaterialCommunityIcons name='menu' style={{color:colors.shadow,fontSize:30}}/>
                </TouchableOpacity>
                <View style = {{flex:0.7, justifyContent:'center', borderRadius:30}}> 
                    <Text style = {styles.roomcode}></Text>
                </View>
                <View style = {{flex:0.15}}/>
            </View>

            <View style = {{height:this.height*0.75}}>
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
                        updatePlayernum = {val => this.setState({playernum:val})}
                    />
                    <Creation3
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        updatePage = {val => this._updatePage(val)}
                        updateDifficulty = {val => this.setState({difficulty:val})}
                    />
                    <Creation4
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        playernum = {this.state.playernum}
                        difficulty = {this.state.difficulty}
                        updatePage = {val => this._updatePage(val)}
                        updateRolecount = {val => this.setState({rolecount:val})}
                    />
                    <Creation5
                        roomname = {this.state.roomname}
                        width = {this.width}
                        refs = {this.refs}
                        playernum = {this.state.playernum}
                        rolecount = {this.state.rolecount}
                        navigation = {this.props.navigation}
                    />
                </ScrollView>
            </View>

            <Pager
                height = {this.height*0.08}
                page = {this.state.page}
                currentpage = {this.state.currentpage}
                lastpage = {5}
                goBack = {() => this._changePage(this.state.currentpage - 1)}
                goForward = {() => this._changePage(this.state.currentpage + 1)}
                finish = {() => this._startGame(this.state.roomname)}
            />

            {this.state.modal?
            <TouchableWithoutFeedback style = {{flex:1}} onPress={()=>{this._menuPress()}}>
                <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                    backgroundColor:'rgba(0, 0, 0, 0.5)', opacity:this.state.modalOpacity}}>
                    <Animated.View style = {{height:this.height*1, width:this.state.menuWidth,
                        backgroundColor:colors.shadow}}>
                        <TouchableWithoutFeedback style = {{flex:1 }} onPress = {()=>{}}>
                        <View style = {{flex:1}}>
                            <ListItem flex={0.1} title={this.state.roomname} icon={'menu'} fontSize={40}
                                onPress = {()=>{this._menuPress()}} 
                                index = {1} page = {this.state.page}/>
                            <ListItem flex={0.07} title={'Edit Name'} fontSize={20}
                                icon={'pencil'}
                                onPress = {()=>{this._navigateTo(1)}}
                                index = {1} page = {this.state.page}/>
                            <ListItem flex={0.07} title={'# of Players'} fontSize={20}
                                icon={'account-multiple'} 
                                onPress = {()=>{this.state.page<2?{}:this._navigateTo(2)}}
                                index = {2} page = {this.state.page}/>
                            <ListItem flex={0.07} title={'Difficulty'} fontSize={20}
                                icon={'scale-balance'}
                                onPress = {()=>{this.state.page<3?{}:this._navigateTo(3)}}
                                index = {3} page = {this.state.page}/>
                            <ListItem flex={0.07} title={'Select Roles'} fontSize={20}
                                icon={'script'}
                                onPress = {()=>{this.state.page<4?{}:this._navigateTo(4)}}
                                index = {4} page = {this.state.page}/>
                            <ListItem flex={0.07} title={'Lobby'} fontSize={20}
                                icon={'home'}
                                onPress = {()=>{this.state.page<5?{}:this._navigateTo(5)}}
                                index = {5} page = {this.state.page}/>
                            <View style = {{flex:0.4}}/>
                            <ListItem flex={0.07} title={'Delete Room'} fontSize={25}
                                icon={'close-circle'}
                                onPress = {()=>{this._deleteRoom()}}
                                index = {1} page = {this.state.currentpage}/>
                        </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>:null}

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
                <Text style = {styles.title}>Step 1</Text>
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
            playernum: null,
            errormessage:'Must be between 6 - 15',
        };
    }

    //In case the user already selected and is remounting
    componentWillMount() {
        firebase.database().ref('rooms').child(this.props.roomname).child('playernum')
        .once('value',snap=>{
            if(snap.exists()){
                this.setState({
                    playernum: snap.val().playernum,
                })
            }
        })
    }

    _digit(digit) {
        if(this.state.playernum){
            if(this.state.playernum.length > 1){
                this.refs.error.shake(800)
            } else if (Number(this.state.playernum + digit.toString()>15)) {
                this.refs.error.shake(800)
            } else {
                this.setState({
                    playernum: this.state.playernum + digit.toString()
                })
            }
        } else {
            this.setState({
                playernum: digit
            })
        }
    }
    _backspace() {
        if(this.state.playernum && this.state.playernum.toString().length == 1){
            this.setState({ playernum: null })
        } else if (this.state.playernum && this.state.playernum.length == 2){
            this.setState({ playernum: this.state.playernum.slice(0,1)})
        }
        
    }
    _clear() {
        this.setState({ playernum: null })
    }
    _done() {
        if(!this.state.playernum || this.state.playernum < 0 || this.state.playernum > 15){
            this.refs.error.shake(800)
            this.setState({playernum:null})
        } else {

            this.props.updatePage(3)
            this.props.updatePlayernum(this.state.playernum)

            firebase.database().ref('rooms').child(this.props.roomname).update({
                playernum: Number(this.state.playernum)
            }).then(()=>{
                this.props.refs.scrollView.scrollTo({x:this.props.width*2,y:0,animated:true})
            })
        }
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, 
            width:this.props.width}}>

            <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Step 2</Text>
                <Text style = {styles.subtitle}>{'How many people' + '\n' +  'are playing?'}</Text>
            </View>

            <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.7, flexDirection:'row'}}>
                    <View style = {{flex:0.8, justifyContent:'center', alignItems:'center',
                        backgroundColor:colors.font, borderRadius:5, flexDirection:'row'}}>
                        <View style = {{flex:0.3}}/>
                        <Text style = {[styles.bigconcerto, {color:colors.menubtn, flex:0.4}]}>
                            {this.state.playernum?this.state.playernum:'?'}</Text>
                        <TouchableOpacity style = {{flex:0.3}} onPress = {()=>{this._backspace()}}>
                            <MaterialCommunityIcons name = 'backspace'
                                style={{ color:colors.menubtn, fontSize: 40, alignSelf:'center'}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style = {{flex:0.6, justifyContent:'center', alignItems:'center',
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
        this.props.updateDifficulty(difficulty)

        firebase.database().ref('rooms').child(this.props.roomname).update({
            difficulty: difficulty
        }).then(()=>{
            this.setState({difficulty:difficulty})
            this.props.refs.scrollView.scrollTo({x:this.props.width*3,y:0,animated:true})
        })
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background, alignItems:'center',
            width: this.props.width, justifyContent:'center'}}>

                <View style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.title}>Step 3</Text>
                    <Text style = {styles.subtitle}>{'How experienced' + '\n' + 'is your Group?'}</Text>
                </View>

                <View style = {{flex:0.03}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
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
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
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
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
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

            rolecount: 0,

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
                var rolecount = 0;
                snap.forEach((child)=>{
                    rolecount = rolecount + child.val()
                    if(Rolesheet[child.key].type == 1){
                        mafialist[Rolesheet[child.key].index]['count'] = child.val()
                    } else if (Rolesheet[child.key].type == 2) {
                        townlist[Rolesheet[child.key].index]['count'] = child.val()
                    } else {
                        neutrallist[Rolesheet[child.key].index]['count'] = child.val()
                    }
                });
                this.setState({
                    rolecount:rolecount,
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist
                });
                this.props.updateRolecount(rolecount);
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

    _roleBtnPress(key,index,count,rolecount) {
        this.listOfRoles.child(key).transaction((count)=>{
            return count + 1;
        })

        if(rolecount + 1 == this.props.playernum){
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
                <Text style = {styles.title}>Step 4</Text>
                <Text style = {styles.subtitle}>{this.state.rolecount + ' out of ' 
                    + this.props.playernum + ' roles selected.'}</Text>
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

            <Animated.View style = {{flex:0.7, opacity:this.state.listOpacity, marginTop:10}}>
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
                                    onPress = {()=>{ this._roleBtnPress(item.key,item.index,
                                        item.count, this.state.rolecount) }}>
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

            playercount:    null,   //ListOfPlayers count
            rolecount:      null,     //ListOfRoles count

            warning:        false,
            warningOpacity: new Animated.Value(0),
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
                namelist:       list,
                playercount:    snap.numChildren(),
            })
        })
    }

    componentWillUnmount() {
        if(this.listOfRolesRef){
            this.listOfRolesRef.off();
        }
    }

    _startGame() {
        if(this.state.playercount != this.props.playernum){
            this._warning(true)
        } else if (this.state.playercount != this.props.rolecount){
            this._warning(true)
        } else {
            firebase.database().ref('rooms').child(this.props.roomname).child('phase').set(1)
        }
    }

    _warning(boolean) {
        if(boolean){
            this.setState({warning:true})
            Animated.timing(
                this.state.warningOpacity,{
                    toValue:1,
                    duration:MENU_ANIM
                }
            ).start()
        } else {
            setTimeout(()=>{this.setState({warning:false}),1000})
            Animated.timing(
                this.state.warningOpacity,{
                    toValue:0,
                    duration:MENU_ANIM
                }
            ).start()
        }
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
        return <CustomButton size = {1} flex = {1} opacity = {1} depth = {6}
            color = {colors.menubtn} radius = {40}
            onPress = {()=>{ this._startGame() }}
            component = {<Text style={styles.mconcerto}>START GAME</Text>}
        />
    }

    _renderModal() {
        return this.state.warning?
            <TouchableWithoutFeedback style = {{flex:1}} onPress={()=>{ this._warning(false)}}>
                <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                    backgroundColor:'rgba(0, 0, 0, 0.5)', alignItems:'center',
                    opacity:this.state.warningOpacity}}>
                    <TouchableWithoutFeedback style = {{height:this.height*0.4, width:this.width*0.85, 
                        marginTop:this.height*0.15, backgroundColor:colors.shadow }}
                        onPress = {()=>{}}>
                        <View style = {{ flex:0.4, justifyContent:'center', 
                            alignItems:'center', borderRadius:30, marginTop:this.height*0.14}}>

                            <View style = {{flex:0.3, justifyContent:'center'}}>
                                <Text style = {styles.warningTitle}>Cannot start game</Text>
                                <Text style = {styles.warningText}>{'The following numbers' 
                                    + '\n' + 'should be equal.'}</Text>
                            </View>
                            <View style = {{flex:0.45, justifyContent:'center'}}>
                                <Text style = {styles.warningText}>{'Size of Room: ' 
                                    + this.props.playernum}</Text>
                                <Text style = {styles.warningText}>{'People in Room: ' 
                                    + this.state.playercount}</Text>
                                <Text style = {styles.warningText}>{'Roles Selected: ' 
                                    + this.props.rolecount}</Text>
                            </View>
                            <View style = {{flex:0.25,justifyContent:'center'}}>
                                <Text style = {styles.warningText}>{'Check the numbers' 
                                    + '\n' + 'and try again.'}</Text>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>:null
    }

    render() {
        return <View style = {{flex:0.7,backgroundColor:colors.background,width:this.props.width,
            alignItems:'center'}}>

            <View style = {{height:this.height*0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Game Lobby</Text>
                <Text style = {styles.subtitle}>Players:</Text>
            </View>

            <View style = {{height:this.height*0.48, width:this.width*0.7, justifyContent:'center'}}>
                {this._renderListComponent()}
            </View>

            <View style = {{height:this.height*0.1, width:this.width*0.7}}>
                {this._renderOptions()}
            </View>

            {this._renderModal()}

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
    warningTitle: {
        fontSize: 22,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    warningText: {
        fontSize: 17,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    options: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        marginLeft:20,
        color: colors.font,
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
    menuBtn : {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center'
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