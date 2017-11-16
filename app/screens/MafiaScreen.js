
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    StyleSheet,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import randomize from 'randomatic';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Mafia_Screen extends React.Component {

static navigationOptions = {
    header: null
};

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    
    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname: params.roomname,
        phase:              '',
        daycounter:         '',
        screencolor:        colors.background,
        phasename:          '',
        bottommessage:      '',
        locked:             '',

        myname:             '',
        myrole:             '',
        myroleid:           '',
        targetdead:         '',
        targettown:         '',
        roledesc:           '',

        namelist:           dataSource,

        triggernum:         1000,
        playernum:          1000,

        actionbtnvalue:     false,
        presseduid:         '',
        disabled:           false,

        amidead:            true,
        amimafia:           false,
        amipicking:         false,
        amiowner:           false,

        nominate:           '',
        nominee:            '',

        gameover:           false,
        cover:              true,
        modalVisible:       false,

        //Tagged onto Grabbing the PHASE NAME CURRENTLY because it takes the longest.
        loaded:             false,
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

}

componentWillMount() {

    this.myInfoRef.on('value',snap=>{
        if(snap.exists()){
            
            if(snap.val().roleid){
                //Role information
                this.setState({
                    myroleid:       snap.val().roleid,
                    myrole:         Rolesheet[snap.val().roleid].name,
                    roledesc:       Rolesheet[snap.val().roleid].desc,
                    rolerules:      Rolesheet[snap.val().roleid].rules,
                    amimafia:       Rolesheet[snap.val().roleid].type == 1,
                    targetdead:     Rolesheet[snap.val().roleid].targetdead?true:false,
                    targettown:     Rolesheet[snap.val().roleid].targettown?true:false,
                })
            }

            //Button press states and Living state
            this.setState({
                actionbtnvalue: snap.val().actionbtnvalue,
                presseduid: snap.val().presseduid,
                amidead:    snap.val().dead,
                myname:     snap.val().name,
            })
            var presseduid = snap.val().presseduid;

            if (presseduid == 'foo' || !presseduid){
                this.setState({ bottommessage: 'You have not selected anything.'})
            } else if (presseduid == 'yes'){
                this.setState({ bottommessage: 'You have voted Innocent.'})
            } else if (presseduid == 'no'){
                this.setState({ bottommessage: 'You have voted Guilty.'})
            } else {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + presseduid).once('value',uidtoname=>{
                    this.setState({ bottommessage: 'You have selected ' + uidtoname.val().name + '.'})
                }) 
            }

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
                    actionbtnvalue: child.val().actionbtnvalue,
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
            //this.state.triggernum, playernum
            this._updateNumbers(snap.val());

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

    this.phaseRef.on('value',snap=>{
        this.setState({loaded:false})

        if(snap.exists()){

            this.setState({
                cover:true, 
                messagechat:false, 
                notificationchat:false, 
                phase:snap.val()
            })
            
            //Find layout type of Phase
            firebase.database().ref('phases').child(snap.val()).once('value',layout=>{
                this.setState({
                    phasename:      layout.val().name,
                    screencolor:    layout.val().color,
                    locked:         layout.val().locked,
                    gameover:       layout.val().gameover,
                    loaded:         true 
                })
            })
        }

        //this.state.nominate, nominee, amipicking
        this._updateNominate();
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

                            this.listRef.child(firebase.auth().currentUser.uid)
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

    //For Transition Screen
    this.dayCounterRef.on('value',snap=>{
        if(snap.exists()){
            this.setState({
                daycounter: snap.val(),
            })
        }
    })

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

    clearTimeout(this.timer);

}


_updateNumbers(playernum) {
    const mod = playernum%2;
    this.setState({ 
        triggernum: (((playernum - mod)/2)+1),
        playernum:playernum,
    })
}

_updateNominate(){
    //Checks the nominated player and updates state for his uid/name
    //Then checks if you are the nominated player.
    this.nominationRef.once('value',snap=>{
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
}

_changePhase(newphase){
    
    this.listRef.once('value',snap=>{
        snap.forEach((child)=>{
            //Set all votes to 0 and RESET Buttons
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({votes:0, actionbtnvalue:false, presseduid:'foo'})
        })
    })


    this.roomRef.update({
        phase:newphase,
        count:0,
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

_actionBtnValue(status){
    this.myInfoRef.update({actionbtnvalue: status})
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

_vote(bool) {
    if(bool){
        this.guiltyVotesRef.child(firebase.auth().currentUser.uid).set(this.state.myname);
    } else {
        this.guiltyVotesRef.child(firebase.auth().currentUser.uid).set(null);
    }
}

//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue){
 
    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1000);

    if(actionbtnvalue){
        this._actionBtnValue(false);
        this._changeCount(false);
    } else {
        this._actionBtnValue(true);
        this._changeCount(true);
    }

} 

//Pressing any name button
_nameBtnPress(uid,name,triggernum,phase,roomname){

    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1000);

    if(phase == 2){
        if(uid==this.state.presseduid){
            this.listRef.child(uid).child('votes').transaction((votes)=>{ return votes - 1 })
            this._pressedUid('foo');
        } else {
            this._pressedUid(uid);
            if(this.state.presseduid != 'foo'){
                this.listRef.child(this.state.presseduid).child('votes')
                .transaction((votes)=>{ return votes - 1 })
            }
            this.listRef.child(uid).child('votes').transaction((votes)=>{ return votes + 1 })                        
        } 

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
                this.setState({bottommessage: name + ' is not a member of the Mafia.'})
            }
        })
    } else if (phase==5) {
        if(this.state.presseduid == 'foo'){

            firebase.database().ref('rooms/' + roomname + '/actions/' 
            + firebase.auth().currentUser.uid).update({
                target:uid,
                targetname:name,
                roleid:this.state.myroleid,
            })

            firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
            + this.state.myroleid + '/' + firebase.auth().currentUser.uid).set(this.state.myname);

            this._pressedUid(uid);
            
        } else if (this.state.presseduid == uid){
            
            firebase.database().ref('rooms/' + roomname + '/actions/' 
            + firebase.auth().currentUser.uid).remove();

            firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
            + this.state.myroleid + '/' + firebase.auth().currentUser.uid).remove();
            
            this._pressedUid('foo');
        } else {
            
            firebase.database().ref('rooms/' + roomname + '/actions/' 
            + firebase.auth().currentUser.uid).update({
                target:uid,
                targetname:name,
                roleid:this.state.roleid,
            })

            firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
            + this.state.roleid + '/' + firebase.auth().currentUser.uid).set(this.state.myname);

            firebase.database().ref('rooms/' + roomname + '/actions/' + this.state.presseduid + '/' 
            + this.state.roleid + '/' + firebase.auth().currentUser.uid).remove();

            this._pressedUid(uid);
        }
    } 
}

_nameBtnLongPress(uid,name,phase,roomname){
    if(phase == 5) {
        if(this.state.amimafia){
            this.mafiaRef.once('value',snap=>{
                snap.forEach((child)=>{
                    this._noticeMsg(uid,colors.font,this.state.myname+' wants to kill '+name+'.')
                })
            })
        }
    }
}

//Pressing a Voting BUtton
_voteBtnPress(presseduid,votebtn) {

    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1000);

    if(presseduid == 'yes'){
        if(votebtn){
            this.myInfoRef.update({actionbtnvalue:false, presseduid:'foo'});
            this._vote(false);
            this._changeCount(false);
        } else {
            this.myInfoRef.update({actionbtnvalue:true, presseduid:'no'})
            this._vote(true);
        }
    } else if (presseduid == 'no') {
        if(votebtn){
            this.myInfoRef.update({actionbtnvalue:true, presseduid:'yes'})
            this._vote(false);
        } else {
            this.myInfoRef.update({actionbtnvalue:false, presseduid:'foo'})
            this._vote(false);
            this._changeCount(false);
        }
    } else {
        if(votebtn){
            this.myInfoRef.update({actionbtnvalue:true, presseduid:'yes'})
            this._vote(false);
            this._changeCount(true);
        } else {
            this.myInfoRef.update({actionbtnvalue:true, presseduid:'no'})
            this._vote(true);
            this._changeCount(true);
        }
    }
}

//Rendering the Main Game Header
_renderHeader() {
    return <View>
        <Text style = {{color:colors.font, alignSelf:'center', 
            fontFamily: 'ConcertOne-Regular', fontSize:25}}>
            {this.state.phasename}
        </Text>
        
        <Text style = {{color:colors.font, alignSelf:'center',
            fontFamily: 'ConcertOne-Regular', fontSize:14}}>
            {this.state.bottommessage}
        </Text>
    </View>
}

//Rendering Main Visuals of Game Board
_renderListComponent(){

    if(this.state.phase==2){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this.state.disabled?{}:
                        this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    onLongPress={()=>{
                        this._nameBtnLongPress(item.key,item.name,this.state.phase,this.state.roomname)
                    }}
                    style = {item.dead ? styles.dead : (item.immune? styles.immune : 
                        (item.status?styles.status:styles.alive))}
                    disabled = {this.state.amidead?true:(item.immune?true:item.dead)}>
                    <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={item.dead?'skull':item.actionbtnvalue?
                            'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
                            style={{color:'white', fontSize:26}}/>
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
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.phase==3){
        return <View style = {{flex:1}}>

            <TouchableOpacity 
                style = {{flex:2,justifyContent:'center'}}
                onPress={()=>{
                    this._voteBtnPress(this.state.presseduid,true)
                }}
                disabled = {this.state.disabled?true:this.state.amidead}
            >
                <MaterialCommunityIcons name={'thumb-up'} 
                    style={{color:colors.main, fontSize:40,alignSelf:'center',
                        opacity:this.state.amidead?0.25:1}}/>
            </TouchableOpacity>

            <View style = {{flexDirection:'row',flex:0.3,}}>
            <TouchableOpacity style = {{flex:1,borderRadius:10,backgroundColor:colors.main,
                justifyContent:'center',alignItems:'center'}}>
                <Text style = {{fontFamily:'ConcertOne-Regular',color:colors.font}}>
                    {this.state.nominee + ' has been Nominated.'}</Text>
            </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style = {{flex:2,justifyContent:'center'}}
                onPress={()=>{
                    this._voteBtnPress(this.state.presseduid,false)
                }}
                disabled = {this.state.disabled?true:this.state.amidead}
            >
                <MaterialCommunityIcons name={'thumb-down'} 
                    style={{color:colors.main, fontSize:40,alignSelf:'center',
                        opacity:this.state.amidead?0.25:1}}/>
            </TouchableOpacity>
        </View>

    } else if (this.state.phase==4){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {
                        this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.dead : styles.alive}
                    disabled = {this.state.amipicking?item.dead:false}
                    > 
                    {item.dead?<MaterialCommunityIcons name={item.dead?'skull':null}
                        style={{color:colors.font, fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {styles.concerto}>{item.name}</Text>}
                </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
        />

    } else if (this.state.phase==5){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this.state.disabled?{}:
                        this._nameBtnPress(item.key,item.name,this.state.triggernum,
                            this.state.phase,this.state.roomname)
                    }}
                    onLongPress={()=>{
                        this._nameBtnLongPress(item.key,item.name,this.state.phase,this.state.roomname)
                    }}
                    style = {item.dead ? styles.dead : styles.alive}
                    disabled = {this.state.amidead?true:this.state.targettown?
                        (this.state.targetdead? (item.type==1 || !item.dead) : item.type == 1 ) 
                        : (this.state.targetdead? !item.dead : false )}>
                            
                    <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={item.dead?'skull':item.actionbtnvalue?
                            'check-circle':(item.immune?'needle':null)}
                            style={{color:'white', fontSize:26}}/>
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
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
        />
    } else if (this.state.phase==6 || this.state.phase==7){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity
                    style = {item.dead ? styles.dead : (item.immune? styles.immune : styles.alive)}
                    disabled>
                    <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={item.dead?'skull':null}
                            style={{color:'white', fontSize:26}}/>
                        </View>
                        <View style = {{flex:5}}>
                            <Text style = {styles.concerto}>
                                {item.name + ' ' + (item.type==2?'(Town)':
                                item.type==1?'(Mafia)':'(Neutral)')}</Text>
                        </View>
                        <View style = {{flex:1}}/>
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.key}
        />
    }
}

//Rendering the Transition Header
_renderTransitionHeader() {
    if(this.state.phase == 2 || this.state.phase == 5){
        return <Text style = {styles.headerFont}>
            {this.state.phasename + ' ' + this.state.daycounter}
        </Text>
    } else {
        return <Text style = {styles.headerFont}>
            {this.state.phasename}
        </Text>
    }
}

//Renders the continue button
_renderContinueBtn() {
    if(this.state.phase == 4 && this.state.amipicking){
        return <TouchableOpacity 
            style = {{flex:0.7,backgroundColor:colors.main,borderRadius:15,justifyContent:'center'}}
            onPress = {() => {
                this.setState({cover:false})
            }}>
            <Text style = {styles.continueFont}>Select new</Text>
        </TouchableOpacity>
    } else if (this.state.phase == 4 && !this.state.amipicking){
        return <TouchableOpacity 
            style = {{flex:0.7,backgroundColor:colors.main,borderRadius:15,justifyContent:'center'}}
        >
            <Text style = {styles.continueFont}>Wait bruv</Text>
        </TouchableOpacity>
    } else {
        return <TouchableOpacity 
            style = {{flex:0.7,backgroundColor:colors.main,borderRadius:15,justifyContent:'center'}}
            onPress = {() => {
                this.setState({cover:false})
            }}>
            <Text style = {styles.continueFont}>Continue</Text>
        </TouchableOpacity>
    }
}

//Pressing a chat button
_chatPress(chattype){
    if(chattype=='messages'){
        this.setState({messagechat:true})
    } else if (chattype == 'notifications'){
        this.setState({notificationchat:true})
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
                        this._noticeMsg(child.key,'#34cd0e',string + ' visited ' + child.val().targetname 
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
                            + wheredhego.val().targetname +"'s house last night.");
                        } else {
                            this._noticeMsg(child.key, child.val().targetname 
                            + ' did not leave their house last night.');
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

render() {

if(!this.state.loaded){
    //Loading Screen
    return <View style = {{flex:1, backgroundColor:colors.background}}/>
}

return this.state.cover?<View style = {{flex:1,backgroundColor:colors.background}}>

    <View style = {{flex:1.5,backgroundColor:colors.main,justifyContent:'center'}}>
        {this._renderTransitionHeader()}
    </View>

    <View style = {{flex:10.5}}/>
    
    <View style = {{flex:1.2,flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
        {this._renderContinueBtn()}
    </View>
    
    <View style = {{flex:0.5}}/>

</View>:
<View style = {{flex:1, backgroundColor:colors.background}}>

    <Modal
        animationType = 'slide'
        transparent
        visible = {this.state.modalVisible}
        onRequestClose = {()=>{
            this.setState({ modalVisible:false })
        }}>   
        <View style = {{flex:1,}}>
            <TouchableWithoutFeedback
                onPress = {()=>{
                    this.setState({ modalVisible:false })
            }}>
                <View style = {{flex:0.5}}/>
            </TouchableWithoutFeedback>
            <View style = {{flex:0.5,flexDirection:'row',backgroundColor:colors.main }}>

            </View>
        </View>
    </Modal>

    <View style = {{flex:0.13,flexDirection:'row',justifyContent:'center'}}>
        <View style = {{flex:0.8,backgroundColor:colors.main,justifyContent:'center',
            borderBottomLeftRadius:15,borderBottomRightRadius:15}}>
            {this._renderHeader()}
        </View>
    </View>

    <View style = {{flex:0.01}}/>

    <View style = {{
        flex:0.76,
        flexDirection:'row',
        justifyContent:'center'
    }}>
        <View style = {{flex:0.8}}>
            {this._renderListComponent()}
        </View>

    </View>

    <View style = {{flex:0.01}}/>

    <View style = {{flex:0.07,flexDirection:'row',justifyContent:'center'}}>
        <TouchableOpacity
            disabled={this.state.gameover?false:
                (this.state.disabled?true:(this.state.locked?true:this.state.amidead))}
            onPress={()=> {this.state.gameover?this._gameOver():
                (this._actionBtnPress(this.state.actionbtnvalue, this.state.presseduid,
                this.state.triggernum,this.state.phase,this.state.roomname))}}
            style = {{flex:0.8,justifyContent:'center',
                backgroundColor:!this.state.locked && this.state.actionbtnvalue?colors.highlight:colors.main,
                borderRadius:15}}>
            <Text style = {{color:!this.state.locked && this.state.actionbtnvalue?colors.main:colors.font,
                fontSize:26,alignSelf:'center', fontFamily:'ConcertOne-Regular'}}>
                {this.state.gameover?'CONTINUE':
                    (!this.state.locked && !this.state.amidead?'READY':'LOCKED')}
            </Text>
        </TouchableOpacity>
    </View>

    <View style = {{flex:0.02}}/>

</View>
}
}

const styles = StyleSheet.create({
    alive: {
        height:40,
        backgroundColor: colors.main,
        margin: 3,
        borderRadius:5,
        justifyContent:'center',
    },
    dead: {
        height:40,
        backgroundColor: 'grey',
        margin: 3,
        borderRadius:5,
        justifyContent:'center',
    },
    immune: {
        height:40,
        backgroundColor: colors.immune,
        margin: 3,
        borderRadius:5,
        justifyContent:'center',
    },
    status: {
        height:40,
        backgroundColor: colors.highlight,
        margin: 3,
        borderRadius:5,
        justifyContent:'center',
    },
    headerFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 30,
        color: colors.font,
        alignSelf:'center',
    },
    continueFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
        alignSelf:'center',
    },
    messageFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 24,
        color: colors.title,
        alignSelf:'center',
    },
    concerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    chatconcerto:{
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
        marginTop:5
    },
    leftconcerto:{
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        marginTop:5,
    }
});