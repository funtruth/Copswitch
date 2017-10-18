
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
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Transition_Screen from './TransitionScreen.js';

import FadeInView from '../components/FadeInView.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Mafia_Screen extends React.Component {

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    
    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname: params.roomname,
        phase: '',
        screentype: '',
        phasename:'',
        bottommessage:'',
        locked:'',

        namelist: dataSource,
        globallist: dataSource,
        msglist: dataSource,

        triggernum:'',
        playernum:'',

        actionbtnvalue: false,
        presseduid: '',
        messagechat: false,
        notificationchat: false,
        disabled:false,

        amidead:true,
        amipicking:false,

        nominate:'',
        nominee:'',
    };

    this.roomListener = firebase.database().ref('rooms/' + roomname);
    this.listListener = this.roomListener.child('listofplayers');
    this.userRoomRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room');
    this.phaseListener = this.roomListener.child('phase');
    this.playernumListener = this.roomListener.child('playernum');
    this.nominationListener = this.roomListener.child('nominate');
    this.msgRef = firebase.database().ref('messages/' + firebase.auth().currentUser.uid);
    this.globalMsgRef = firebase.database().ref('globalmsgs/' + roomname);

}

componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.msgRef.on('value',snap=>{
        var msg = [];
            snap.forEach((child)=>{
                if(child.key != 'count'){     
                    msg.push({
                        from: child.val().from,
                        color: child.val().color,
                        message: child.val().message,
                        key:child.key,
                    })
                }
            })
            this.setState({msglist:msg})
    })

    this.globalMsgRef.on('value',snap=>{
        var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    from: child.val().from,
                    color: child.val().color,
                    message: child.val().message,
                    key:child.key,
                })
            })
            this.setState({globallist:msg})
    })

    //Match Button Presses with the Database
    this.userRoomRef.on('value',snap=>{
        this.setState({
            actionbtnvalue: snap.val().actionbtnvalue,
            presseduid: snap.val().presseduid,
        })

        if (snap.val().presseduid == 'foo' || !snap.val().presseduid){
            this.setState({ bottommessage: 'You have not selected anything.'})
        } else if (snap.val().presseduid == 'yes'){
            this.setState({ bottommessage: 'You have voted Innocent.'})
        } else if (snap.val().presseduid == 'no'){
            this.setState({ bottommessage: 'You have voted Guilty.'})
        } else {
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
            + snap.val().presseduid).once('value',uidtoname=>{
                this.setState({ bottommessage: 'You have selected ' + uidtoname.val().name + '.'})
            }) 
        }
    })

    this.listListener.on('value',snap=>{
        //Update colors + options for Player Name Buttons
        this._updatePlayerState();

        //Check if you are alive
        this.listListener.child(firebase.auth().currentUser.uid).once('value',amidead=>{  
            this.setState({
                amidead: amidead.val().dead
            })
        })
    })

    this.playernumListener.on('value',snap=>{
        //this.state.triggernum, playernum
        this._updateNumbers(snap.val());
    })

    this.nominationListener.on('value',snap=>{
        //this.state.nominate, nominee, amipicking
        this._updateNominate();
    })

    this.phaseListener.on('value',snap=>{

        this.roomListener.once('value',roomsnap=>{
            //Keep Phase name updated
            firebase.database().ref('rooms/' + this.state.roomname + '/phases/' + roomsnap.val().phase)
            .once('value',layout=>{ 
                this.setState({ phasename:layout.val().name}) 
            })
        })

        this.props.navigation.navigate('Transition_Screen',{
            roomname:this.state.roomname,
            phase:snap.val(),
        })

        //Keep Phase updated for PERSONAL USER
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({phase:snap.val()});
        this.setState({phase:snap.val()})
        
        //Find layout type of Phase
        firebase.database().ref('rooms/' + this.state.roomname + '/phases/' + snap.val())
        .once('value',layout=>{
            this.setState({
                screentype:layout.val().type,
                locked:layout.val().locked })
        })

    })

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    if(this.roomListener){
        this.roomListener.off();
    }
    if(this.listListener){
        this.listListener.off();
    }
    if(this.playernumListener){
        this.roomListener.off();
    }
    if(this.nominationListener){
        this.roomListener.off();
    }
    if(this.userRoomRef){
        this.userRoomRef.off();
    }
    if(this.msgRef){
        this.msgRef.off();
    }
    if(this.globalMsgRef){
        this.globalMsgRef.off();
    }
    if(this.phaseListener){
        this.phaseListener.off();
    }

}

_updatePlayerState() {
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value', snap=>{
        
        var list = [];
        snap.forEach((child)=> {
            list.push({
                name: child.val().name,
                dead: child.val().dead,
                key: child.key,
            })
        })

        this.setState({namelist:list})
    })
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
    firebase.database().ref('rooms/' + this.state.roomname +'/nominate').once('value',snap=>{
        if(snap.exists()){
            firebase.database().ref('rooms/'+this.state.roomname+'/listofplayers/'+snap.val()).once('value',sp=>{
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
    
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/').once('value',snap=>{
        snap.forEach((child)=>{
            //Set all votes to 0
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({votes:0})

            //Set all btn values to neutral
            firebase.database().ref('users/' + child.key + '/room')
                .update({actionbtnvalue:false,presseduid:'foo'})
        })
    })


    firebase.database().ref('rooms/' + this.state.roomname).update({
        phase:newphase,
        count:0,
    })
}

_actionBtnValue(status){
    this.userRoomRef.update({actionbtnvalue: status})
}
_pressedUid(uid){
    this.userRoomRef.update({presseduid: uid})
}

_decreaseCount(){
    firebase.database().ref('rooms/' + this.state.roomname + '/count').transaction((count)=>{
        return count - 1;
    })
}
_increaseCount(){
    firebase.database().ref('rooms/' + this.state.roomname + '/count').transaction((count)=>{
        return count + 1;
    })
}

//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue,presseduid,triggernum,phase,roomname){
 
    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1000);

    if(actionbtnvalue == true){
        this._actionBtnValue(false);
        this._pressedUid('foo');
        this._decreaseCount();
    } else {
        this._actionBtnValue(true);

        firebase.database().ref('rooms/' + roomname + '/phases/' + phase).once('value',snap=>{

            firebase.database().ref('rooms/' + roomname + '/count').transaction((count)=>{
                if((count+2)>this.state.playernum){
                    if(snap.val().action){
                        new Promise((resolve) => resolve(this._adjustmentPhase())).then(()=>{
                            new Promise((resolve) => resolve(this._actionPhase())).then(()=>{
                                this._changePhase(snap.val().continue);
                                this.roomListener.child('daycounter').transaction((daycounter)=>{
                                    return daycounter + 1;
                                })
                            });
                        });
                    };
                    if(snap.val().actionreset){
                        firebase.database().ref('rooms/' + roomname + '/actions').remove();
                        this._changePhase(snap.val().continue);
                    };
                } else {
                    this._increaseCount();
                }
            })
        })
    }

} 


_nameBtnPress(uid,name,triggernum,phase,roomname){
    
    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 200);

    if(this.state.actionbtnvalue){
        this._actionBtnValue(false);
        this._decreaseCount();
    }

    if(phase == 2){
        if(uid==this.state.presseduid){

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid + '/votes')
            .transaction((votes)=>{ return votes - 1 })

            this._pressedUid('foo');
        } else {
            this._pressedUid(uid);

            if(this.state.presseduid != 'foo'){
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.presseduid + '/votes')
                .transaction((votes)=>{ return votes - 1 })
            }

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid + '/votes')
            .transaction((votes)=>{ 
            
                firebase.database().ref('rooms/' + roomname + '/phases/' + phase).once('value',snap=>{
                    if(snap.val().trigger){
                        if((votes+2)>triggernum){
                            if(snap.val().actionreset){
                                firebase.database().ref('rooms/' + roomname + '/actions').remove();
                            };
                            if(snap.val().nominate){
                                firebase.database().ref('rooms/' + roomname).update({nominate:uid})
                            };
                            this._changePhase(snap.val().trigger);
                        } else {
                            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid + '/votes')
                            .transaction((votes)=>{ return votes + 1 })
                        }
                    }
                })

            })
        } 

    }  else if (phase==4) {
        if(this.state.presseduid == 'foo'){

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' 
                    + firebase.auth().currentUser.uid).update({
                        target:uid,
                        targetname:name,
                        roleid:snap.val().roleid,
                    })

                    firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
                    + snap.val().roleid + '/' + firebase.auth().currentUser.uid).set(true);

                    this._pressedUid(uid);
            })
        } else if (this.state.presseduid == uid){
            
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' 
                    + firebase.auth().currentUser.uid).remove();

                    firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
                    + snap.val().roleid + '/' + firebase.auth().currentUser.uid).remove();
                    
                    this._pressedUid('foo');
            })
        } else {
            
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' 
                    + firebase.auth().currentUser.uid).update({
                        target:uid,
                        targetname:name,
                        roleid:snap.val().roleid,
                    })

                    firebase.database().ref('rooms/' + roomname + '/actions/' + uid + '/' 
                    + snap.val().roleid + '/' + firebase.auth().currentUser.uid).set(true);

                    firebase.database().ref('rooms/' + roomname + '/actions/' + this.state.presseduid + '/' 
                    + snap.val().roleid + '/' + firebase.auth().currentUser.uid).remove();

                    this._pressedUid(uid);
            })
        }
    } else if(phase == 5){
        //Check if selected player is a mafia member
        //change role id on listofplayers
        firebase.database().ref('rooms/' + roomname + '/mafia/' + uid).once('value',mafiacheck=>{
            if(mafiacheck.exists()){
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                + uid).once('value',snap=>{
                        firebase.database().ref('rooms/'+roomname+'/mafia/' + uid)
                            .update({roleid:'A'})
                        firebase.database().ref('rooms/'+roomname+'/listofplayers/'
                            + uid).update({roleid:'A'})
                })
                this._changePhase(4)
            } else {
                this.setState({bottommessage: name + ' is not a member of the Mafia.'})
            }
        })
            

    }
}

_voteBtnPress(presseduid,votebtn) {

    //Stops the user from clicking multiple times
    this.setState({disabled:true});
    setTimeout(() => {this.setState({disabled: false})}, 1000);

    firebase.database().ref('rooms/'+this.state.roomname+'/phases/'+this.state.phase).once('value',snap=>{
        
        if(presseduid == 'yes'){
            if(votebtn){
                this.userRoomRef.update({actionbtnvalue:false, presseduid:'foo'})
                this._decreaseCount();
            } else {
                this.userRoomRef.update({actionbtnvalue:true, presseduid:'no'})
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + firebase.auth().currentUser.uid).update({vote:false})
            }
        } else if (presseduid == 'no') {
            if(votebtn){
                this.userRoomRef.update({actionbtnvalue:true, presseduid:'yes'})
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + firebase.auth().currentUser.uid).update({vote:true})
            } else {
                this.userRoomRef.update({actionbtnvalue:false, presseduid:'foo'})
                this._decreaseCount();
            }
        } else {
            if(votebtn){
                this.userRoomRef.update({actionbtnvalue:true, presseduid:'yes'})
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + firebase.auth().currentUser.uid).update({vote:true})
                this._increaseCount();
                this._voteFinished(this.state.roomname);
            } else {
                this.userRoomRef.update({actionbtnvalue:true, presseduid:'no'})
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + firebase.auth().currentUser.uid).update({vote:false})
                this._increaseCount();
                this._voteFinished(this.state.roomname);
            }
        }
    })    
}

_voteFinished(roomname){

    firebase.database().ref('rooms/'+ roomname +'/phases/'+this.state.phase).once('value',snap=>{

        firebase.database().ref('rooms/' + roomname + '/count').transaction((count)=>{
            
            if((count+1)>this.state.playernum){

                if(snap.val().actionreset){ 
                    firebase.database().ref('rooms/' + roomname + '/actions').remove(); 
                };

                firebase.database().ref('rooms/'+ roomname +'/listofplayers')
                .orderByChild('vote').equalTo(false)
                .once('value',guiltyvotes=>{

                    var counter = 0;
                    var names = 'Nobody';

                    guiltyvotes.forEach((votechild)=>{ 
                        counter++;
                        if(counter==1){names=votechild.val().name}
                        else if(counter>1){names=names+', '+votechild.val().name}
                    })
                    
                    this._noticeMsgGlobal(roomname,'#d31d1d', names + ' voted against ' + this.state.nominee + '.') 

                    firebase.database().ref('rooms/'+ roomname +'/phases/'+this.state.phase)
                    .once('value',phasedata=>{
                        if((guiltyvotes.numChildren()+1)>this.state.triggernum){

                            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                                + this.state.nominate).update({dead:true});
                            this._changePlayerCount(false);

                            firebase.database().ref('rooms/'+ roomname +'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{

                                this._noticeMsgGlobal(roomname,'#d31d1d', dead.val().name + ' was hung.')
                                
                                if(dead.val().roleid == 'A'){
                                    this._changePhase(5)
                                } else if (dead.val().roleid == 'W'){
                                    guiltyvotes.forEach((jester)=>{ 
                                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                                        + jester.key).update({bloody:true,suspicious:true})
                                    })
                                    this._noticeMsgGlobal(roomname,'#d31d1d',
                                        names + ' have blood on their hands and look suspicious.')
                                    this._changePhase(phasedata.val().trigger)
                                } else {
                                    this._changePhase(phasedata.val().trigger)
                                }
                            })
                                
                            
                        } else {
                            firebase.database().ref('rooms/'+ roomname +'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{
                                this._noticeMsgGlobal(roomname,'#34cd0e',
                                    dead.val().name + ' was not hung.',1)
                            })
                            this._changePhase(phasedata.val().continue)
                        }
                    })
                })
            }
        })
    })
}

_handleBackButton() {
    return true;
}

_renderHeader() {
    return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
        {this.state.phasename}
    </Text></View>
}

_renderListComponent(){

    if(this.state.screentype=='normal'){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.dead : {height:40,
                        backgroundColor: 'black',
                        margin: 3,
                        borderRadius:5,
                        justifyContent:'center',
                        flex:0.5,
                    }}
                    disabled = {this.state.amidead?true:item.dead}
                    >
                    {item.dead?<MaterialCommunityIcons name='skull'
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>}
                </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={item => item.key}
        />
    } else if (this.state.screentype=='normal-person'){

        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.dead : {height:40,
                        backgroundColor: 'black',
                        margin: 3,
                        borderRadius:5,
                        justifyContent:'center',
                        flex:0.5,
                    }}
                    disabled = {this.state.amipicking?item.dead:false}
                    > 
                    {item.dead?<MaterialCommunityIcons name='skull'
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>}
                </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
        numColumns={2}
    />

    } else if(this.state.screentype=='voting-person'){
        return <View style = {{flex:1}}>

            <View style = {{flex:4.4,justifyContent:'center'}}>
                <View style = {{flex:1}}/>
                <TouchableOpacity 
                    style = {{flex:2,justifyContent:'center'}}
                    onPress={()=>{
                        this._voteBtnPress(this.state.presseduid,true)
                    }}
                    disabled = {this.state.disabled?true:this.state.amidead}
                >
                    <MaterialCommunityIcons name={'thumb-up'} 
                        style={{color:'black', fontSize:40,alignSelf:'center',
                            opacity:this.state.amidead?0.25:1}}/>
                </TouchableOpacity>

                <TouchableOpacity 
                    style = {{flex:2,justifyContent:'center'}}
                    onPress={()=>{
                        this._voteBtnPress(this.state.presseduid,false)
                    }}
                    disabled = {this.state.disabled?true:this.state.amidead}
                >
                    <MaterialCommunityIcons name={'thumb-down'} 
                        style={{color:'black', fontSize:40,alignSelf:'center',
                            opacity:this.state.amidead?0.25:1}}/>
                </TouchableOpacity>

                <View style = {{flex:1}}/>
            </View>

            <View style = {{flex:this.state.messagechat||this.state.notificationchat?0:2.4
                ,backgroundColor:'white',borderBottomRightRadius:15,borderTopRightRadius:15,}}>
            </View>
        </View>
    }
}

_renderMessageComponent(){
    if (this.state.notificationchat){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5}}><FlatList
            data={this.state.globallist}
            renderItem={({item}) => (
                <Text style={{color:'white',fontWeight:'bold',marginTop:5}}>
                    {'[ ' + item.from + ' ] '+ item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View>
    } else if(this.state.messagechat){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5}}><FlatList
            data={this.state.msglist}
            renderItem={({item}) => (
                <Text style={{color:'white',fontWeight:'bold',marginTop:5}}>
                      {'[ ' + item.from + ' ] ' + item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View>
    } 
}

_chatPress(chattype){
    if(chattype=='messages'){
        if(this.state.messagechat){
            this.setState({messagechat:false})
        } else if (this.state.notificationchat){
            this.setState({messagechat:true,notificationchat:false})
        } else {
            this.setState({messagechat:true})
        }
    } else if (chattype == 'notifications'){
        if(this.state.notificationchat){
            this.setState({notificationchat:false})
        } else if (this.state.messagechat){
            this.setState({messagechat:false,notificationchat:true})
        } else {
            this.setState({notificationchat:true})
        }
    }
}

_changePlayerCount(bool){
    if(bool){
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum')
            .transaction((playernum)=>{return playernum+1})
    } else {
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum')
            .transaction((playernum)=>{return playernum-1})
    }
}

_noticeMsg(target,color,message){
    firebase.database().ref('messages/' + target)
        .push({from: 'Private', color: color, message: message})
}

_noticeMsgGlobal(roomname,color,message){
    firebase.database().ref('globalmsgs/' + roomname)
        .push({from: 'Public', color: color, message: message})
}

_adjustmentPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{

            if (child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target 
                + '/' + child.val().roleid + '/' + child.key).remove()
            }

        })
    })
}

_actionPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{

                //Mafia Kill
            if (child.val().roleid == 'A' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                .once('value',innersnap=>{
                    if(!innersnap.val().N){
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + child.val().target).update({dead:true});
                        this._changePlayerCount(false);
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + firebase.auth().currentUser.uid).update({bloody:true});
                        this._noticeMsg(child.val().target,'#d31d1d','You have been stabbed.');
                        this._noticeMsg(child.key,'#d31d1d','You have stabbed ' 
                            + child.val().targetname + '.');
                    } else {
                        this._noticeMsg(child.key,'#d31d1d','You have stabbed ' 
                            + child.val().targetname + '.');
                    }
                })

                //Schemer
            } else if (child.val().roleid == 'B' && !child.val().O) {
                this._noticeMsg(child.key,'#34cd0e','You attempted to frame ' 
                    + child.val().targetname +" last night.");

                //Spy
            } else if (child.val().roleid == 'C' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + child.val().target).once('value',innersnap=>{
                    firebase.database().ref('Original/roles/' + innersnap.val().roleid).once('value',rolename=>{
                        this._noticeMsg(child.key,'#34cd0e','You spied on ' 
                            + child.val().targetname +". Their role is the " + rolename.val().name);
                    })
                })

                //Detective
            } else if (child.val().roleid == 'K' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                .once('value',insidesnap=>{
                    if(insidesnap.val().roleid == 'B'||
                        insidesnap.val().roleid =='C'||
                        insidesnap.val().roleid =='D'||
                        insidesnap.val().roleid =='J'||
                        insidesnap.val().B           ||
                        insidesnap.val().suspicious){
                        this._noticeMsg(child.key,'#34cd0e',child.val().targetname +' is hiding something ...');
                    } else {
                        this._noticeMsg(child.key,'#34cd0e',
                            'Nothing was learned from the investigation on ' + child.val().targetname + '.');
                    }
                })

                //Investigator
            } else if (child.val().roleid == 'L' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + child.val().target).once('value',innersnap=>{
                    if(innersnap.val().bloody){
                        this._noticeMsg(child.key,'#34cd0e', 
                            child.val().targetname +" has blood on their hands.");
                    } else {
                        this._noticeMsg(child.key,'#34cd0e',
                            child.val().targetname +" has blood on their hands.");
                    }
                })

                //Doctor
            } else if (child.val().roleid == 'N' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                .once('value',insidesnap=>{
                    if(insidesnap.val().A){
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + firebase.auth().currentUser.uid).update({bloody:true});
                        this._noticeMsg(child.val().target,'#34cd0e','The Doctor took care of your stab wounds.');
                        this._noticeMsg(child.key,'#34cd0e','You healed ' 
                            + child.val().targetname +"'s stab wounds.");
                    } else {
                        this._noticeMsg(child.key,'#34cd0e','You visited '+ child.val().targetname + '.');
                    }
                })

                //Escort
            } else if (child.val().roleid == 'O' && !child.val().O) {
                this._noticeMsg(child.val().target,'#34cd0e',
                    'You were distracted last night.');
                this._noticeMsg(child.key,'#34cd0e','You distracted '+ child.val().targetname +" last night.");

                //Bird Watcher
            } else if (child.val().roleid == 'Q' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' 
                + child.val().target).once('value',wheredhego=>{
                    if(wheredhego.val().targetname){
                        this._noticeMsg(child.key,'#34cd0e', child.val().targetname + ' visited ' 
                        + wheredhego.val().targetname +"'s house last night.");
                    } else {
                        this._noticeMsg(child.key,'#34cd0e', child.val().targetname 
                        + ' did not leave their house last night.');
                    }
                })

                //Forensic
            } else if (child.val().roleid == 'R' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + child.val().target).once('value',innersnap=>{
                    firebase.database().ref('Original/roles/' + innersnap.val().roleid).once('value',rolename=>{
                        this._noticeMsg(child.key,'#34cd0e','You examined the body of ' 
                        + child.val().targetname + ', the ' + rolename.val().name + '.');
                    })
                })

            }
        })
    })

}

render() {

return <View style = {{flex:1}}>

<View style = {{flex:1,flexDirection:'row',backgroundColor:'white'}}>
    <View style = {{flex:1}}/>
    <View style = {{flex:15,backgroundColor:'black',justifyContent:'center',
        borderBottomLeftRadius:15,borderBottomRightRadius:15}}>
        {this._renderHeader()}
    </View>
    <View style = {{flex:1}}/>
</View>

<View style = {{flex:0.15,backgroundColor:'white'}}/>

<View style = {{
    flex:10,
    flexDirection:'row',
    backgroundColor:'white',
}}>
    <View style = {{flex:0.2}}>
    </View>
    <View style = {{flex:15}}>
        <View style = {{flex:4.4}}>
            {this._renderListComponent()}
        </View>
        <View style = {{flex:this.state.messagechat||this.state.notificationchat?2.4:0,
            backgroundColor:'black',borderRadius:15,marginLeft:10,marginRight:10}}>
            {this._renderMessageComponent()}
        </View>
    </View>

    <View style = {{flex:0.2}}/>

</View>

<View style = {{flex:0.15, backgroundColor:'white'}}/>

<View style = {{flex:1,backgroundColor:'white',flexDirection:'row'}}>
    <View style = {{flex:0.2}}/>
    <View style = {{flex:0.6,justifyContent:'center',
        backgroundColor:'black',borderTopLeftRadius:15,borderBottomLeftRadius:15}}>
        <TouchableOpacity
            onPress={()=> {
                this._chatPress('notifications')
            }}>
            <MaterialCommunityIcons name='comment-alert'
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>
        </TouchableOpacity>
    </View>
    <View style = {{flex:0.6,justifyContent:'center', backgroundColor:'black'}}>
        <TouchableOpacity
            onPress={()=> {
                this._chatPress('messages')
            }}>
            <MaterialCommunityIcons name='book-open' 
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>
        </TouchableOpacity>
    </View>
    <View style = {{flex:0.6,justifyContent:'center',
        backgroundColor:'black',borderBottomRightRadius:15,borderTopRightRadius:15}}>
        <TouchableOpacity
            disabled={this.state.disabled?true:(this.state.locked?true:this.state.amidead)}
            onPress={()=> {this._actionBtnPress(this.state.actionbtnvalue, this.state.presseduid,
                this.state.triggernum,this.state.phase,this.state.roomname)}}>
            <MaterialCommunityIcons name={!this.state.locked && !this.state.amidead?'check-circle':'lock'} 
                        style={{color:!this.state.locked && this.state.actionbtnvalue?'#e3c382':'white'
                            , fontSize:26,alignSelf:'center'}}/>
        </TouchableOpacity>
    </View>
    <View style = {{flex:0.2}}/>
</View>

<View style = {{flex:0.15, backgroundColor:'white'}}/>

<View style = {{flex:0.5,flexDirection:'row',backgroundColor:'white'}}>
    <View style = {{flex:3}}/>
    <View style = {{flex:15,backgroundColor:'black',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
        <Text style = {{color:'white',fontSize:12}}>{this.state.bottommessage}</Text>
    </View>
    <View style = {{flex:3}}/>
</View>

<View style = {{flex:0.15, backgroundColor:'white'}}/>
</View>
}
}


export default stackNav = StackNavigator(
    {
        Mafia_Screen: {
            screen: Mafia_Screen,
        },
        Transition_Screen: {
            screen: Transition_Screen,
        },
    },
        {
            headerMode: 'none',
            initialRouteName: 'Mafia_Screen',
        }
);

const styles = StyleSheet.create({
    dead: {
        height:40,
        backgroundColor: 'grey',
        margin: 3,
        borderRadius:5,
        justifyContent:'center',
        flex:0.5,
    },
});