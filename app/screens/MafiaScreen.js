
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';
import Images from '../../assets/images/index.js';

import { PushButton } from '../components/PushButton.js';
import { NameButton } from '../components/NameButton.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import randomize from 'randomatic';
import * as Animatable from 'react-native-animatable';
const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)

//Firebase
import firebase from '../firebase/FirebaseController.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 300;

export default class Mafia_Screen extends React.Component {

constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname:           params.roomname,
        phase:              '',
        daycounter:         '',
        phasename:          '',
        topmessage:         '',
        phasebackground:    'night',

        myname:             '',
        myrole:             '',
        myroleid:           '',
        targetdead:         '',
        targettown:         '',

        namelist:           [],

        triggernum:         1000,
        playernum:          1000,

        readyvalue:         false,
        presseduid:         '',
        disabled:           false,

        amidead:            true,
        amimafia:           false,
        amipicking:         false,
        amiowner:           false,

        nominate:           '',
        nominee:            '',

        gameover:           false,

        titleSize:          new Animated.Value(0.4),
        backSize:           new Animated.Value(0.01),
        voteSize:           new Animated.Value(0.12),
        abstainSize:        new Animated.Value(0.12),
        listSize:           new Animated.Value(0.01),
        waitingSize:        new Animated.Value(0.01),
        
        backOpacity:        new Animated.Value(0),
        voteOpacity:        new Animated.Value(0),
        abstainOpacity:     new Animated.Value(0),
        listOpacity:        new Animated.Value(0),
        waitingOpacity:     new Animated.Value(0),
    };

    this.roomRef            = firebase.database().ref('rooms/' + roomname);
    this.myInfoRef          = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid);
    this.mafiaRef           = this.roomRef.child('mafia');
    
    this.listRef            = this.roomRef.child('listofplayers');
    this.playernumRef       = this.roomRef.child('playernum');
    this.nominationRef      = this.roomRef.child('nominate');
    this.ownerRef           = this.roomRef.child('owner');
    this.phaseRef           = this.roomRef.child('phase');

    //Owner Listening
    this.countRef           = this.roomRef.child('count');
    this.guiltyVotesRef     = this.roomRef.child('guiltyvotes');
    this.popularVoteRef     = this.roomRef.child('listofplayers').orderByChild('votes').limitToLast(1);

    //Transition Screen
    this.dayCounterRef      = this.roomRef.child('daycounter');

    this.msgRef             = firebase.database().ref('messages').child(firebase.auth().currentUser.uid);
    this.globalMsgRef       = firebase.database().ref('globalmsgs').child(roomname);
}

componentWillMount() {

    this.myInfoRef.on('value',snap=>{
        if(snap.exists()){
            
            if(snap.val().roleid){
                //Role information
                this.setState({
                    myroleid:       snap.val().roleid,
                    myrole:         Rolesheet[snap.val().roleid].name,
                    rolerules:      Rolesheet[snap.val().roleid].rules,
                    amimafia:       Rolesheet[snap.val().roleid].type == 1,
                    targetdead:     Rolesheet[snap.val().roleid].targetdead?true:false,
                    targettown:     Rolesheet[snap.val().roleid].targettown?true:false,
                })
            }

            //Button press states and Living state
            this.setState({
                readyvalue:         snap.val().readyvalue,
                presseduid:         snap.val().presseduid,
                amidead:            snap.val().dead,
                myname:             snap.val().name,
            })

        }
    })

    this.ownerRef.on('value',snap=>{
        if(snap.val() == firebase.auth().currentUser.uid){
            this.setState({amiowner:true})
        } else {
            this.setState({amiowner:false})
        }
    })

    this.listRef.on('value',snap=>{
        if(snap.exists()){
            //Update colors + options for Player Name Buttons
            var list = [];
            snap.forEach((child)=> {
                list.push({
                    readyvalue:     child.val().readyvalue,
                    name:           child.val().name,
                    dead:           child.val().dead?true:false,
                    immune:         child.val().immune?true:false,
                    status:         child.val().status?true:false,
                    statusname:     child.val().status,
                    type:           child.val().type,
                    votes:          child.val().votes,
    
                    key:            child.key,
                })
            })
    
            this.setState({namelist:list})
        }
    })

    this.playernumRef.on('value',snap=>{
        if(snap.exists()){

            const mod = snap.val()%2;
            this.setState({ 
                triggernum:     (((snap.val() - mod)/2)+1),
                playernum:      snap.val(),
            })

            this.mafiaRef.orderByChild('alive').equalTo(true).once('value',mafia=>{
                if(mafia.numChildren() == 0){
                    this.phaseRef.set(6)
                }
                else if(mafia.numChildren()*2+1 > snap.val()){
                    this.phaseRef.set(7)
                }
            })
        }
    })

    this.nominationRef.on('value',snap=>{
        if(snap.exists()){
            this.listRef.child(snap.val()).once('value',sp=>{
                this.setState({nominate: snap.val(), nominee: sp.val().name})
            })

            if(snap.val() == firebase.auth().currentUser.uid){
                this.setState({amipicking:true})
            } else { 
                this.setState({amipicking:false}) 
            }
        }
    })

    this.phaseRef.on('value',snap=>{
        if(snap.exists()){

            this.setState({
                phase:snap.val()
            })
            
            this.myInfoRef.once('value',actionbtn=>{
                if(snap.val() == 1){
                    this.setState({
                        phasename:      'Lobby',
                    })
                } else if (snap.val() == 2){
                    if(actionbtn.val().readyvalue == true){
                        this._viewChange(false,false,false,false,false,false,true)
                    } else {
                        this._viewChange(true,false,true,true,true,false,false)
                    }
                    this.setState({
                        phasename:      'DAY',
                        topmessage:     null,
                        btn1:           'VOTE',
                        btn2:           'ABSTAIN',
                        phasecolor:     colors.gamecolor,
                    })
                } else if (snap.val() == 3){
                    if(actionbtn.val().readyvalue == true){
                        this._viewChange(false,false,false,false,false,false,true)
                    } else {
                        this._viewChange(true,false,true,true,true,false,false)
                    }
                    this.setState({
                        phasename:      'Lynch',
                        topmessage:     'has been nominated',
                        btn1:           'INNOCENT',
                        btn2:           'GUILTY',
                        phasecolor:     colors.gamecolor,
                    })
                } else if (snap.val() == 4){
                    this.nominationRef.once('value',nomin=>{
                        if(nomin.val() == firebase.auth().currentUser.uid){
                            this._viewChange(false,false,false,false,false,true,false)
                            this.setState({
                                phasename:      'You are dead',
                                topmessage:     'choose the new killer',
                                phasecolor:     colors.gamecolor,
                            })
                        } else {
                            this._viewChange(false,false,false,false,false,false,true)
                            this.setState({
                                phasename:      '...',
                                topmessage:     'is choosing the new killer',
                                phasecolor:     colors.gamecolor,
                            })
                        }
                    })
                } else if (snap.val() == 5){
                    if(actionbtn.val().readyvalue == true){
                        this._viewChange(false,false,false,false,false,false,true)
                    } else {
                        this._viewChange(true,false,true,true,true,false,false)
                    }
                    this.setState({
                        phasename:      'Night',
                        topmessage:     null,
                        btn1:           'VISIT',
                        btn2:           'STAY HOME',
                        phasecolor:     colors.gamecolor,
                    })
                } else if (snap.val() == 6){
                    this._viewChange(true,false,true,true,true,false,false)
                    this.setState({
                        phasename:      'Town Win',
                        btn1:           'PLAY AGAIN',
                        btn2:           'QUIT',
                        phasecolor:     colors.gamecolor,
                    })
                } else if (snap.val() == 7){
                    this._viewChange(true,false,true,true,true,false,false)
                    this.setState({
                        phasename:      'Mafia Win',
                        btn1:           'PLAY AGAIN',
                        btn2:           'QUIT',
                        phasecolor:     colors.gamecolor,
                    })
                }
            })
                
        }
    })

    this.dayCounterRef.on('value',snap=>{
        if(snap.exists()){
            this.setState({
                daycounter: snap.val(),
            })
        }
    })

    //Count listeners for the room owner
    this.countRef.on('value',snap=>{
        if(snap.exists && this.state.amiowner && ((snap.val()+1)>this.state.playernum)
            && this.state.playernum>0){            
            firebase.database().ref('phases').child(this.state.phase).once('value',phase=>{
                
                //Phase 2 + 4 Handling CONTINUE
                if(phase.val().actionreset){
                    this.roomRef.child('actions').remove();
                    this._resetDayStatuses();
                    this._changePhase(phase.val().continue);
                };
                //Phase 3 Handling both CONTINUE and TRIGGER
                if(phase.val().lynch){

                    this.guiltyVotesRef.once('value',guiltyvotes=>{
    
                        var counter = 0;
                        var names = 'Nobody';
    
                        guiltyvotes.forEach((votechild)=>{ 
                            counter++;
                            if(counter==1){names=votechild.val()}
                            else if(counter>1){names=names+', '+votechild.val()}
                        })
                        
                        this._noticeMsgGlobal(this.state.roomname,'#d31d1d', names + ' voted against ' 
                            + this.state.nominee + '.') 
    
                        if((guiltyvotes.numChildren()+1)>this.state.triggernum){

                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                + this.state.nominate).update({dead:true});
                            this._changePlayerCount(false);

                            firebase.database().ref('rooms/'+ this.state.roomname +'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{

                                this._noticeMsgGlobal(this.state.roomname,'#d31d1d', dead.val().name + ' was hung.')
                                
                                if(dead.val().type == 1){
                                    this.roomRef.child('mafia').child(this.state.nominate).update({alive:false});

                                    if(dead.val().roleid == 'a' || dead.val().roleid == 'b'){
                                        this._changePhase(4);
                                    } else {
                                        this._changePhase(phase.val().trigger)
                                    }
                                } else if (dead.val().roleid == 'W'){
                                    guiltyvotes.forEach((jester)=>{ 
                                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                        + jester.key).update({bloody:true,suspicious:true})
                                    })

                                    this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                        names + ' have blood on their hands and look suspicious.')
                                    this._changePhase(phase.val().trigger)

                                } else {
                                    this._changePhase(phase.val().trigger)
                                }
                            })
                                
                            
                        } else {
                            this._noticeMsgGlobal(this.state.roomname,'#34cd0e',this.state.nominee 
                                + ' was not hung.',1)

                            this.listRef.child(this.state.nominate)
                                .update({immune:true})

                            this._changePhase(phase.val().continue)
                        }

                    })
                };
                //Phase 5 Handling CONTINUE
                if(phase.val().action){
                    
                    new Promise((resolve) => resolve(this._adjustmentPhase())).then(()=>{
                        new Promise((resolve) => resolve(this._actionPhase())).then(()=>{
                            
                            this.guiltyVotesRef.remove();
                            this._resetDayStatuses();
                            
                            this._changePhase(phase.val().continue);

                            //After Night, the day count increases
                            this.dayCounterRef.once('value',daycount=>{
                                this.dayCounterRef.set(daycount.val()+1);
                            })
                        });
                    });
                };

            })
        }
    })

    this.popularVoteRef.on('value',snap=>{
        if(snap.exists() && this.state.amiowner){
            snap.forEach((child)=>{
                if(child.val().votes + 1 > this.state.triggernum){
                    firebase.database().ref('phases').child(this.state.phase).once('value',phase=>{
                        if(phase.val().trigger){
                            if(phase.val().actionreset){
                                firebase.database().ref('rooms/' + this.state.roomname + '/actions')
                                .remove();
                            };
                            if(phase.val().nominate){
                                this.roomRef.update({nominate:child.key});
                                this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                    child.val().name + ' has been nominated.')
                            };
                            this._changePhase(phase.val().trigger);
                        }
                    })
                }
            })
        }
    })

    BackHandler.addEventListener("hardwareBackPress", this._onBackPress);
}

componentWillUnmount() {

    if(this.myInfoRef){
        this.myInfoRef.off();
    }
    if(this.ownerRef){
        this.ownerRef.off();
    }
    if(this.listRef){
        this.listRef.off();
    }
    if(this.playernumRef){
        this.playernumRef.off();
    }
    if(this.nominationRef){
        this.nominationRef.off();
    }
    if(this.phaseRef){
        this.phaseRef.off();
    }
    if(this.nominationRef){
        this.nominationRef.off();
    }

    //Owner Listeners
    if(this.countRef){
        this.countRef.off();
    }
    if(this.popularVoteRef){
        this.popularVoteRef.off();
    }

    //Transition Screen
    if(this.dayCounterRef){
        this.dayCounterRef.off();
    }

    BackHandler.removeEventListener("hardwareBackPress", this._onBackPress);

}

//FIX
_onBackPress = () => {
    if(this.props.route == 2){
        return false
    }
    return true
}

_buttonPress() {
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 200);
}

_changePhase(newphase){
    
    this.listRef.once('value',snap=>{
        snap.forEach((child)=>{
            //Set all votes to 0 and RESET Buttons
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({votes:0, readyvalue:false, presseduid:'foo'})
        })
    }).then(()=>{
        this.roomRef.update({
            phase:newphase,
            count:0,
        })
    })    
}

_resetDayStatuses() {
    this.listRef.once('value',snap=>{
        snap.forEach((child)=>{
            this.listRef.child(child.key).update({
                immune:null, 
                status:null
            })
        })
    })
}

_readyValue(status){
    this.myInfoRef.update({readyvalue: status})
}
_pressedUid(uid){
    this.myInfoRef.update({presseduid: uid})
}
_changeCount(bool){
    if(bool){
        this.countRef.transaction((count)=>{ return count + 1 })
    } else {
        this.countRef.transaction((count)=>{ return count - 1 })
    }
}

_viewChange(title,back,vote,or,abstain,list,waiting) {

    Animated.sequence([
        Animated.parallel([
            Animated.timing(
                this.state.backOpacity, {
                    duration: FADEOUT_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.voteOpacity, {
                    duration: FADEOUT_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.abstainOpacity, {
                    duration: FADEOUT_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.listOpacity, {
                    duration: FADEOUT_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.waitingOpacity, {
                    duration: FADEOUT_ANIM,
                    toValue: 0
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.titleSize, {
                    duration: SIZE_ANIM,
                    toValue: title?0.4:0.13
            }),
            Animated.timing(
                this.state.backSize, {
                    duration: SIZE_ANIM,
                    toValue: back?0.12:0.01
            }),
            Animated.timing(
                this.state.voteSize, {
                    duration: SIZE_ANIM,
                    toValue: vote?0.12:0.01
            }),
            Animated.timing(
                this.state.abstainSize, {
                    duration: SIZE_ANIM,
                    toValue: abstain?0.12:0.01
            }),
            Animated.timing(
                this.state.listSize, {
                    duration: SIZE_ANIM,
                    toValue: list?0.75:0.01
            }),
            Animated.timing(
                this.state.waitingSize, {
                    duration: SIZE_ANIM,
                    toValue: waiting?0.18:0.01
            }),
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.backOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: back?1:0
            }),
            Animated.timing(
                this.state.voteOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: vote?1:0
            }),
            Animated.timing(
                this.state.abstainOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: abstain?1:0
            }),
            Animated.timing(
                this.state.listOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: list?1:0
            }),
            Animated.timing(
                this.state.waitingOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: waiting?1:0
            })
        ])
    ]).start()
}

//Pressing any name button
_nameBtnPress(uid,name,triggernum,phase,roomname){

    this._buttonPress();

    if(phase == 2){ 
        this._viewChange(false,false,false,false,false,false,true)
        this.setState({topmessage:'You have selected ' + name + '.'})

        this._pressedUid(uid);
        this.listRef.child(uid).child('votes').transaction((votes)=>{ return votes + 1 }).then(()=>{
            this._changeCount(true)
            this._readyValue(true)
        })  

    }  else if(phase == 4){
        //Check if selected player is a mafia member
        //change role id on listofplayers
        firebase.database().ref('rooms/' + roomname + '/mafia/' + uid).once('value',mafiacheck=>{
            if(mafiacheck.exists()){
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid + '/roleid').once('value',snap=>{
                    firebase.database().ref('rooms/'+roomname+'/mafia/' + uid)
                        .update({roleid:snap.val()})
                    firebase.database().ref('rooms/'+roomname+'/listofplayers/'
                        + uid).update({roleid:snap.val()})
                })
                this.countRef.set(this.state.playernum)
            } else {
                this.setState({topmessage: name + ' is not a member of the Mafia.'})
            }
        })
    } else if (phase==5) {

        this._viewChange(false,false,false,false,false,false,true)
        this.setState({topmessage:'You have selected ' + name + '.'})

        firebase.database().ref('rooms/' + roomname + '/actions/' 
            + firebase.auth().currentUser.uid).update({
                target:uid,
                targetname:name,
                roleid:this.state.myroleid,
        }).then(()=>{
            firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
                + this.state.myroleid + '/' + firebase.auth().currentUser.uid)
                .set(this.state.myname).then(()=>{
                    this._pressedUid(uid);
                    this._readyValue(true);
                    this._changeCount(true);
                })
        })

    } 
}

_nameBtnLongPress(uid,name,phase){
    if(phase == 5) {
        if(this.state.amimafia){
            this.mafiaRef.once('value',snap=>{
                snap.forEach((child)=>{
                    this._noticeMsg(child.key,this.state.myname+' wants to kill '+name+'.')
                })
            })
        }
    }
}

//Day Phase - VOTE
_optionOnePress() {

    this._buttonPress();
    
    if(this.state.phase == 2){
        this._viewChange(false,true,false,false,false,true,false)
    } else if (this.state.phase == 3){
        this._viewChange(false,false,false,false,false,false,true)
        this.setState({topmessage:'You voted INNOCENT.'})
        this.guiltyVotesRef.child(firebase.auth().currentUser.uid).set(null).then(()=>{
            this._readyValue(true);
            this._changeCount(true);
        })
    } else if (this.state.phase == 5){
        this._viewChange(false,true,false,false,false,true,false)
    } else if (this.state.phase == 6 || this.state.phase == 7){
        alert('feature not available yet')
    }
}

//Day Phase - ABSTAIN
_optionTwoPress() {
    
    this._buttonPress();

    if(this.state.phase == 2){
        this._viewChange(false,false,false,false,false,false,true)
        this._readyValue(true);
        this._changeCount(true);
        this.setState({topmessage:'You abstained.'})
    } else if (this.state.phase == 3){
        this._viewChange(false,false,false,false,false,false,true)
        this.setState({topmessage:'You voted GUILTY.'})
        this.guiltyVotesRef.child(firebase.auth().currentUser.uid).set(this.state.myname).then(()=>{
            this._readyValue(true);
            this._changeCount(true);
        })
    } else if (this.state.phase == 5){
        this._viewChange(false,false,false,false,false,false,true)
        this._readyValue(true);
        this._changeCount(true);
        this.setState({topmessage:'You stayed home.'})
    } else if (this.state.phase == 6 || this.state.phase == 7){
        this._gameOver();
    }
}

//Day Phase - WAITING PRESS
_resetOptionPress() {

    this._buttonPress();

    if(this.state.phase != 4){
        this._viewChange(true,false,true,true,true,false,false)
        this.setState({topmessage:null})
    }

    if(this.state.phase == 2){

        this._readyValue(false);
        this._changeCount(false);

        if(this.state.presseduid != 'foo'){
            this._pressedUid('foo');
            this.listRef.child(this.state.presseduid).child('votes')
                .transaction((votes)=>{ return votes - 1 }) 
        }

    } else if (this.state.phase == 3){

        this.guiltyVotesRef.child(firebase.auth().currentUser.uid).set(null).then(()=>{
            this._readyValue(false);
            this._changeCount(false)
        })

    } else if (this.state.phase == 5){

        firebase.database().ref('rooms/' + this.state.roomname + '/actions/' 
            + firebase.auth().currentUser.uid).update({
                roleid:     null,
                target:     null,
                targetname: null,
            });

        firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + this.state.presseduid 
            + '/' + this.state.myroleid + '/' + firebase.auth().currentUser.uid).set(null)
            .then(()=>{
                this._readyValue(false);
                this._changeCount(false)
                this._pressedUid('foo');
            })
    }
}

_renderPhaseName() {
    if(this.state.phase == 2 || this.state.phase == 5){
        return <Text style = {{color:colors.titlefont, alignSelf:'center', 
        fontFamily: 'ConcertOne-Regular', fontSize:35}}>
        {this.state.phasename + ' ' + this.state.daycounter}
    </Text>
    } else {
        return <Text style = {{color:colors.titlefont, alignSelf:'center', 
        fontFamily: 'ConcertOne-Regular', fontSize:35}}>
        {this.state.phasename}
    </Text>
    }
}

_renderTopMessage(){
    
    if(this.state.phase == 3 || (this.state.phase == 4 && this.state.nominate != firebase.auth().currentUser.uid)){
        return <Text style = {{color:colors.titlefont, alignSelf:'center', 
            fontFamily: 'ConcertOne-Regular', fontSize:14}}>
            {this.state.nominee + ' ' + this.state.topmessage}
        </Text>
    } else {
        return <Text style = {{color:colors.titlefont, alignSelf:'center',
            fontFamily: 'ConcertOne-Regular', fontSize:14}}>
            {this.state.topmessage}
        </Text>
    }
}

//Rendering Main Visuals of Game Board
_renderListComponent(){

    if(this.state.phase==2){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <NameButton
                    onPress={() => {this.state.disabled?{}:
                    this._nameBtnPress(item.key,item.name,this.state.triggernum,
                    this.state.phase,this.state.roomname)}}
                    onLongPress={()=>{
                    this._nameBtnLongPress(item.key,item.name,this.state.phase)
                    }}
                    color = {item.dead ? colors.dead : (item.immune? colors.immune : 
                        (item.status?colors.status:colors.namebtn))}
                    depth = {5}
                    radius = {5}
                    disabled = {this.state.amidead?true:(item.immune?true:item.dead)}
                    component = {<View style = {{flexDirection:'row',alignItems:'center',
                        justifyContent:'center', height:35}}>
                        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
                            'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
                            style={{color:colors.font, fontSize:26}}/>
                        </View>
                        <View style = {{flex:5, justifyContent:'center'}}>
                            {item.dead?
                                <Text style = {styles.concerto}>
                                    {item.name + ' ' + (item.type==2?'(Town)':
                                    item.type==1?'(Mafia)':'(Neutral)')}</Text>
                                :
                                <Text style = {styles.concerto}>{item.name}</Text>
                            }
                        </View>
                        <View style = {{flex:1}}>
                            <Text style = {styles.concerto}>{item.votes>0?item.votes:null}</Text>
                        </View>
                    </View>}
                />
            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.phase==3){
        return null

    } else if (this.state.phase==4){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <NameButton
                    onPress={() => {
                        this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? colors.dead : colors.alive}
                    depth = {5}
                    radius = {5}
                    disabled = {this.state.amipicking?item.dead:false}
                    component = {item.dead?<MaterialCommunityIcons name={item.dead?'skull':null}
                        style={{color:colors.main, fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {styles.dconcerto}>{item.name}</Text>}
                />
            )}
            keyExtractor={item => item.key}
        />

    } else if (this.state.phase==5){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <NameButton
                    onPress={() => {this.state.disabled?{}:
                    this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)
                    }}
                    onLongPress={()=>{
                        this._nameBtnLongPress(item.key,item.name,this.state.phase)
                    }}
                    color = {item.dead ? colors.dead : colors.alive}
                    depth = {5}
                    radius = {5}
                    disabled = {this.state.amidead?true:this.state.targettown?
                        (this.state.targetdead? (item.type==1 || !item.dead) : item.type == 1 ) 
                        : (this.state.targetdead? !item.dead : false )}
                    component={<View style = {{flexDirection:'row',alignItems:'center',
                        justifyContent:'center'}}>
                        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
                            'check-circle':(item.immune?'needle':null)}
                            style={{color:colors.font, fontSize:26}}/>
                        </View>
                        <View style = {{flex:5}}>
                            {item.dead?
                                <Text style = {styles.concerto}>
                                    {item.name + ' ' + (item.type==2?'(Town)':
                                    item.type==1?'(Mafia)':'(Neutral)')}</Text>
                                :
                                <Text style = {styles.concerto}>{item.name}</Text>
                            }
                        </View>
                        <View style = {{flex:1}}>
                            <Text style = {styles.concerto}>{item.votes>0?item.votes:null}</Text>
                        </View>
                    </View>}
                />
            )}
            keyExtractor={item => item.key}
        />
    } else if (this.state.phase==6 || this.state.phase==7){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <NameButton
                    color = {item.dead ? colors.dead : (item.immune? colors.immune : colors.alive)}
                    depth = {5}
                    radius = {5}
                    component = {
                        <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <MaterialCommunityIcons name={item.dead?'skull':null}
                                style={{color:'white', fontSize:26}}/>
                            </View>
                            <View style = {{flex:5}}>
                                <Text style = {styles.dconcerto}>
                                    {item.name + ' ' + (item.type==2?'(Town)':
                                    item.type==1?'(Mafia)':'(Neutral)')}</Text>
                            </View>
                            <View style = {{flex:1}}/>
                        </View>
                    }
                />
            )}
            keyExtractor={item => item.key}
        />
    }
}

_renderWaitingComponent() {
    return <FlatList
        data={this.state.namelist}
        renderItem={({item}) => (
            <Text style = {styles.concerto}>
                {item.name}
            </Text>
        )}
        keyExtractor={item => item.key}
    />
}

//true  -> increase player count by 1
//false -> decrease player count by 1
_changePlayerCount(bool){
    if(bool){
        this.playernumRef.transaction((playernum)=>{return playernum+1})
    } else {
        this.playernumRef.transaction((playernum)=>{return playernum-1})
    }
}

//Sends a private notice message
_noticeMsg(target,message){
    firebase.database().ref('messages/' + target).push({from: 'Private', message: message})
}

//Creates a public notice message
_noticeMsgGlobal(roomname,color,message){
    firebase.database().ref('globalmsgs/' + roomname)
        .push({from: 'Public', color: color, message: message})
}

//Action Roles that adjust
_adjustmentPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{

            if (child.val().E) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target 
                    + '/' + child.val().roleid + '/' + child.key).remove()
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.key) 
                    .update({ targetname: 'Nobody' })
            }

        })
    })
}

//Action Roles
_actionPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{
            if(!child.val().E){
                //Assassin
                if (child.val().roleid == 'a') {
                    firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                    .once('value',innersnap=>{
                        if(!innersnap.val().D){
                            this.listRef.child(child.val().target).update({dead:true});
                            this.myInfoRef.update({bloody:true});
                            this._changePlayerCount(false);

                            this._noticeMsg(child.val().target,'You were stabbed.');
                            this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                child.val().targetname + ' was killed.');
                        } 
                        this._noticeMsg(child.key,'You have stabbed ' + child.val().targetname + '.');
                    })
        
                }
                //Murderer 
                else if (child.val().roleid == 'b') {
                    firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                    .once('value',innersnap=>{
                        if(!innersnap.val().D){
                            this.listRef.child(child.val().target).update({dead:true});
                            this.myInfoRef.update({bloody:true});
                            this._changePlayerCount(false);

                            this._noticeMsg(child.val().target,'You were stabbed.');
                            this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                child.val().targetname + ' was killed.');
                        }
                        this._noticeMsg(child.key,'You have stabbed ' + child.val().targetname + '.');
                    })
    
                }
                //Schemer
                else if (child.val().roleid == 'c') {
                    this._noticeMsg(child.key,'You framed ' + child.val().targetname +" last night.");
                }
                //Spy
                else if (child.val().roleid == 'd') {
                    this.listRef.child(child.val().target).once('value',innersnap=>{
                        this._noticeMsg(child.key,'You spied on ' + child.val().targetname 
                        + ". They are a " + Rolesheet[innersnap.val().roleid].name + '.');
                    })

                }
                //Silencer
                else if (child.val().roleid == 'f') {
                    this.listRef.child(child.val().target).update({ status: 'volume-mute' })
                    this._noticeMsg(child.key,'You silenced ' + child.val().targetname + '.');
                    this._noticeMsg(child.val().target,'You were silenced.');
                }
                //Detective
                else if (child.val().roleid == 'A') {
                    this.listRef.child(child.val().target).once('value',insidesnap=>{
                        this.roomRef.child('actions').child(child.val().target).once('value',scheme=>{
                            if(scheme.val().c || insidesnap.val().suspicious){
                                this._noticeMsg(child.key, child.val().targetname + ' is suspicious ...');
                            } else {
                                this._noticeMsg(child.key, child.val().targetname + ' is not suspicious.');
                            }
                        })
                    })
                }
                //Investigator
                else if (child.val().roleid == 'B') {
                    this.listRef.child(child.val().target).once('value',innersnap=>{
                        if(innersnap.val().bloody){
                            this._noticeMsg(child.key, child.val().targetname + " has blood on their hands.");
                        } else {
                            this._noticeMsg(child.key, child.val().targetname 
                            + " does not have blood on their hands.");
                        }
                    })

                    
                }
                //Doctor
                else if (child.val().roleid == 'D') {
                    firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                    .once('value',insidesnap=>{
                        if(insidesnap.val().a || insidesnap.val().b){
                            this.listRef.child(child.key).update({bloody:true});
                            this._noticeMsg(child.val().target,'The Doctor took care of your stab wounds.');
                            this._noticeMsg(child.key,'You healed ' + child.val().targetname +"'s stab wounds.");
                        } else {
                            this._noticeMsg(child.key, 'You visited '+ child.val().targetname + '.');
                        }
                    })
                }
                //Escort
                else if (child.val().roleid == 'E') {
                    this._noticeMsg(child.val().target, 'You were distracted last night.');
                    this._noticeMsg(child.key, 'You distracted ' + child.val().targetname +" last night.");     
                }
                //Warden
                else if (child.val().roleid == 'G') {
                    this.roomRef.child('actions').child(child.val().target).once('value',insnap=>{
                        var string = 'Nobody';
                        insnap.forEach((visitor)=>{
                            if(visitor.key.length == 1){
                                visitor.forEach((person)=>{
                                    if(person.key != child.key){
                                        if(string == 'Nobody'){
                                            string = person.val();
                                        } else {
                                            string = string + ', ' + person.val();
                                        }
                                    }
                                })
                            }
                        })
                        this._noticeMsg(child.key,string + ' visited ' + child.val().targetname 
                            + "'s house last night.")
                    })
                }
                //Forensic
                else if (child.val().roleid == 'H') {
                    this.listRef.child(child.val().target).once('value',innersnap=>{
                        this._noticeMsg(child.key, child.val().targetname 
                        + "'s body resembles a " + Rolesheet[innersnap.val().roleid].name + '.');
                    })
                }
                //Overseer
                else if (child.val().roleid == 'I') {
                    firebase.database().ref('rooms/' + this.state.roomname + '/actions/' 
                    + child.val().target).once('value',wheredhego=>{
                        if(wheredhego.val().targetname){
                            this._noticeMsg(child.key, child.val().targetname + ' visited ' 
                            + wheredhego.val().targetname +"s house last night.");
                        } else {
                            this._noticeMsg(child.key, child.val().targetname 
                            + ' visited Nobodys house last night.');
                        }
                    })
                }
                //Hunter
                else if (child.val().roleid == 'J') {
                    this.listRef.child(child.key).child('charges').once('value',charges=>{
                        if(charges.val() > 0){
                            firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                            .once('value',innersnap=>{
                                if(!innersnap.val().D){
                                    this.listRef.child(child.val().target).update({dead:true});
                                    this._changePlayerCount(false);
            
                                    this._noticeMsg(child.val().target,'You were shot.');
                                    this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                        child.val().targetname + ' was killed.');
                                } 
                                this._noticeMsg(child.key, 'You shot ' + child.val().targetname + '.');
                            })
                            this.listRef.child(child.key).update({charges: (charges.val()-1)})
                            
                        } else {
                            this._noticeMsg(child.key, 'You are out of bullets.')
                        }
                    })
                }
                //Disguiser
                else if (child.val().roleid == 'K') {
                    this.listRef.child(child.val().target).once('value',role=>{
                        this.myInfoRef.update({roleid:role.val().roleid})
                        this._noticeMsg(child.key,'You took ' + child.val().targetname + "'s role.")
                    })
                }
            }
        })
    })

}

_gameOver() {
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    this.msgRef.remove();
    if(this.state.amiowner){
        this.globalMsgRef.remove();
    }
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value',snap=>{
        if(snap.numChildren() < 2){
            firebase.database().ref('rooms/' + this.state.roomname).remove();
        } else {
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid).remove();
        }
    })
    
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'SignedIn'})
            ]
        })
    )
}
/*<Image source = {require('../../assets/images/night.png')} 
style = {{flex:1, alignSelf:'stretch', width:null}}>*/
render() {

return <View style = {{flex:1,backgroundColor:colors.background, justifyContent:'center'}}>

    <Animated.View style = {{flex:this.state.titleSize,justifyContent:'center',
        borderRadius:2, marginBottom:10}}>
            {this._renderPhaseName()}
            {this._renderTopMessage()}
    </Animated.View>


    <PushButton
        size = {this.state.backSize}
        opacity = {this.state.backOpacity}
        depth = {8}
        color = {colors.pushbutton}
        radius = {30}
        disabled = {this.state.disabled}
        onPress = {()=>{ 
            this._viewChange(true,false,true,true,true,false,false) 
        }}
        component = {
            <Text style = {styles.bconcerto}>RETURN</Text>
        }
    />

    <PushButton
        size = {this.state.voteSize}
        opacity = {this.state.voteOpacity}
        depth = {8}
        color = {colors.pushbutton}
        radius = {30}
        disabled = {this.state.disabled}
        onPress = {()=>{ 
            this._optionOnePress()
        }}
        component = {
            <Text style = {styles.bconcerto}>{this.state.btn1}</Text>
        }
    />

    <PushButton
        size = {this.state.waitingSize}
        opacity = {this.state.waitingOpacity}
        depth = {10}
        color = {colors.pushbutton}
        radius = {50}
        disabled = {this.state.disabled}
        onPress = {()=>{ 
            this._resetOptionPress()
        }}
        component = {<Animatable.View animation={{
                0: {opacity:1},
                0.25:{opacity:0.5},
                0.5:{opacity:0},
                0.75:{opacity:0.5},
                1:{opacity:1},
            }} iterationCount="infinite" duration={2000}>
            <Text style = {styles.bconcerto}>WAITING</Text>
            <Text style = {styles.concerto} >press to cancel</Text>
            </Animatable.View>
        }
    />

    <PushButton
        size = {this.state.voteSize}
        opacity = {this.state.voteOpacity}
        depth = {8}
        color = {colors.pushbutton}
        radius = {30}
        disabled = {this.state.disabled}
        onPress = {()=>{ 
            this._optionTwoPress()
        }}
        component = {
            <Text style = {styles.bconcerto}>{this.state.btn2}</Text>
        }
    />

    <Animated.View style = {{ flex:this.state.listSize,  opacity:this.state.listOpacity,
        justifyContent:'center'}}>
        {this._renderListComponent()}
    </Animated.View>

</View>
}
//</Image>
}

const styles = StyleSheet.create({
    headerFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 30,
        color: colors.background,
        alignSelf:'center',
    },
    continueFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.background,
        alignSelf:'center',
    },
    concerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    bconcerto: {
        fontSize:30,
        fontFamily:'ConcertOne-Regular',
        color:colors.main,
        alignSelf: 'center',
    },
    dconcerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.background,
        alignSelf: 'center',
    },
});