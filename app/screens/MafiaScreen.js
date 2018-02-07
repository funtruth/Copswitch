
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
import Phases from '../misc/phases.json';

import { CustomButton } from '../components/CustomButton.js';
import { Console } from '../components/Console.js';
import { Rolecard } from '../components/Rolecard.js';
import { Events } from '../components/Events.js';

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
        phase:              null,
        phasename:          '',
        message:            '',
        nextcounter:        null,

        myroleid:           'A',
        targetdead:         '',
        targettown:         '',

        newslist:           [],
        noteslist:          [],
        profilelist:        [],
        mafialist:          [],
        section:            null,

        triggernum:         1000,
        playernum:          1000,

        ready:              false,
        disabled:           false, //Disabling double button presses
        nReady:             5,

        amidead:            true,
        amimafia:           false,
        amiowner:           false,

        nominate:           '',

        radiusScale:        new Animated.Value(0.25),
        gameover:           false,
    };
    
    this.namelist           = [];

    this.height             = Dimensions.get('window').height;
    this.width              = Dimensions.get('window').width;
    this.user               = firebase.auth().currentUser.uid;

    this.roomRef            = firebase.database().ref('rooms/' + roomname);
    this.myReadyRef         = this.roomRef.child('ready').child(this.user);
    
    this.listRef            = this.roomRef.child('list');
    this.nominationRef      = this.roomRef.child('nominate');
    this.ownerRef           = this.roomRef.child('owner');
    this.counterRef         = this.roomRef.child('counter');
    this.actionRef          = this.roomRef.child('actions');

    //Owner Listening
    this.choiceRef          = this.roomRef.child('choice');
    this.loadedRef          = this.roomRef.child('loaded');

    this.msgRef             = firebase.database().ref('messages').child(this.user);
    this.globalMsgRef       = firebase.database().ref('globalmsgs').child(roomname);
}

componentWillMount() {

    this.myReadyRef.on('value',snap=>{
        if(snap.exists()){
            
            this._viewCover(false)

            if(snap.val() == true){
                this.setState({
                    ready:true,
                })
            } else {
                this.setState({
                    ready:false,
                })
            }
        } else {

            this._viewCover(true)

            //PERFORM ACTIONS HERE BEFORE SUBMITTING TRUE
            this.setState({
                ready:false,
            })
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
    })

    this.ownerRef.on('value',snap=>{
        this.setState({amiowner:snap.val() == this.user})
    })

    this.listRef.on('value',snap=>{
        if(snap.exists()){

            this.namelist = snap.val();
            var playernum = 0;
            var balance = 0;
            var mafialist = [];

            for(i=0;i<this.namelist.length;i++){

                this.namelist[i].key = i;

                //Generate my info
                if(this.namelist[i].uid == this.user){
                    this.setState({
                        place:      i,
                        amidead:    this.namelist[i].dead,
                        myroleid:   this.namelist[i].roleid,
                    })
    
                    this.setState({
                        amimafia:       Rolesheet[this.namelist[i].roleid].type == 1,
                        targetdead:     Rolesheet[this.namelist[i].roleid].targetdead?true:false,
                        targettown:     Rolesheet[this.namelist[i].roleid].targettown?true:false,
                    })
                }

                //Mafialist
                if(Rolesheet[this.namelist[i].roleid].type == 1 && this.namelist[i].uid != this.user){
                    mafialist.push({
                        name:       this.namelist[i].name,
                        rolename:   Rolesheet[this.namelist[i].roleid].name,
                        dead:       this.namelist[i].dead,
                        key:        i,
                    })
                }

                //player number and trigger number + gamestate
                if(!this.namelist[i].dead){

                    playernum++;

                    if(Rolesheet[this.namelist[i].roleid].type == 1){
                        balance--;
                    } else {
                        balance++;
                    }
                }
            }

            this.setState({
                playernum:      playernum,
                triggernum:     ((playernum - playernum%2)/2)+1,
                gameover:       balance == playernum || balance <= 0,

                mafialist:      mafialist,
            })
        }
    })

    //TODO could improve?
    this.nominationRef.on('value',snap=>{
        if(snap.exists()){
            this.setState({nominate: snap.val()})
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
            })
                
        }
    })
    
    this.globalMsgRef.limitToLast(10).on('value',snap=>{
        if(snap.exists()){
            var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    desc:       child.val().message,
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
                    desc:       child.val().message,
                    key:        child.key,
                })
            })
            this.setState({noteslist:msg.reverse()})
        } else {
            this.setState({noteslist:[]})
        }
    })

    this.choiceRef.on('value',snap=>{
        if(this.state.phase == 1){
            if(snap.exists() && this.state.amiowner && snap.val().length>=this.state.triggernum){

                var votesArray = snap.val();
                var flag = false;
                
                for(i=0;i<this.state.triggernum;i++){

                    var count = 0;
                    var players = 0;

                    if(votesArray[i]){
                        for(j=0;j<this.state.playernum;j++){
                            if(votesArray[i] == votesArray[j]){
                                count++
                            }
                        }

                        if(count>=this.state.triggernum){
                            flag = true;
                            this.roomRef.update({nominate:i});
                            this._noticeMsgGlobal(this.namelist[i].name + ' has been nominated.')
                        }

                        players++;
                    }

                    if(flag){break}
                }

                if(flag){
                    this.actionRef.remove();
                    this._changePhase(Phases[this.state.phase].trigger);

                } else if(!flag && players >= this.state.playernum){
                    
                    this.actionRef.remove();
                    this._resetDayStatuses();
                    this._changePhase(Phases[this.state.phase].continue);
                }
            }
        } else if (this.state.phase == 2){
            if(snap.exists() && this.state.amiowner && snap.val().length>=this.state.playernum-1){
                
                var votesArray = snap.val();
                var count = 0;
                var names = null;
    
                for(i=0;i<this.state.playernum;i++){
                    if(votesArray[i]){
                        count++
                        if(!names){
                            names=this.namelist[i].name
                        }
                        else{
                            names+=', '+this.namelist[i].name
                        }
                    } else {
                        count--
                    }
                }
    
                this._noticeMsgGlobal(names||'Nobody' + ' voted against ' + this.namelist[this.state.nominate].name + '.')
    
                if(count>0){
                    this.listRef.child(this.state.nominate).update({dead:true}).then(()=>{
                        this._changePlayerCount(false);
                    })
    
                    this._noticeMsgGlobal(this.namelist[this.state.nominate].name + ' was hung.')
                        
                    if(this.namelist[this.state.nominate].roleid == 'a' || this.namelist[this.state.nominate].roleid == 'b'){
    
                        //TODO NEW MURDERER LOGIC
    
                    } 
                    
                    this._changePhase(Phases[this.state.phase].trigger)
                    
                } else {
                    this._noticeMsgGlobal(this.namelist[this.state.nominate].name + ' was not hung.',1)
                    this.listRef.child(this.state.nominate).update({immune:true})
                    this._changePhase(Phases[this.state.phase].continue)
                }
            }
        } else if (this.state.phase == 3){

        }
    })

    //Count listeners for the room owner
    /*this.readyRef.on('value',snap=>{
        if(snap.exists() && this.state.amiowner && ((snap.numChildren()+1)>this.state.playernum)
            && this.state.playernum>0){
                
                
                //Phase 4 Handling CONTINUE
                if(this.state.phase == 3){
                    
                    new Promise((resolve) => resolve(this._adjustmentPhase())).then(()=>{
                        new Promise((resolve) => resolve(this._actionPhase())).then(()=>{
                            
                            this.choiceRef.remove();
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
    })*/

    this.loadedRef.on('value',snap=>{
        if(snap.exists() && this.state.amiowner){
            if(snap.numChildren() >= this.state.playernum){
                this.roomRef.child('nextcounter').once('value',nextcounter=>{
                    this.roomRef.update({ counter:nextcounter.val() })
                    .then(()=>{

                        for(i=0;i<this.namelist.length;i++){
                            this.roomRef.child('ready').child(this.namelist[i].uid).set(false)
                        }

                        this.loadedRef.remove();
                        this.roomRef.child('nextcounter').remove();

                    })
                })
            }
        }
    })
}

componentWillUnmount() {

    if(this.myReadyRef){
        this.myReadyRef.off();
    }
    if(this.myInfoRef){
        this.myInfoRef.off();
    }
    if(this.ownerRef){
        this.ownerRef.off();
    }
    if(this.listRef){
        this.listRef.off();
    }
    if(this.nominationRef){
        this.nominationRef.off();
    }
    if(this.counterRef){
        this.counterRef.off();
    }

    //Owner Listeners
    if(this.choiceRef){
        this.choiceRef.off();
    }
    if(this.choiceRef){
        this.choiceRef.off();
    }
    if(this.loadedRef){
        this.loadedRef.off();
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
            this.choiceRef.remove()
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
                this.choiceRef.child(this.state.place).set(item.key).then(()=>{this.myReadyRef.set(true)})
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
                this.actionRef.child(this.state.place).set(item.key).then(()=>{this.myReadyRef.set(true)})
            }
        }
    }
}

_nameBtnLongPress(item){
    if(this.state.phase == 3) {
        if(this.state.amimafia){

            for(i=0;i<this.mafialist.length;i++){
                this._noticeMsg(this.namelist[this.mafialist[i].key].uid, 
                    this.namelist[this.state.place].name + ' wants to target ' + item.name + '.')
            }

        }
    }
}

//Day Phase - VOTE
_optionOnePress() {

    this._buttonPress();

    if (this.state.phase == 2){
        this.setState({message:'You voted INNOCENT.'})
        this.choiceRef.child(this.state.place).set(false).then(()=>{this.myReadyRef.set(true)})
    }
}

//Day Phase - ABSTAIN
_optionTwoPress() {
    
    this._buttonPress();

    if(this.state.phase == 1){
        this.myReadyRef.set(true);
        this.setState({message:'You abstained.'})
    } else if (this.state.phase == 2){
        this.setState({message:'You voted GUILTY.'})
        this.choiceRef.child(this.state.place).set(true).then(()=>{this.myReadyRef.set(true)})
    } else if (this.state.phase == 3){
        this.myReadyRef.set(true);
        this.setState({message:'You stayed home.'})
    }
}

//Day Phase - WAITING PRESS
_resetOptionPress() {

    this._buttonPress();
    this.setState({message:Phases[this.state.phase].message})

    if(this.state.phase == 1){
        this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 2){
        this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 3){
        this.actionRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    }
}

//Sends a private notice message
_noticeMsg(target,message){
    this.msgRef.parent.child(target).push({message: message})
}

//Creates a public notice message
_noticeMsgGlobal(message){
    this.globalMsgRef.push({message: message})
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
                                            string += ', ' + person.val();
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
    this.listRef.once('value',snap=>{
        if(snap.numChildren() <= 1){
            this.roomRef.remove();
        } else {
            this.listRef.child(this.state.place).remove();
        }
    })
    
    this.props.screenProps.navigate('Home')
}

_viewCover(cover){
    Animated.timing(
        this.state.radiusScale, {
            duration: FADEOUT_ANIM,
            toValue: cover?5:0.25
        }
    ).start()
}

//Rendering player list
_renderListComponent(){

    return <View style = {{
        position:'absolute', left:0, top:MARGIN*2, bottom:MARGIN*2, right:0,
        borderRadius:5,
    }}>
        <FlatList
            data={this.namelist}
            renderItem={({item}) => (this._renderItem(item))}
            keyExtractor={item => item.uid}
        />
    </View>
    
}

_renderItem(item){
    return <TouchableOpacity
        style = {{flexDirection:'row',alignItems:'center',
                justifyContent:'center', height:40, marginBottom:5, borderRadius:5,
        backgroundColor: item.dead ? colors.dead : (item.immune? colors.immune :
                    (item.status?colors.status:colors.shadow))}}   
        onPress         = {() => { this._nameBtnPress(item) }}
        onLongPress     = {() => { this._nameBtnLongPress(item) }}
        disabled        = {this.state.disabled}
    >
        <View style = {{flex:0.15,justifyContent:'center',alignItems:'center'}}>
        <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
            'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
            style={{color:colors.font, fontSize:26}}/>
        </View>
        <View style = {{flex:0.7, justifyContent:'center'}}>
            <Text style = {styles.lfont}>{false?item.name + ' (' + Rolesheet[item.roleid].name + ') ':
                item.name}</Text>
        </View>
        <View style = {{flex:0.15}}/>
    
    </TouchableOpacity>
}

//background info
_renderInfo(section){
    if(section){
        return <Rolecard
            roleid={this.state.myroleid}
            amimafia={this.state.amimafia}
            mafialist={this.state.mafialist}
        />
    } else if (section == false){
        return <Events
            eventslist={this.state.newslist}
        />
    } else {
        return null
    }
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
            onPress = {()=>this.setState({ section:true}) }>
            <FontAwesome name='user'
                style={{color:colors.font,fontSize:20,textAlign:'center'}}/>
            <Text style = {{color:colors.font,marginLeft:0}}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style = {{alignItems:'center',flex:0.3}}
            onPress = {()=>this.setState({ section:null}) }>
            <FontAwesome name='gamepad'
                style={{color:colors.font,fontSize:40,textAlign:'center'}}/>
        </TouchableOpacity>

        <TouchableOpacity style = {{justifyContent:'center', alignItems:'center', flex:0.15}}
            onPress = {()=>this.setState({ section:false}) }>
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
    <View style = {{flex:1,backgroundColor:'rgba(0, 0, 0, 0.3)',alignItems:'center'}}>

        {this._renderInfo(this.state.section)}
        {this._renderNav()}

        <Animated.View style = {{position:'absolute', elevation:0, bottom:0,
            height:this.height*4/9, width:this.height*4/9, borderRadius:this.height*2/9, backgroundColor: colors.shadow,
            justifyContent:'center', alignItems:'center',
            transform: [
                {scale:this.state.radiusScale}
            ],
        }}/>

        <Console
            title = {(this.state.phase == 1 || this.state.phase == 3)?
                this.state.phasename + ' ' + (this.state.counter - this.state.counter%3)/3
                :this.state.phasename}
            subtitle = {this.state.message}
            phase = {this.state.phase}
            okay = {this.state.btn1}
            cancel = {this.state.btn2}
            ready = {this.state.ready}
            list = {this._renderListComponent()}
            onOne = {() => this._optionOnePress()}
            onTwo = {() => this._optionTwoPress()}
            onBack = {() => this._resetOptionPress()}
        />

    </View>
</View>
}
//</Image>
}
