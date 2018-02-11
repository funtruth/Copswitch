
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    ScrollView,
    Image,
    FlatList,
    AsyncStorage,
    Keyboard,
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
import { Desc } from '../components/Desc.js';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

import * as Animatable from 'react-native-animatable';
const AnimatedDot = Animated.createAnimatedComponent(MaterialCommunityIcons)
const MENU_ANIM = 200;
const GAME_ANIM = 1000;
import randomize from 'randomatic';

export class Build1 extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            roomname:null,
            message:'testing things',
        };
        
    }

    _createRoom() {

        AsyncStorage.setItem('ROOM-KEY', this.state.roomname).then(()=>{
            this.props.navigate(this.state.roomname)
        })
    }

    componentWillReceiveProps(newProps){

        if(newProps.visible && !this.state.roomname){

            var flag = false
            var roomname = null
    
            firebase.database().ref('rooms').once('value',snap=>{

                while(!flag){
                    roomname = randomize('0',4);
                    if(!snap.child(roomname).exists()){
                        flag = true
                        this.setState({roomname:roomname})
                    }
                }
                
                firebase.database().ref('rooms/').child(roomname).set({
                    owner: firebase.auth().currentUser.uid,
                    counter:1,
                })
            }) 
        }
    }

    render() {

        return <View>

            <Text style = {styles.sfont}>{this.state.message}</Text>

            <CustomButton
                flex={0.4}
                onPress={()=>this._createRoom()}
            >
                <Text style = {styles.font}>Make</Text>
            </CustomButton>

        </View>
    }
}

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
            playercount:        null,
            difficulty:         null,
            rolecount:          null,

            warning:false,
            warningOpacity: new Animated.Value(0),
            modalOpacity: new Animated.Value(0),
        };

        this.height         = Dimensions.get('window').height;
        this.width          = Dimensions.get('window').width;

        this.roomRef        = firebase.database().ref('rooms').child(roomname);
        this.counterRef     = this.roomRef.child('counter');
        this.listPlayerRef  = this.roomRef.child('listofplayers')
        
    }

    
    componentWillMount() {
        this.counterRef.on('value',snap=>{
            if(snap.exists()){
                if(snap.val()==2){
                    this._startGame(this.state.roomname)
                }
            }
        })
    }

    componentWillUnmount() {
        if(this.counterRef){
            this.counterRef.off();
        }
    }

    _deleteRoom() {
        this.roomRef.remove()
        .then(()=>{
            this.props.screenProps.navigate('Home')
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

        this.counterRef.set(3).then(()=>{
            this.props.screenProps.navigateP('MafiaRoom',roomname)
        })
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
                    
                    max--;
                    
                    randomstring = randomstring.slice(0,randomnumber-1) 
                        + randomstring.slice(randomnumber);
                })
            })

        })
    }

    _renderModal() {
        return this.state.warning?
            <TouchableWithoutFeedback style = {{flex:1}} onPress={()=>{ this._warning(false)}}>
                <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
                    backgroundColor:'rgba(0, 0, 0, 0.5)', alignItems:'center', justifyContent:'center',
                    opacity:this.state.warningOpacity}}>
                    <TouchableWithoutFeedback style = {{height:this.height*0.4, width:this.width*0.85, 
                        backgroundColor:colors.shadow }}
                        onPress = {()=>{}}>
                        <View style = {{ flex:0.4, justifyContent:'center', alignItems:'center'}}>

                            <View style = {{flex:0.3, justifyContent:'center'}}>
                                <Text style = {styles.warningTitle}>Cannot start game</Text>
                                <Text style = {styles.warningText}>{'The following numbers' 
                                    + '\n' + 'should be equal.'}</Text>
                            </View>
                            <View style = {{flex:0.45, justifyContent:'center'}}>
                                <Text style = {styles.warningText}>{'Size of Room: ' 
                                    + this.state.playernum}</Text>
                                <Text style = {styles.warningText}>{'People in Room: ' 
                                    + this.state.playercount}</Text>
                                <Text style = {styles.warningText}>{'Roles Selected: ' 
                                    + this.state.rolecount}</Text>
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
        return <View style = {{flex:1, backgroundColor:colors.background}}>
            <View style = {{height:this.height*0.1, 
            justifyContent:'center', alignItems:'center', marginTop:10}}>
                    <Text style = {styles.roomcode}>{this.state.roomname}</Text>
            </View>

            <View style = {{height:this.height*0.12}}/>

            <View style = {{height:this.height*0.63}}>
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
                        updatePlayercount = {val => this.setState({playercount:val})}
                        warningOn = {val => this._warning(val)}
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

            {this._renderModal()}

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
            alignItems:'center', width:this.props.width}}>
            
            <View style = {{flex:0.2}}/>

            <View style = {{flex:0.1, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.subtitle}>What is your name?</Text>
            </View>

            <View style = {{flex:0.12,flexDirection:'row'}}>
                <TextInput
                    style={{
                        backgroundColor: colors.main,
                        flex:0.6,
                        fontFamily:'LuckiestGuy-Regular',
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
                    title = 'GO'
                />
            </View>

            <View style = {{justifyContent:'center',alignItems:'center', flex:0.07}}>
                <Animatable.Text style = {styles.sfont} ref = 'nameerror'>
                    {this.state.errormessage}</Animatable.Text>
            </View>
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

    _continue(val) {
        if(!val || val < 0 || val > 15){
            this.refs.error.shake(800)
            this.setState({playernum:null})
        } else {

            this.props.updatePage(3)
            this.props.updatePlayernum(val)

            firebase.database().ref('rooms').child(this.props.roomname).update({
                playernum: Number(val)
            }).then(()=>{
                this.props.refs.scrollView.scrollTo({x:this.props.width*2,y:0,animated:true})
            })
        }
    }

    render() {
        return <View style = {{flex:1,backgroundColor:colors.background, 
            width:this.props.width}}>

            <View style = {{flex:0.09}}/>

            <View style = {{flex:0.1, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.roomcode}># of players:</Text>
            </View>

            <View style = {{flex:0.22, justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.7, flexDirection:'row'}}>
                    <TextInput 
                        ret = 'stepTwo'
                        keyboardType='numeric'
                        maxLength = {2}
                        value = {this.state.playernum}
                        style = {styles.textOutput}
                        onChangeText = {(text) => {this.setState({playernum: text})}}
                        onSubmitEditing = {(event)=>{
                            this._continue(event.nativeEvent.text);
                        }}
                    />
                </View>
            </View>

            <Animatable.Text style = {{
                    fontSize: 15,
                    fontFamily: 'LuckiestGuy-Regular',
                    textAlign:'center',
                    color: colors.shadow,
                }}ref='error'>{this.state.errormessage}
            </Animatable.Text>

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
        return <View style = {{flex:0.7,backgroundColor:colors.background, alignItems:'center', width: this.props.width }}>

                <View style = {{flex:0.1}}/>
                
                <View style = {{flex:0.1, justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.subtitle}>{'How experienced' + '\n' + 'is your Group?'}</Text>
                </View>

                <View style = {{flex:0.03}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
                    color = {this.state.difficulty==1?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==1?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(1) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <Text style = {styles.lfont}>New</Text>
                        <Text style = {styles.lsfont}>
                            {'We are just trying out' + '\n' + 'Mafia for the first time!'}</Text>
                    </View>}
                />
                <View style = {{flex:0.02}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
                    color = {this.state.difficulty==2?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==2?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(2) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <Text style = {styles.lfont}>Average</Text>
                        <Text style = {styles.lsfont}>
                            {'We play once and a while' + '\n' + 'and know most of the roles.'}</Text>
                    </View>}
                />
                <View style = {{flex:0.02}}/>
                <CustomButton size = {0.2} flex = {0.8} depth = {8} radius = {80}
                    color = {this.state.difficulty==3?colors.menubtn:colors.lightbutton}
                    shadow = {this.state.difficulty==3?colors.shadow:colors.lightshadow}
                    onPress = {()=>{ this._selectDifficulty(3) }}
                    component = {<View style = {{justifyContent:'center', alignItems:'center'}}>
                        <Text style = {styles.lfont}>Experts</Text>
                        <Text style = {styles.lsfont}>
                            {'We play very frequently' + '\n' + 'and enjoy lying games.'}</Text>
                    </View>}
                />
                <View style = {{flex:0.05}}/>


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

            roleid: 'a',
            descVisible: false,

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
        this.setState({
            roleid: key,
            descVisible: true
        })
    }

    _addRole(key){
        this.listOfRoles.child(key).transaction((count)=>{
            return count + 1;
        })
        if(this.state.rolecount + 1 >= this.props.playernum){
            this._selectionDone()
        }
    }

    _removeRole(key, index) {
        this.listOfRoles.child(key).transaction((count)=>{
            if(count>0){
                return count - 1;
            } else {
                return count
            }
        })
    }

    _viewChange(town,mafia,neutral){
        this.setState({
            showtown:town,
            showmafia:mafia,
            showneutral:neutral,
        })
    }

    render() {

        return <View style = {{flex:0.7,backgroundColor:colors.background,
            width:this.props.width,justifyContent:'center'}}>

            <View style = {{flex:0.1, justifyContent:'center', alignItems:'center'}}>
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

            <Animated.View style = {{flex:0.75, opacity:this.state.listOpacity, marginTop:10}}>
                <FlatList
                    data={this.state.showtown?this.state.townlist:
                        (this.state.showmafia?this.state.mafialist:this.state.neutrallist)}
                    renderItem={({item}) => (
                        <View style = {{marginBottom:3, flexDirection:'row',justifyContent:'center'}}>
                            <View style = {{flex:0.75, backgroundColor:colors.lightbutton, marginBottom:5,
                                borderRadius:40, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
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
                                    <Text style = {{ color:colors.font, fontFamily: 'LuckiestGuy-Regular',
                                        fontSize:18, marginTop:8, marginBottom:8}}>{item.name}</Text>
                                </TouchableOpacity>
                                <View style = {{flex:0.2, alignItems:'center'}}>
                                    <Text style = {{ color:colors.font,fontFamily: 'LuckiestGuy-Regular', fontSize:18}}>
                                        {item.count?item.count:null}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    style={{margin:3}}
                    numColumns = {1}
                    keyExtractor={item => item.key}/>
            </Animated.View>
            <View style = {{flex:0.05}}/>

            <Desc
                marginBottom = {20}
                roleid = {this.state.roleid}
                count = {this.state.townlist[Rolesheet[this.state.roleid].index]['count']}
                optionOneName = '-'
                optionTwoName = '+'
                optionOnePress = {()=>{
                    this._removeRole(this.state.roleid)
                }}
                optionTwoPress = {()=>{ 
                    this._addRole(this.state.roleid)
                }}
                visible = {this.state.descVisible}
                onClose = {()=>{this.setState({descVisible:false})}}
            />
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
            this.props.updatePlayercount(snap.numChildren())
        })
    }

    componentWillUnmount() {
        if(this.listOfRolesRef){
            this.listOfRolesRef.off();
        }
    }

    _startGame() {
        if(this.state.playercount != this.props.playernum){
            this.props.warningOn(true)
        } else if (this.state.playercount != this.props.rolecount){
            this.props.warningOn(true)
        } else {
            firebase.database().ref('rooms').child(this.props.roomname).child('counter').set(2)
        }
    }

    _renderListComponent(){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <Text style = {styles.playerList}>{item.name}</Text>
            )}
            numColumns={1}
            keyExtractor={item => item.key}/>
    }

    _renderOptions() {
        return <CustomButton size = {1} flex = {1} opacity = {1} depth = {6}
            color = {colors.menubtn} radius = {40}
            onPress = {()=>{ this._startGame() }}
            component = {<Text style={styles.lfont}>START GAME</Text>}
        />
    }

    render() {
        return <View style = {{flex:1,backgroundColor:colors.background,width:this.props.width,alignItems:'center'}}>

            <View style = {{height:this.height*0.15, justifyContent:'center', alignItems:'center'}}>
                <Text style = {styles.title}>Game Lobby</Text>
                <Text style = {styles.subtitle}>Players:</Text>
            </View>

            <View style = {{height:this.height*0.35, width:this.width*0.7, justifyContent:'center'}}>
                {this._renderListComponent()}
            </View>

            <View style = {{height:this.height*0.08, width:this.width*0.5}}>
                {this._renderOptions()}
            </View>

        </View>
    }
}
