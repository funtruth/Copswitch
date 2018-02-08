
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

        myroleid:           'A',
        targetdead:         '',
        targettown:         '',

        gmsglist:           [],
        msglist:            [],
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

    //Owner Listening
    this.choiceRef          = this.roomRef.child('choice');
    this.loadedRef          = this.roomRef.child('loaded');

    this.msgRef             = this.roomRef.child('msgs');
    this.gMsgRef            = this.roomRef.child('gmsgs');
}

componentWillMount() {

    this.myReadyRef.on('value',snap=>{
        if(snap.exists()){
            
            this._viewCover(false)
            this.setState({ ready:snap.val() })

        } else {

            this._viewCover(true)
            this.setState({ ready:false })

            //PERFORM ACTIONS HERE BEFORE SUBMITTING TRUE

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

                    //Set reference
                    this.myMsgRef       = this.msgRef.orderByChild('place').equalTo(i)
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

            this.myMsgRef.on('value',msgsnap=>{
                if(msgsnap.exists()){
                    var msg = msgsnap.val();
                    var msglist = [];
                    for(i=0;i<msg.length;i++){
                        msglist.push({
                            message:msg[i].message,
                            key:i
                        })
                    }
                    this.setState({msglist:msglist.reverse()})
                } else {
                    this.setState({msglist:[]})
                }
            })

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
    
    this.gMsgRef.on('value',snap=>{
        if(snap.exists()){
            var msg = snap.val();
            var gmsgs = [];
            for(i=0;i<msg.length;i++){
                gmsgs.push({
                    message:    msg[i].message,
                    key:        i+'g',
                })
            }
            this.setState({gmsglist:gmsgs.reverse()})
        } else {
            this.setState({gmsglist:[]})
        }
    })

    this.choiceRef.on('value',snap=>{

        if(this.state.amiowner && snap.exists()){

            var choiceArray = snap.val();
            var playerArray = this.namelist;
            var msgs = [];
            var gMsgs = [];
            var total = 0;

            for(i=0;i<choiceArray.length;i++){
                if(choiceArray[i]) total++
            }

            if(this.state.phase == 1 && total>=this.state.triggernum){

                var flag = false;
                
                for(i=0;i<this.state.triggernum;i++){

                    var count = 0;
                    var players = 0;

                    if(choiceArray[i] && choiceArray[i]!=-1){
                        for(j=0;j<this.state.playernum;j++){
                            if(choiceArray[i] == choiceArray[j]){
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
                    this.choiceRef.remove();
                    this._changePhase(Phases[this.state.phase].trigger);

                } else if(!flag && players >= this.state.playernum){
                    
                    this.choiceRef.remove();
                    this.msgRef.remove();
                    this.gMsgRef.remove();
                    this._resetDayStatuses();
                    this._changePhase(Phases[this.state.phase].continue);
                }
                
            } else if (this.state.phase == 2 && total>=this.state.playernum-1){
            
                var count = 0;
                var names = null;

                for(i=0;i<this.state.playernum;i++){
                    if(choiceArray[i]){
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

                this._noticeMsgGlobal((names||'Nobody') + ' voted against ' + this.namelist[this.state.nominate].name + '.')

                if(count>0){
                    this.listRef.child(this.state.nominate).update({dead:true}).then(()=>{
                        this._changePlayerCount(false);
                    })

                    this._noticeMsgGlobal(this.namelist[this.state.nominate].name + ' was hung.')
                        
                    if(this.namelist[this.state.nominate].roleid == 'a' || this.namelist[this.state.nominate].roleid == 'b'){

                        //TODO NEW MURDERER LOGIC

                    } 
                    
                    this._resetDayStatuses();
                    this._changePhase(Phases[this.state.phase].trigger)
                    
                } else {
                    this._noticeMsgGlobal(this.namelist[this.state.nominate].name + ' was not hung.',1)
                    this.listRef.child(this.state.nominate).update({immune:true})
                    this._changePhase(Phases[this.state.phase].continue)
                }
                
            } else if (this.state.phase == 3 && total>=this.state.playernum){

                for(i=0;i<choiceArray.length;i++){
                    //ROLE BLOCKING
                    if(playerArray[i].roleid == 'E'){
                        //Add rb immunity later
                        choiceArray[choiceArray[i]] = -1
                    }
                    //KILLING
                    //TODO add cloud function to respond to player deaths
                    else if (playerArray[i].roleid == 'a' || playerArray[i].roleid == 'b'){
                        playerArray[choiceArray[i]].dead == true
                    }
                    else if (playerArray[i].roleid == 'J'){
                        playerArray[choiceArray[i]].dead == true
                    }
                    //FRAMING
                    else if (playerArray[i].roleid == 'd'){
                        playerArray[choiceArray[i]].suspicious == true
                    }
                }

                for(i=0;i<choiceArray.length;i++){
                    if(choiceArray[i] != -1){
                        if (playerArray[i].roleid == 'a') {

                            msgs.push([
                                {message:'You were stabbed.',place:choiceArray[i]},
                                {message:'You stabbed ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])

                        }

                        //Murderer 
                        else if (playerArray[i].roleid == 'b') {

                            msgs.push([
                                {message:'You were stabbed.',place:choiceArray[i]},
                                {message:'You stabbed ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])

                        }

                        //Schemer
                        else if (playerArray[i].roleid == 'c') {

                            msgs.push([
                                {message:'You framed ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])
                        }

                        //Spy
                        else if (playerArray[i].roleid == 'd') {

                            msgs.push([
                                {message: 'You spied on ' + playerArray[choiceArray[i]].name + '. They are a'
                                + Rolesheet[playerArray[choiceArray[i]].roleid].name, place:i}
                            ])

                        }
                        //Silencer
                        else if (playerArray[i].roleid == 'f') {

                            playerArray[choiceArray[i]].status = 'volume-mute'

                            msgs.push([
                                {message:'You were silenced.',place:choiceArray[i]},
                                {message:'You silenced ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])

                        }
                        //Detective
                        else if (playerArray[i].roleid == 'A') {

                            msgs.push([
                                {message: playerArray[choiceArray[i]].name + 
                                Rolesheet[playerArray[choiceArray[i]].roleid].suspicious?
                                ' is suspicious.':' is not suspicious', place:i}
                            ])

                        }
                        //Investigator
                        else if (playerArray[i].roleid == 'B') {
                            
                        }
                        //Villager
                        else if (playerArray[i].roleid == 'C') {

                            if(Rolesheet[playerArray[choiceArray[i]].roleid].type != 1){
                                //TODO Promote logic
                                playerArray[choiceArray[i]].raise += playerArray[choiceArray[i]].roleid
                            }

                            msgs.push([
                                {message:'You learned from ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])
                        }
                        //Doctor
                        else if (playerArray[i].roleid == 'D') {
                            
                            if(playerArray[choiceArray[i]].dead){
                                msgs.push([
                                    {message:'You were healed!',place:choiceArray[i]},
                                    {message:'You healed ' + playerArray[choiceArray[i]].name + '!',place:i}
                                ])
                            } else {
                                msgs.push([
                                    {message:'You visited ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])
                            }

                        }
                        //Escort
                        else if (playerArray[i].roleid == 'E') {

                            msgs.push([
                                {message:'You were distracted.',place:choiceArray[i]},
                                {message:'You distracted ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])     

                        }
                        //Warden
                        else if (playerArray[i].roleid == 'G') {

                            for(j=0;j<choiceArray.length;j++){
                                if(i!=j && choiceArray[i] == choiceArray[j]){
                                    msgs.push([
                                        {message:'Someone visited the house you were watching.',place:i},
                                    ]) 
                                }
                            }

                        }
                        //Hunter - out of ammo
                        else if (playerArray[i].roleid == 'H') {
                            
                        }
                        //Overseer
                        else if (playerArray[i].roleid == 'I') {
                            
                        }
                        //Hunter
                        else if (playerArray[i].roleid == 'J') {
                            
                            playerArray[i].roleid = 'H'

                            msgs.push([
                                {message:'You were shot.',place:choiceArray[i]},
                                {message:'You shot ' + playerArray[choiceArray[i]].name + '.',place:i}
                            ])
                        }
                        //Disguiser
                        else if (playerArray[i].roleid == 'K') {
                            
                        }
                    }
                }

                this.gMsgRef.remove();
                this.listRef.update(playerArray)
                this.msgRef.set(msgs)

                this._changePhase(Phases[this.state.phase].continue);
            }
        }
    })

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
                        this.choiceRef.remove();
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
    if(this.myMsgRef){
        this.myMsgRef.off();
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
    if(this.gMsgRef){
        this.gMsgRef.off();
    }

    //Owner Listeners
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
    this.roomRef.child('nextcounter').set(this.state.counter + change).then(()=>{
        this.roomRef.child('ready').remove()
    })
}

_resetDayStatuses() {

    for(i=0;i<this.namelist.length;i++){
        this.listRef.child(i).update({
            immune:null,
            status:null,
            suspicious:null
        })
    }

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
                this.choiceRef.child(this.state.place).set(item.key).then(()=>{this.myReadyRef.set(true)})
            }
        }
    }
}

_nameBtnLongPress(item){
    if(this.state.phase == 3) {
        if(this.state.amimafia){

            //TODO Personal Chat using push()
            for(i=0;i<this.mafialist.length;i++){
                this._noticeMsg(this.namelist[this.mafialist[i].key].uid, 
                    this.namelist[this.state.place].name + ' wants to target ' + item.name + '.')
            }

        }
    }
}

_optionOnePress() {

    this._buttonPress();

    if (this.state.phase == 2){
        this.setState({message:'You voted INNOCENT.'})
        this.choiceRef.child(this.state.place).set(false).then(()=>{this.myReadyRef.set(true)})
    }
}

_optionTwoPress() {
    
    this._buttonPress();

    if(this.state.phase == 1){
        this.setState({message:'You abstained.'})
        this.choiceRef.child(this.state.place).set(-1).then(()=>{this.myReadyRef.set(true)})
    } else if (this.state.phase == 2){
        this.setState({message:'You voted GUILTY.'})
        this.choiceRef.child(this.state.place).set(true).then(()=>{this.myReadyRef.set(true)})
    } else if (this.state.phase == 3){
        this.setState({message:'You stayed home.'})
        this.choiceRef.child(this.state.place).set(-1).then(()=>{this.myReadyRef.set(true)})
    }
}

_resetOptionPress() {

    this._buttonPress();
    this.setState({message:Phases[this.state.phase].message})

    if(this.state.phase == 1){
        this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 2){
        this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    } else if (this.state.phase == 3){
        this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
    }
}

//TODO remove//update function
_noticeMsg(target,message){
    this.msgRef.parent.child(target).push({message: message})
}

//Creates a public notice message
//TODO where to keep global messages? potentially move to main page/
_noticeMsgGlobal(message){
    var gmsgs = this.state.gmsglist;
    this.gMsgRef.set(gmsgs.concat([{message:message}]))
}

//TODO Handling Game Ending
_gameOver() {
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

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
            gmsglist={this.state.gmsglist}
            msglist={this.state.msglist}
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
