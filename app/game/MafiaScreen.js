
import React, { Component } from 'react';
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
import Rolesheet from '../misc/roles.json';
import Screens from '../misc/screens.json';
import Phases from '../misc/phases.json';

import { Alert } from '../components/Alert.js';
import { Button } from '../components/Button.js';
import Console from './components/Console.js';
import { Rolecard } from '../components/Rolecard.js';
import { Events } from '../components/Events.js';
import General from './components/General.js';
import Private from './components/Private.js';
import { RuleBook, InfoPage, Roles } from '../menu/ListsScreen.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import * as Animatable from 'react-native-animatable';
const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)

import firebaseService from '../firebase/firebaseService';
import playerActions from './mods/playerActions';
import ownerModule from './mods/ownerModule';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

class MafiaScreen extends Component {

constructor(props) {
    super(props);

    this.state = {
        message:            '',

        myroleid:           'A',
        targetdead:         '',
        targettown:         '',

        gmsglist:           [],
        msglist:            [],
        newslist:           [],

        mafialist:          [],
        section:            null,

        triggernum:         1000,
        playernum:          1000,

        ready:              false,
        nReady:             5,

        amidead:            true,
        amimafia:           false,
        amiowner:           false,

        nominate:           '',
        gameover:           false,
    };
    
    this.newslist           = [];
    this.namelist           = [];
    this.notlist            = [];
    this.readylist          = [];

    this.height             = Dimensions.get('window').height;
    this.width              = Dimensions.get('window').width;
    this.icon               = this.width*0.12;

    this.user               = null

    this.roomRef            = null
    this.myReadyRef         = null
    this.readyRef           = null
    
    this.listRef            = null
    this.nominationRef      = null
    this.ownerRef           = null
    this.counterRef         = null

    //Owner Listening
    this.choiceRef          = null
    this.loadedRef          = null

    //Focusing on newsRef as main
    this.newsRef            = null
}

componentWillMount() {

    playerActions.initGame()

    this.roomRef            = firebaseService.fetchGameListener('')
    this.user               = firebaseService.getUid()

    this.readyRef           = this.roomRef.child('ready');
    
    this.listRef            = this.roomRef.child('list');
    this.nominationRef      = this.roomRef.child('nominate');

    this.ownerRef           = firebaseService.fetchRoomInfoListener('owner')
    this.counterRef         = this.roomRef.child('counter');

    //Owner Listening
    this.choiceRef          = this.roomRef.child('choice');
    this.loadedRef          = this.roomRef.child('loaded');

    //Focusing on newsRef as main
    this.newsRef            = this.roomRef.child('news');

    this.readyRef.on('value',snap=>{
        if(snap.exists()){
            this.readylist = snap.val()
        }
    })

    this.ownerRef.on('value',snap=>{

        if(snap.exists()){
            ownerModule.ownerMode( snap.val() === this.user )
        }

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
                    this.myReadyRef     = this.readyRef.child(i)
                    playerActions.setPlace(i)
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

            this.myReadyRef.on('value',readysnap=>{

                if(readysnap.exists()){
                    
                    this.setState({ ready:readysnap.val(), section:readysnap.val() })
        
                } else {
        
                    this.setState({ ready:null, section:null })
        
                    //TODO PERFORM ACTIONS HERE BEFORE SUBMITTING TRUE
        
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
    
    this.newsRef.on('child_added',snap=>{

        this.newslist.push({
            type:1,
            message:snap.key,
            index:snap.key
        })
        for(i=0;i<snap.val().length;i++){
            this.newslist.push({
                type:2,
                message:snap.val()[i],
                index:snap.key+'-'+i,
            })
        }
        this.setState({
            newslist:this.newslist
        })

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
                            this.roomRef.update({nominate:choiceArray[i]}).then(()=>
                                this._gMsg(this.namelist[choiceArray[i]].name + ' has been nominated.')
                            )
                        }

                        players++;
                    }

                    if(flag) break
                }

                if(flag){
                    this.choiceRef.remove();
                    this._changePhase(Phases[this.state.phase].trigger);

                } else if(!flag && players >= this.state.playernum){
                    
                    this.choiceRef.remove();
                    this._resetDayStatuses();
                    this._changePhase(Phases[this.state.phase].continue);
                }
                
            } else if (this.state.phase == 2 && total>=this.state.playernum-1){
            
                var count = 0;
                var names = null;

                for(i=0;i<this.state.playernum;i++){
                    if(choiceArray[i] == -1){
                        count++
                        if(!names)  names=this.namelist[i].name
                        else        names+=', '+this.namelist[i].name
                    } else count--
                }

                this._gMsg((names||'Nobody') + ' voted against ' + this.namelist[this.state.nominate].name + '.')

                if(count>0){
                    this.listRef.child(this.state.nominate).update({dead:true}).then(()=>{
                        this._changePlayerCount(false);
                    })

                    this._gMsg(this.namelist[this.state.nominate].name + ' was hung.')

                    if(this.namelist[this.state.nominate].roleid == 'a' || this.namelist[this.state.nominate].roleid == 'b'){

                        //TODO NEW MURDERER LOGIC

                    } 
                    
                    this._resetDayStatuses();
                    this._changePhase(Phases[this.state.phase].trigger)
                    
                } else {
                    this._gMsg(this.namelist[this.state.nominate].name + ' was not hung.')
                    this.listRef.child(this.state.nominate).update({immune:true})
                    this._changePhase(Phases[this.state.phase].continue)
                }
                
            } else if (this.state.phase == 0 && total>=this.state.playernum){

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

                this.listRef.update(playerArray)
                this.newsRef.child(this.state.counter).set(msgs)

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

                        //TODO remove nextcounter ref

                        var ready = []
                        for(i=0;i<this.namelist.length;i++){
                            ready[i] = false
                        }

                        this.readyRef.set(ready).then(()=>{
                            this.loadedRef.remove()
                        }).then(()=>{
                            this.choiceRef.remove()
                            this.roomRef.child('nextcounter').remove()
                        })

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
    if(this.newsRef){
        this.newsRef.off();
    }

    //Owner Listeners
    if(this.choiceRef){
        this.choiceRef.off();
    }
    if(this.loadedRef){
        this.loadedRef.off();
    }
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

_resetOptionPress() {
    this.choiceRef.child(this.state.place).set(null).then(()=>{this.myReadyRef.set(false)})
}

//Creates a public notice message
_gMsg(message){
    this.newsRef.child(this.state.counter).push(message)
}

_game(){
    this.setState({section:this.state.ready})
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


_renderWaiting(){
    return <View>

        <View style = {{
            borderRadius:15,
            backgroundColor:colors.progressd, justifyContent:'center', alignItems:'center'
        }}> 
            <Text style = {styles.plainfont}>{'/' + this.state.playernum}</Text>
        </View>

        <Button
            horizontal = {0.3}
            onPress = {()=> this._resetOptionPress()}
        ><Text style = {styles.cancelButton}>Cancel</Text>
        </Button>
        
    </View>
}

_renderNav(){
    return <Animated.View style = {{position:'absolute', bottom:0, right:0, 
        width:this.width*0.37, height:this.width*0.37}}>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', top:0, left:this.width*0.2}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'news'})}
        ><FontAwesome name='globe'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', left:25, top:25}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'role'})}
        ><FontAwesome name='user'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', left:0, top:this.width*0.2}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'menu'})}
        ><FontAwesome name='book'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon+10, position:'absolute', right:15, bottom:13}}
            style = {{borderRadius:this.icon/2+5}}
            touchStyle = {{height:this.icon+10, borderRadius:this.icon/2+5}}
            onPress={()=>this._game()}
        ><FontAwesome name='home'
            style={{color:colors.shadow,fontSize:30,textAlign:'center'}}/>
        </Button>

    </Animated.View>
}

    render() {

        return <View style = {{flex:1}}>

            <General data={this.state.newslist} />

            <Console
                title = {(this.state.phase == 1 || this.state.phase == 0)?
                    this.state.phasename + ' ' + (this.state.counter - this.state.counter%3)/3+1
                    :this.state.phasename}
                phase = {this.state.phase}
                btn1 = {this.state.btn1}
                btn2 = {this.state.btn2}
                first = {() => this._first()}
                second = {() => this._second()}
            />

            <Private {...this.props.screenProps}/>

        </View>
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
    plainfont: {
        color: colors.font,
        margin:5,
        fontFamily: 'FredokaOne-Regular',
    },
    cancelButton: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    }
}

export default MafiaScreen