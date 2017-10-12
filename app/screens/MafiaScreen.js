
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { Button, List, ListItem } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
import FadeInView from '../components/FadeInView.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Day_Screen extends React.Component {

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

        amidead:true,
        amipicking:false,

        nominate:'',
        nominee:'',
    };

    this.roomListener = firebase.database().ref('rooms/' + roomname);
    this.phaseListener = firebase.database().ref('rooms/' + roomname + '/phase');
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

    this.roomListener.on('value',snap=>{

        //this.state.triggernum, playernum
        //Can possibly be moved to the Phase Change Listener
        this._updateNumbers(snap.val().playernum)

        //Match Button Presses with the Database
        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).once('value',btnpress=>{
            this.setState({
                actionbtnvalue: btnpress.val().actionbtnvalue,
                presseduid: btnpress.val().presseduid,
                amidead: btnpress.val().dead
            })

            if(btnpress.val().presseduid == 'foo'){
                firebase.database().ref('rooms/' + this.state.roomname + '/phases/' + snap.val().phase)
                .once('value',layout=>{
                    this.setState({ phasename:layout.val().name })
                })
            } else if (btnpress.val().presseduid == 'yes'){
                this.setState({ phasename: 'You have voted Innocent.'})
            } else if (btnpress.val().presseduid == 'no'){
                this.setState({ phasename: 'You have voted Guilty.'})
            } else {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + btnpress.val().presseduid).once('value',uidtoname=>{
                    this.setState({ phasename: 'You have selected ' + uidtoname.val().name + '.'})
                })
                    
            }
        })

        //this.state.nominate, nominee, amipicking
        this._updateNominate();
        
        //Update colors + options for Player Name Buttons
        this._updatePlayerState();

    })

    this.phaseListener.on('value',snap=>{

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

    this.setState({actionbtncolor: 'black', actionfontcolor:'white'});
    
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/').once('value',snap=>{
        snap.forEach((child)=>{
            //Set all votes to 0
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({actionbtnvalue:false,presseduid:'foo'})
        })
    })

    firebase.database().ref('rooms/' + this.state.roomname).update({
        phase:newphase
    })
}

_actionBtnValue(status){
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + firebase.auth().currentUser.uid)
        .update({actionbtnvalue: status})
    this.setState({actionbtnvalue: status})
}

_pressedUid(uid){
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + firebase.auth().currentUser.uid)
        .update({presseduid: uid})
    this.setState({presseduid: uid})
}

//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue,presseduid,triggernum,phase,roomname){
 
    if(actionbtnvalue == true){
        this._actionBtnValue(false);
        this._pressedUid('foo');
    } else {
        this._actionBtnValue(true);

        firebase.database().ref('rooms/' + roomname + '/phases/' + phase).once('value',snap=>{

            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers')
            .orderByChild('actionbtnvalue').equalTo(true).once('value',actionbtnsnap=>{
                    
                if((actionbtnsnap.numChildren()+1)>this.state.playernum){
                    if(snap.val().action){
                        new Promise((resolve) => resolve(this._modifyPhase())).then(()=>{
                            new Promise ((resolve) => resolve(this._challengePhase())).then(()=>{
                                new Promise ((resolve)=> resolve(this._actionPhase())).then(()=>{
                                    this._changePhase(snap.val().continue);
                                })
                            })
                        });
                    };
                    if(snap.val().actionreset){
                        firebase.database().ref('rooms/' + roomname + '/actions').remove();
                        this._changePhase(snap.val().continue);
                    };
                }
            })    
        })
    }

} 


_nameBtnPress(uid,name,triggernum,phase,roomname){
    if(phase == 2){
        if(uid==this.state.presseduid){
            this._pressedUid('foo');
        } else {
            this._pressedUid(uid);

            firebase.database().ref('rooms/' + roomname + '/phases/' + phase).once('value',snap=>{
                
                if(snap.val().trigger){

                    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers')
                    .orderByChild('presseduid').equalTo(uid).once('value',namebtnsnap=>{
                            
                        if((namebtnsnap.numChildren()+1)>this.state.triggernum){
                            if(snap.val().actionreset){
                                firebase.database().ref('rooms/' + roomname + '/actions').remove();
                            };
                            if(snap.val().nominate){
                                firebase.database().ref('rooms/' + roomname).update({nominate:uid})
                            };
                            this._changePhase(snap.val().trigger);
                        }
                    })    
                }
            })
        } 

    }  else if (phase==4) {
        if(this.state.presseduid != uid){
            this._pressedUid(uid);

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' 
                    + firebase.auth().currentUser.uid).set({
                        target:uid,
                        targetname:name,
                        roleid:snap.val().roleid,
                    })
            })
        } else {
            this._pressedUid('foo');

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
            + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' 
                    + firebase.auth().currentUser.uid).remove();
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
                this.setState({phasename: name + ' is not a member of the Mafia.'})
            }
        })
            

    }
}

_voteBtnPress(presseduid,votebtn) {
    firebase.database().ref('rooms/'+this.state.roomname+'/phases/'+this.state.phase).once('value',snap=>{
        
        if(presseduid == 'yes'){
            if(votebtn){
                this.setState({phasename:'Nomination'})
                this._pressedUid('foo');
                this._actionBtnValue(false);
            } else {
                this.setState({phasename:'You have voted Guilty.'})
                this._pressedUid('no');
                this._actionBtnValue(true);
                this._voteFinished();
            }
        } else if (presseduid == 'no') {
            if(votebtn){
                this.setState({phasename:'You have voted Innocent.'})
                this._pressedUid('yes');
                this._actionBtnValue(true);
                this._voteFinished();
            } else {
                this.setState({phasename:'Nomination'})
                this._pressedUid('foo');
                this._actionBtnValue(false);
            }
        } else {
            if(votebtn){
                this.setState({phasename:'You have voted Innocent.'})
                this._pressedUid('yes');
                this._actionBtnValue(true);
                this._voteFinished();
            } else {
                this.setState({phasename:'You have voted Guilty.'})
                this._pressedUid('no');
                this._actionBtnValue(true);
                this._voteFinished();
            }
        }
    })    
}

_voteFinished(){

    firebase.database().ref('rooms/'+this.state.roomname+'/phases/'+this.state.phase).once('value',snap=>{

        firebase.database().ref('rooms/'+this.state.roomname+'/listofplayers').orderByChild('actionbtnvalue')
        .equalTo(true).once('value',actioncountsnap=>{
            if((actioncountsnap.numChildren()+1)>this.state.playernum){
                if(snap.val().actionreset){ 
                    firebase.database().ref('rooms/' + this.state.roomname + '/actions').remove() 
                };

                firebase.database().ref('rooms/'+this.state.roomname+'/listofplayers')
                .orderByChild('presseduid').equalTo('no')
                .once('value',guiltyvotes=>{
                    var counter = 0;
                    var names = 'Nobody';

                    guiltyvotes.forEach((votechild)=>{ 
                        counter++;
                        if(counter==1){names=votechild.val().name}
                        else if(counter>1){names=names+', '+votechild.val().name}
                    })
                    
                    this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                        names + ' voted against ' + this.state.nominee + '.',0) 

                    firebase.database().ref('rooms/'+this.state.roomname+'/phases/'+this.state.phase)
                    .once('value',phasedata=>{
                        if((guiltyvotes.numChildren()+1)>this.state.triggernum){

                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                + this.state.nominate).update({dead:true});
                            this._changePlayerCount(false);

                            firebase.database().ref('rooms/'+this.state.roomname+'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{

                                this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                                    dead.val().name + ' was hung.',1)
                                
                                if(dead.val().roleid == 'A'){
                                    this._changePhase(5)
                                } else {
                                    this._changePhase(phasedata.val().trigger)
                                }
                            })
                                
                            
                        } else {
                            firebase.database().ref('rooms/'+this.state.roomname+'/listofplayers/'
                            +this.state.nominate).once('value',dead=>{
                                this._noticeMsgGlobal(this.state.roomname,'#34cd0e',
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

_renderVoteText(){
    if(this.state.actionbtnvalue){
        return <Text style = {{fontWeight:'bold'}}>Waiting for Other Players . . .</Text>
    } else {
        return <Text style = {{fontWeight:'bold'}}>You are required to Vote.</Text>
    }
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
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    >
                    {item.dead?<MaterialCommunityIcons name='skull'
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>}
                </TouchableOpacity>

            )}
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
                        justifyContent:'center'
                    }}
                    disabled = {this.state.amipicking?item.dead:true}
                    > 
                    {item.dead?<MaterialCommunityIcons name='skull'
                        style={{color:'white', fontSize:26,alignSelf:'center'}}/>:
                        <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>}
                </TouchableOpacity>
        )}
        keyExtractor={item => item.key}
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
                >
                    <MaterialCommunityIcons name={'thumb-up'} 
                        style={{color:'black', fontSize:40,alignSelf:'center'}}/>
                </TouchableOpacity>

                <View style = {{flex:1,justifyContent:'center',alignSelf:'center'}}>
                    {this._renderVoteText()}</View>

                <TouchableOpacity 
                    style = {{flex:2,justifyContent:'center'}}
                    onPress={()=>{
                        this._voteBtnPress(this.state.presseduid,false)
                    }}
                >
                    <MaterialCommunityIcons name={'thumb-down'} 
                        style={{color:'black', fontSize:40,alignSelf:'center'}}/>
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
        return <View style = {{marginTop:10,marginRight:10}}><FlatList
            data={this.state.globallist}
            renderItem={({item}) => (
                <Text style={{color:'white',fontWeight:'bold',marginTop:5}}>
                    {'[ ' + item.from + ' ] '+ item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View>
    } else if(this.state.messagechat){
        return <View style = {{marginTop:10,marginRight:10}}><FlatList
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
        firebase.database().ref('rooms/' + this.state.roomname)
            .update({playernum:this.state.playernum+1})
    } else {
        firebase.database().ref('rooms/' + this.state.roomname)
            .update({playernum:this.state.playernum-1})
    }
}


_noticeMsgForTarget(target,color,message){
    firebase.database().ref('messages/' + target + '/count').once('value',snap=>{
        firebase.database().ref('messages/' + target + '/' + (snap.val()+1))
            .update({from: 'Private', color: color, message: message})
        firebase.database().ref('messages/' + target).update({count:(snap.val()+1)})
    })
}

_noticeMsgForUser(user,color,message){
    firebase.database().ref('messages/' + user + '/count').once('value',snap=>{
        firebase.database().ref('messages/' + user + '/' + (snap.val()+1))
            .update({from: 'Private', color: color, message: message})
        firebase.database().ref('messages/' + user).update({count:(snap.val()+1)})
    })
}

_noticeMsgGlobal(roomname,color,message,num){
    firebase.database().ref('globalmsgs/' + roomname).once('value',messages=>{
        firebase.database().ref('globalmsgs/' + roomname + '/' + (messages.numChildren()+1+num))
            .update({from: 'Public', color: color, message: message})
    })
}

_modifyPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{
                //Escort Villager
            if (child.val().roleid == 'H') {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/'
                    + child.val().target).remove();
            }
        })
    })
    
}

_challengePhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{
                //Mafia
            if (child.val().roleid == 'A') {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                    + child.val().target).update({dead:true});
                this._changePlayerCount(false);
                this._noticeMsgForTarget(child.val().target,'#d31d1d','You have been stabbed.');
                this._noticeMsgForUser(child.key,'#d31d1d','You have stabbed ' 
                    + child.val().targetname + '.');
            }
        })
    })    
}

_actionPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{
                //Mafia Kill
            if (child.val().roleid == 'F') {

                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                    .once('value',insidesnap=>{
                        if(insidesnap.val().dead){
                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                + child.val().target).update({dead:false});
                            this._changePlayerCount(true);
                            this._noticeMsgForTarget(child.val().target,'#34cd0e','The Doctor took care of your stab wounds.');
                            this._noticeMsgForUser(child.key,'#34cd0e','You healed ' 
                                + child.val().targetname +"'s stab wounds.");
                        } else {
                            this._noticeMsgForUser(child.key,'#34cd0e','You visited ' 
                                + child.val().targetname + '.');
                        }
                    })

                //Detective
            } else if (child.val().roleid == 'G') {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                    .once('value',insidesnap=>{
                        if(insidesnap.val().roleid == 'B'||
                            insidesnap.val().roleid =='C'||
                            insidesnap.val().roleid =='D'||
                            insidesnap.val().roleid == 'E'){
                            this._noticeMsgForUser(child.key,'#34cd0e',child.val().targetname 
                                + ' is hiding something ...');
                        } else {
                            this._noticeMsgForUser(child.key,'#34cd0e',
                                'Nothing was learned from the investigation on ' + child.val().targetname + '.');
                        }
                    })

                //Villager
            } else if (child.val().roleid == 'I') {
            
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
    <View style = {{flex:1.2}}>
        <View style = {{flex:4.4}}/>
        <View style = {{flex:2.4,backgroundColor:this.state.messagechat||this.state.notificationchat?
            'black':'white'}}/>
    </View>
    <View style = {{flex:5.6}}>
        <View style = {{flex:4.4}}>
            {this._renderListComponent()}
        </View>
        <View style = {{flex:this.state.messagechat||this.state.notificationchat?2.4:0,
            backgroundColor:'black',borderTopRightRadius:15,borderBottomRightRadius:15}}>
            {this._renderMessageComponent()}
        </View>
    </View>

    <View style = {{flex:0.2}}/>

    <View style = {{flex:1}}>
        <View style = {{flex:4.4}}/>
        <View style = {{flex:0.6,justifyContent:'center',
            backgroundColor:'black',borderTopLeftRadius:15}}>
            <TouchableOpacity
                onPress={()=> {
                    this._chatPress('notifications')
                }}>
                <MaterialCommunityIcons name='comment-alert'
                          style={{color:'white', fontSize:26,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
        <View style = {{flex:0.6,justifyContent:'center',
            backgroundColor:'black'}}>
            <TouchableOpacity
                onPress={()=> {
                    this._chatPress('messages')
                }}>
                <MaterialCommunityIcons name='book-open' 
                          style={{color:'white', fontSize:26,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
        <View style = {{flex:0.6,backgroundColor:'black'}}/>
        <View style = {{flex:0.6,justifyContent:'center',
            backgroundColor:'black',borderBottomLeftRadius:15}}>
            <TouchableOpacity
                disabled={this.state.locked?true:this.state.amidead}
                onPress={()=> {this._actionBtnPress(this.state.actionbtnvalue, this.state.presseduid,
                    this.state.triggernum,this.state.phase,this.state.roomname)}}>
                <MaterialCommunityIcons name={this.state.locked?'lock':'check-circle'} 
                          style={{color:this.state.actionbtnvalue ? '#e3c382' : 'white'
                                , fontSize:26,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
    </View>

</View>

<View style = {{flex:0.15, backgroundColor:'white'}}/>
</View>
}
}

const styles = StyleSheet.create({
    dead: {
        height:40,
        backgroundColor: 'grey',
        margin: 3,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        justifyContent:'center'
    },
});