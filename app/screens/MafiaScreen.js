
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    FlatList,
    Animated,
    Dimensions,
    TouchableOpacity
}   from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';
import Screens from '../misc/screens.json';
import Images from '../../assets/images/index.js';
import Phases from '../misc/phases.json';

import { CustomButton } from '../components/CustomButton.js';
import { Console } from '../components/Console.js';

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
const FADEIN_ANIM = 600;

const MARGIN = 10;

export default class Mafia_Screen extends React.Component {

constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname:           params.roomname,
        counter:            '',
        phasename:          '',
        message:            '',
        nextcounter:        null,

        myroleid:           '',
        targetdead:         '',
        targettown:         '',

        namelist:           [],
        deadlist:           [],
        newslist:           [],
        noteslist:          [],
        profilelist:        [],
        mafialist:          [],
        section:            'alive',

        triggernum:         1000,
        playernum:          1000,

        ready:              false,
        disabled:           false,
        nReady:             5,

        amidead:            false,
        amimafia:           false,
        amiowner:           false,

        nominate:           '',
        nominee:            '',

        gameover:           false,
        showOptions:        true,
        
        messageOpacity:     new Animated.Value(1),
        contOpacity:        new Animated.Value(0),
        cancelOpacity:      new Animated.Value(0),
    };
    
    this.namelist           = [];

    this.height             = Dimensions.get('window').height;
    this.width              = Dimensions.get('window').width;
    this.user               = firebase.auth().currentUser.uid;

    this.roomRef            = firebase.database().ref('rooms/' + roomname);
    this.placeRef           = this.roomRef.child('place').child(this.user);
    this.deadRef            = this.roomRef.child('dead').child(this.user);
    this.myReadyRef         = this.roomRef.child('ready').child(this.user);
    
    this.listRef            = this.roomRef.child('listofplayers');
    this.mafiaRef           = this.roomRef.child('mafia');
    this.playernumRef       = this.roomRef.child('playernum');
    this.nominationRef      = this.roomRef.child('nominate');
    this.ownerRef           = this.roomRef.child('owner');
    this.counterRef         = this.roomRef.child('counter');
    this.actionRef          = this.roomRef.child('actions');

    //Owner Listening
    this.ballotsRef         = this.roomRef.child('ballots');
    this.voteRef            = this.roomRef.child('votes');
    this.readyRef           = this.roomRef.child('ready').orderByValue().equalTo(true);
    this.loadedRef          = this.roomRef.child('loaded');

    this.msgRef             = firebase.database().ref('messages').child(this.user);
    this.globalMsgRef       = firebase.database().ref('globalmsgs').child(roomname);
}

componentWillMount() {

    this.placeRef.once('value',snap=>{
        if(snap.exists()){
            this.setState({place:snap.val()})
            
            this.listRef.child(snap.val()).once('value',info=>{
                if(info.exists() && info.val().roleid){

                    var profilelist = [];
                    
                    profilelist.push({
                        myrole:         Rolesheet[info.val().roleid].name,
                        rolerules:      Rolesheet[info.val().roleid].rules,
                        win:            Rolesheet[info.val().roleid].win,
                        fl:             5,
    
                        key:            info.val().roleid,
                    })
    
                    this.setState({
                        myroleid:       info.val().roleid,
                        amimafia:       Rolesheet[info.val().roleid].type == 1,
                        targetdead:     Rolesheet[info.val().roleid].targetdead?true:false,
                        targettown:     Rolesheet[info.val().roleid].targettown?true:false,
                        profilelist:    profilelist
                    })
                }
            })
        }
    })

    this.deadRef.on('value',snap=>{
        if(snap.exists()){
            this.setState({amidead:true})
        }
    })

    this.myReadyRef.on('value',snap=>{
        if(snap.exists()){
            if(this.state.amidead){
                this._viewChange(false,false)
                this.setState({message:'You are dead'})
            } else if(snap.val() == true){
                this.setState({disabled:true})
                this._viewChange(false,true)
            } else {
                this.setState({disabled:false})
                this._viewChange(true,false)
            }
        } else {
            if(this.state.amidead){
                this._viewChange(false,false)
            } else {
                this._viewChange(false,false)
                setTimeout(()=>{
                    this.myReadyRef.once('value',snap=>{
                        if(snap.exists()){
                            this.myReadyRef.remove();
                        } else {
                            this.loadedRef.child(this.user).set(true)
                        }
                    })
                },1500)
            }
        }
    })

    this.ownerRef.on('value',snap=>{
        this.setState({amiowner:snap.val() == this.user})
    })

    this.listRef.on('value',snap=>{
        if(snap.exists()){
            //Update colors + options for Player Name Buttons
            
            this.namelist = snap.val();
    
            this.setState({
                deadlist:snap.val(),
            })
        }
    })

    this.mafiaRef.on('value',snap=>{
        if(snap.exists()){
            var mafialist = [];
            snap.forEach((child)=>{
                mafialist.push({
                    name:       child.val().name,
                    rolename:   Rolesheet[child.val().roleid].name,
                    alive:      child.val().alive,
                    key:        child.key,
                })
            })
            this.setState({mafialist:mafialist})
        }
    })

    this.playernumRef.on('value',snap=>{
        if(snap.exists()){

            const minusone = snap.val() - 1;
            const mod = minusone%2;

            this.setState({ 
                triggernum:     (((minusone - mod)/2)+1),
                playernum:      snap.val(),
            })

            //MOVE THIS CRAP
            this.mafiaRef.orderByChild('alive').equalTo(true).once('value',mafia=>{
                if(mafia.numChildren() == 0){
                    //TODO
                }
                else if(mafia.numChildren()*2+1 > snap.val()){
                    //TODO
                }
            })
        }
    })

    //TODO
    this.nominationRef.on('value',snap=>{
        if(snap.exists()){
            this.listRef.child(snap.val()).once('value',sp=>{
                this.setState({nominate: snap.val(), nominee: sp.val().name})
            })
        }
    })

    //Phases are 1-Day, 2-Lynching, 3-Night
    //Day counter starts at 3
    this.counterRef.on('value',snap=>{
        if(snap.exists()){

            const phase = snap.val() % 3 + 1

            this.setState({
                counter: snap.val(),

                phase:phase,
                phasename: (Phases[phase]).name,
                message: (Phases[phase]).message,
                btn1: (Phases[phase]).btn1,
                btn2: (Phases[phase]).btn2,
                phasecolor: (Phases[phase]).phasecolor,
            })
                

        }
    })
    
    this.globalMsgRef.on('value',snap=>{
        if(snap.exists()){
            var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    counter:    child.val().counter,
                    desc:       child.val().message,
                    fl:         2,

                    key:        child.key,
                })
            })
            this.setState({newslist:msg.reverse()})
        } else {
            this.setState({newslist:[]})
        }
    })

    this.msgRef.on('value',snap=>{
        if(snap.exists()){
            var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    counter:    child.val().counter,
                    desc:       child.val().message,
                    fl:         2,

                    key:        child.key,
                })
            })
            this.setState({noteslist:msg.reverse()})
        } else {
            this.setState({noteslist:[]})
        }
    })

    //Count listeners for the room owner
    this.readyRef.on('value',snap=>{
        if(snap.exists() && this.state.amiowner && ((snap.numChildren()+1)>this.state.playernum)
            && this.state.playernum>0){
                //Phase 2 CONTINUE
                if(this.state.phase == 1){
                    
                    this.voteRef.once('value').then((votes)=>{
                        if(votes.exists()){
                            var counter = 0;
                            votes.forEach((child)=>{
                                counter ++;
                                if(child.numChildren() + 1 > this.state.triggernum){
                                    //Do nothing
                                } else if (counter+1 > votes.numChildren()){
                                    this.actionRef.remove();
                                    this._resetDayStatuses();
                                    this._changePhase(Phases[this.state.phase].continue);
                                }
                            });
                        } else {
                            this.actionRef.remove();
                            this._resetDayStatuses();
                            this._changePhase(Phases[this.state.phase].continue);
                        }
                    })
                }
                //Phase 3 Handling both CONTINUE and TRIGGER
                else if(this.state.phase == 2){
                    
                    this.ballotsRef.once('value',ballots=>{

                        var counter = 0;
                        var names = 'Nobody';

                        ballots.forEach((votechild)=>{ 
                            counter++;
                            if(counter==1){names=votechild.val()}
                            else if(counter>1){names=names+', '+votechild.val()}
                        })
                        
                        this._noticeMsgGlobal(this.state.roomname,'#d31d1d', names + ' voted against ' 
                            + this.state.nominee + '.') 

                        if((ballots.numChildren()+1)>this.state.triggernum){

                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                + this.state.nominate).update({dead:true}).then(()=>{
                                    this._changePlayerCount(false);
                                })

                            firebase.database().ref('rooms/'+ this.state.roomname +'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{

                                this._noticeMsgGlobal(this.state.roomname,'#d31d1d', dead.val().name + ' was hung.')
                                
                                if(dead.val().type == 1){
                                    this.roomRef.child('mafia').child(this.state.nominate).update({alive:false});

                                    if(dead.val().roleid == 'a' || dead.val().roleid == 'b'){
                                        this._changePhase(4);
                                    } else {
                                        this._changePhase(Phases[this.state.phase].trigger)
                                    }
                                } else if (dead.val().roleid == 'W'){
                                    ballots.forEach((jester)=>{ 
                                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                        + jester.key).update({bloody:true,suspicious:true})
                                    })

                                    this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                        names + ' have blood on their hands and look suspicious.')
                                    this._changePhase(Phases[this.state.phase].trigger)

                                } else {
                                    this._changePhase(Phases[this.state.phase].trigger)
                                }
                            })
                                
                            
                        } else {
                            this._noticeMsgGlobal(this.state.roomname,'#34cd0e',this.state.nominee 
                                + ' was not hung.',1)

                            this.listRef.child(this.state.nominate).update({immune:true})

                            this._changePhase(Phases[this.state.phase].continue)
                        }

                    })
                }
                //Phase 4 Handling CONTINUE
                else if(this.state.phase == 3){
                    
                    new Promise((resolve) => resolve(this._adjustmentPhase())).then(()=>{
                        new Promise((resolve) => resolve(this._actionPhase())).then(()=>{
                            
                            this.ballotsRef.remove();
                            this._resetDayStatuses();
                            
                            this._changePhase(Phases[this.state.phase].continue);

                            //After Night, the day count increases
                            this.counterRef.once('value',daycount=>{
                                this.counterRef.set(daycount.val()+1);
                            })
                        });
                    });
                };
        }
    })

    this.voteRef.on('value', snap=>{
        //Votes should only exist in Phase 2
        if(snap.exists() && this.state.amiowner){
            snap.forEach((child)=>{
                if(child.numChildren() + 1 > this.state.triggernum){
                    if(Phases[this.state.phase].trigger){
                        this.actionRef.remove();

                        this.roomRef.update({nominate:child.key});
                        this.listRef.child(child.key).child('name').once('value',getname=>{
                            this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                            getname.val() + ' has been nominated.')
                        })

                        this._changePhase(Phases[this.state.phase].trigger);
                    }
                }
            })
        }
    })

    this.loadedRef.on('value',snap=>{
        if(snap.exists() && this.state.amiowner){
            if(snap.numChildren() == this.state.playernum){
                this.roomRef.child('nextcounter').once('value',nextcounter=>{
                    this.roomRef.update({ counter:nextcounter.val() })
                    .then(()=>{
                        this.listRef.once('value',snap=>{
                            snap.forEach((child)=>{
                                //Set all votes to 0 and RESET Buttons
                                this.roomRef.child('ready').child(child.key).set(false).then(()=>{
                                    this.loadedRef.remove();
                                    this.roomRef.child('nextcounter').remove();
                                })
                            })
                        })
                    })
                })
            }
        }
    })
}

componentWillUnmount() {

    if(this.deadRef){
        this.deadRef.off();
    }
    if(this.myReadyRef){
        this.myReadyRef.off();
    }
    if(this.ownerRef){
        this.ownerRef.off();
    }
    if(this.listRef){
        this.listRef.off();
    }
    if(this.mafiaRef){
        this.mafiaRef.off();
    }
    if(this.playernumRef){
        this.playernumRef.off();
    }
    if(this.nominationRef){
        this.nominationRef.off();
    }
    if(this.nominationRef){
        this.nominationRef.off();
    }

    //Owner Listeners
    if(this.readyRef){
        this.readyRef.off();
    }
    if(this.voteRef){
        this.voteRef.off();
    }
    if(this.loadedRef){
        this.loadedRef.off();
    }

    //Transition Screen
    if(this.counterRef){
        this.counterRef.off();
    }
}

_buttonPress() {
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1100);
}

_changePhase(change){
    this.setState({nextcounter:this.state.counter + change})
    this.roomRef.child('nextcounter').set(this.state.counter + change).then(()=>{
        this.roomRef.child('ready').remove().then(()=>{
            this.voteRef.remove()
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

//1100 ms TOTAL
//DEPRECATED: title, vote, abstain, list
_viewChange(cont,cancel) {
    Animated.parallel([
        Animated.timing(
            this.state.cancelOpacity, {
                duration: FADEIN_ANIM,
                toValue: cancel?1:0
        }),
        Animated.timing(
            this.state.contOpacity, {
                duration: FADEIN_ANIM,
                toValue: cont?1:0
        })
    ]).start()
}

//Pressing any name button
_nameBtnPress(item){

    if(!this.state.disabled){

        this._buttonPress();

        if(this.state.phase == 1){ 
            if(this.state.amidead){
                this.setState({message:'You are Dead.'})
            } else if (item.dead){
                this.setState({message:'That player is Dead.'})
            } else if (item.immune){
                this.setState({message:'That player is Immune'})
            } else {
                this.setState({message:'You have selected ' + item.name + '.'})
                this.voteRef.child(this.state.place).set(item.place).then(()=>{this.myReadyRef.set(true)})
            }
        } else if (this.state.phase == 3) {

            if(this.state.amidead){
                this.setState({message:'You are Dead.'})
            } else if (this.state.targettown && item.type != 2){
                this.setState({message:'Select a Town Player.'})
            } else if (this.state.targetdead && !item.dead){
                this.setState({message:'Select a Dead player.'})
            } else {
                this.setState({message:'You have selected ' + item.name + '.'})
                this.actionRef.child(this.state.place).set(item.place).then(()=>{this.myReadyRef.set(true)})
            }
        }
    }
}

_nameBtnLongPress(item){
    if(this.state.phase == 3) {
        if(this.state.amimafia){
            this.mafiaRef.once('value',snap=>{
                snap.forEach((child)=>{
                    this._noticeMsg(child.key, this.state.myname + ' wants to kill ' + item.name + '.')
                })
            })
        }
    }
}

//Day Phase - VOTE
_optionOnePress() {

    this._buttonPress();
    
    if(this.state.phase == 1){
        this._viewChange(false,true)
    } else if (this.state.phase == 2){
        this.setState({message:'You voted INNOCENT.'})
        this.ballotsRef.child(this.state.place).set(false).then(()=>{this.myReadyRef.set(true)})
    } else if (this.state.phase == 3){
        this._viewChange(false,true)
    } else if (this.state.phase == 6 || this.state.phase == 7){
        alert('feature not available yet')
    }
}

//Day Phase - ABSTAIN
_optionTwoPress() {
    
    if(this.state.phase != 6 && this.state.phase != 7){
        this._buttonPress();
    }

    if(this.state.phase == 1){
        this.myReadyRef.set(true);
        this.setState({message:'You abstained.'})
    } else if (this.state.phase == 2){
        this.setState({message:'You voted GUILTY.'})
        this.ballotsRef.child(this.state.place).set(true).then(()=>{this.myReadyRef.set(true)})
    } else if (this.state.phase == 3){
        this.myReadyRef.set(true);
        this.setState({message:'You stayed home.'})
    } else if (this.state.phase == 6 || this.state.phase == 7){
        this._gameOver();
    }
}

//Day Phase - WAITING PRESS
_resetOptionPress() {

    this._buttonPress();
    this.setState({message:Phases[this.state.phase].message})

    if(this.state.phase != 3){
        this._viewChange(true,false)
        this.setState({message:null, disabled:false})
    }

    if(this.state.phase == 1){
        this.voteRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 2){
        this.ballotsRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 3){
        this.actionRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    }
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
    this.msgRef.child(target).push({counter: this.state.counter, message: message})
}

//Creates a public notice message
_noticeMsgGlobal(message){
    this.globalMsgRef.push({counter: this.state.counter, message: message})
}

//Action Roles that adjust
_adjustmentPhase() {
    this.actionRef.once('value',snap=>{
        snap.forEach((child)=>{

            if (child.val().E) {
                this.actionRef.child(child.val().target).child(child.val().roleid)
                    .child(child.key).remove()
                this.actionRefchild(child.key).update({ targetname: 'Nobody' })
            }

        })
    })
}

//Action Roles
_actionPhase() {
    this.actionRef.once('value',snap=>{
        snap.forEach((child)=>{
            if(!child.val().E){
                //Assassin
                if (child.val().roleid == 'a') {
                    this.actionRef.child(child.val().target).once('value',innersnap=>{
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
                    this.actionRef.child(child.val().target).once('value',innersnap=>{
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
                        this.actionRef.child(child.val().target).once('value',scheme=>{
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
                    this.actionRef.child(child.val().target).once('value',insidesnap=>{
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
                    this.actionRef.child(child.val().target).once('value',insnap=>{
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
                    this.actionRef.child(child.val().target).once('value',wheredhego=>{
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
                            this.actionRef.child(child.val().target).once('value',innersnap=>{
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
                + this.user).remove();
        }
    })
    
    this.props.screenProps.navigate('Home')
}

_renderPhaseName() {
    return <View style = {{
        height:this.height*0.07, width:this.width*0.3,
        borderBottomRightRadius:30, borderTopRightRadius:30, justifyContent:'center', backgroundColor:colors.color8
    }}>
            <Text style = {{color:colors.titlefont, alignSelf:'center', 
                fontFamily: 'LuckiestGuy-Regular', fontSize:20}}>
                {(this.state.phase == 1 || this.state.phase == 3)?
                    this.state.phasename + ' ' + (this.state.counter - this.state.counter%3)/3
                    :this.state.phasename}
            </Text>
        
    </View>
}

//Rendering Main Visuals of Game Board
_renderListComponent(){

    return <View style = {{
        position:'absolute', left:MARGIN*2, top:MARGIN*2, bottom:MARGIN*2, right:MARGIN*2,
        borderRadius:5,
    }}>
        <FlatList
        data={this.state.list?this.state.list:this.namelist}
        renderItem={({item}) => (this._renderItem(item))}
        keyExtractor={item => item.uid?item.uid:item.key}
    />
    </View>
    
}

_renderInfo(){
    return <View style = {{
        position:'absolute', left:MARGIN*2, top:MARGIN*5, bottom:MARGIN*2, right:MARGIN*2,
    }}>
        <FlatList
        data={this.state.list?this.state.list:this.namelist}
        renderItem={({item}) => (this._renderInfoItem(item))}
        keyExtractor={item => item.uid?item.uid:item.key}
    />
    </View>
}

_renderInfoItem(item){
    if (item.fl == 2){
        return <View>
            <Text style = {styles.counterfont}>{
                Phases[item.counter%3 + 1].name + ' ' + (item.counter - item.counter%3)/3
            }</Text>
            <Text style = {styles.roleDesc}>{item.desc}</Text>
        </View>
    } else if (item.fl == 4){
        return <Text style = {styles.lfont}>{item.counter}</Text>
    } else if(item.fl == 5){
        return <View style = {{height:this.height*0.55, justifyContent: 'center', alignItems: 'center' }}>
            <Text style = {styles.lfont}>you are a:</Text>
            <Text style = {styles.mfont}>{item.myrole}</Text>
            <Text style = {styles.lfont}>At night you:</Text>
            <Text style = {styles.roleDesc}>{item.rolerules}</Text>
            {this.state.amimafia?<View>
                <Text style = {styles.lfont}>Your teammates:</Text>
                <FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <Text style={[styles.roleDesc,{textDecorationLine:item.alive?'none':'line-through'}]}>
                            {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                    )}
                    keyExtractor={item => item.key}
                /></View>:<View><Text style = {styles.lfont}>you win when:</Text>
                <Text style = {styles.roleDesc}>{item.win}</Text></View>}
        </View>
    }
}

_renderItem(item){
    if (item.fl == 2){
        return <View>
            <Text style = {styles.counterfont}>{
                Phases[item.counter%3 + 1].name + ' ' + (item.counter - item.counter%3)/3
            }</Text>
            <Text style = {styles.roleDesc}>{item.desc}</Text>
        </View>
    }
}

_renderMessage(flex){
    return <View style = {{flex:flex}}>
        <Animated.View style = {{
            opacity:this.state.messageOpacity,
            position:'absolute',left:0, right:0, height:this.height*0.05,
            justifyContent:'center', alignItems:'center'
            }}>
            <Text style = {styles.plainfont}>{this.state.message}</Text>
        </Animated.View>
    </View>    
}

_renderWaiting(flex){
    return <View style = {{flex:flex, justifyContent:'center'}}>
        <View style = {{
            position:'absolute', left:this.width*0.04, height:this.height*0.04, width:this.width*0.15,
            borderRadius:15,
            backgroundColor:colors.progressd, justifyContent:'center', alignItems:'center'
        }}> 
            <Text style = {styles.plainfont}>6/10</Text>
        </View>
        
        <View style = {{
            position:'absolute', right:this.width*0.04, height:this.height*0.02, width:this.width*0.7,
            borderRadius:10,
            backgroundColor:colors.progressd
        }}>
            <View style = {{
                position:'absolute', left:0,
                height:this.height*0.02, width:this.width*0.5*5/7,
                borderRadius:10,
                backgroundColor:colors.progressbar
            }}/>
        </View>
    </View>
}

_renderNav(){
    return <View style = {{position:'absolute',bottom:MARGIN,left:0,right:0,
        height:this.height*0.1, flexDirection:'row', justifyContent:'center'}}>

        <TouchableOpacity style = {{justifyContent:'center', alignItems:'center', flex:0.15}}
            onPress = {()=>this.setState({ list:this.state.profilelist,section:'profile'}) }>
            <FontAwesome name='user'
                style={{color:colors.font,fontSize:20,textAlign:'center'}}/>
            <Text style = {{color:colors.font,marginLeft:0}}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {{alignItems:'center',flex:0.3}}
            onPress = {()=>this.setState({ list:this.state.newslist,section:'news'}) }>
            <FontAwesome name='gamepad'
                style={{color:colors.font,fontSize:40,textAlign:'center'}}/>
        </TouchableOpacity>

        <TouchableOpacity style = {{justifyContent:'center', alignItems:'center', flex:0.15}}
            onPress = {()=>this.setState({ list:this.state.newslist,section:'news'}) }>
            <FontAwesome name='globe'
                style={{color:colors.font,fontSize:20,textAlign:'center'}}/>
            <Text style = {{color:colors.font,marginRight:0}}>Events</Text>
        </TouchableOpacity>
    </View>
}

/*<Image source = {require('../../assets/images/night.png')} 
style = {{flex:1, alignSelf:'stretch', width:null}}>*/
render() {

return <View style = {{flex:1,backgroundColor:colors.gameback}}>

    {this._renderInfo()}

    <Console
        title = {(this.state.phase == 1 || this.state.phase == 3)?
            this.state.phasename + ' ' + (this.state.counter - this.state.counter%3)/3
            :this.state.phasename}
        subtitle = {this.state.message}
        okay = {this.state.btn1}
        cancel = {this.state.btn2}
        visible = {true}
        onClose = {() => {}}
        onOne = {() => this._optionOnePress()}
        onTwo = {() => this._optionTwoPress()}
    />

    {this._renderNav()}

</View>
}
//</Image>
}
