
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

import FadeInView from '../components/FadeInView.js';
import colors from '../misc/colors.js';

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
        screentype:         '',
        screencolor:        'white',
        phasename:          '',
        bottommessage:      '',
        locked:             '',

        myrole:             '',
        myroleid:           '',
        roledesc:           '',
        mafialist:          dataSource,

        namelist:           dataSource,
        globallist:         dataSource,
        msglist:            dataSource,

        triggernum:         1000,
        playernum:          1000,

        actionbtnvalue:     false,
        presseduid:         '',
        messagechat:        false,
        notificationchat:   false,
        showprofile:        false,
        xdisabled:          true,
        disabled:           false,

        amidead:            true,
        amimafia:           false,
        amipicking:         false,
        amiowner:           false,

        nominate:           '',
        nominee:            '',

        gameover:           false,
        cover:              true,

        //Tagged onto Grabbing the PHASE NAME CURRENTLY because it takes the longest.
        loaded:             false,
    };

    this.roomRef            = firebase.database().ref('rooms/' + roomname);
    this.myInfoRef          = this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid);
    this.mafiaRef           = this.roomRef.child('mafia');
    
    this.msgRef             = firebase.database().ref('messages/' + firebase.auth().currentUser.uid);
    this.globalMsgRef       = firebase.database().ref('globalmsgs/' + roomname);
    this.listListener       = this.roomRef.child('listofplayers');
    this.playernumListener  = this.roomRef.child('playernum');
    this.nominationListener = this.roomRef.child('nominate');
    this.ownerRef           = this.roomRef.child('owner');
    this.phaseListener      = this.roomRef.child('phase');

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
                firebase.database().ref('roles/' + snap.val().roleid).once('value',rolename=>{
                    if(rolename.val().type == 1){
                        this.setState({
                            myroleid:snap.val().roleid,
                            myrole:rolename.val().name,
                            roledesc:rolename.val().desc,
                            rolerules:rolename.val().rules,
                            amimafia:true
                        })
                    } else {
                        this.setState({
                            myroleid:snap.val().roleid,
                            myrole:rolename.val().name,
                            roledesc:rolename.val().desc,
                            rolerules:rolename.val().rules,
                            amimafia:false
                        })
                    }
                })
            }

            //Button press states and Living state
            this.setState({
                actionbtnvalue: snap.val().actionbtnvalue,
                presseduid: snap.val().presseduid,
                amidead:    snap.val().dead,
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

    this.mafiaRef.on('value',snap=>{
        if(snap.exists()){
            var mafialist = [];
            snap.forEach((child)=>{
                firebase.database().ref('roles/' + child.val().roleid).once('value',idtoname=>{
                    mafialist.push({
                        name: child.val().name,
                        rolename: idtoname.val().name,
                        alive: child.val().alive,
                        key: child.key,
                    })
                })
            })
            this.setState({mafialist:mafialist})
        }
    })

    this.msgRef.on('value',snap=>{
        if(snap.exists()){
            var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    from:       child.val().from,
                    color:      child.val().color,
                    message:    child.val().message,
                    key:        child.key,
                })
            })
            this.setState({msglist:msg})
        }
    })

    this.globalMsgRef.on('value',snap=>{
        if(snap.exists()){
            var msg = [];
            snap.forEach((child)=>{   
                msg.push({
                    from:       child.val().from,
                    color:      child.val().color,
                    message:    child.val().message,
                    key:        child.key,
                })
            })
            this.setState({globallist:msg})
        }
    })

    this.ownerRef.on('value',snap=>{
        if(snap.val() == firebase.auth().currentUser.uid){
            this.setState({amiowner:true})
        } else {
            this.setState({amiowner:false})
        }
    })

    this.listListener.on('value',snap=>{
        if(snap.exists()){
            //Update colors + options for Player Name Buttons
            this._updatePlayerState();
        }
    })

    this.playernumListener.on('value',snap=>{
        if(snap.exists()){
            //this.state.triggernum, playernum
            this._updateNumbers(snap.val());

            this.mafiaRef.orderByChild('alive').equalTo(true).once('value',mafia=>{
                if(mafia.numChildren() == 0){
                    this.phaseListener.set(6)
                }
                else if(mafia.numChildren()*2+1 > snap.val()){
                    this.phaseListener.set(7)
                }
            })
        }
    })

    this.phaseListener.on('value',snap=>{
        this.setState({loaded:false})

        if(snap.exists()){

            this.setState({
                cover:true, 
                messagechat:false, 
                notificationchat:false, 
                showprofile:false,
                phase:snap.val()
            })
            
            //Find layout type of Phase
            firebase.database().ref('phases').child(snap.val()).once('value',layout=>{
                this.setState({
                    phasename:      layout.val().name,
                    screentype:     layout.val().type,
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
                    this._resetImmunity();
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

                            this.listListener.child(firebase.auth().currentUser.uid)
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
                            this._resetImmunity();
                            
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
        if(snap.exists()){
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
    if(this.msgRef){
        this.msgRef.off();
    }
    if(this.globalMsgRef){
        this.globalMsgRef.off();
    }
    if(this.ownerRef){
        this.ownerRef.off();
    }
    if(this.listListener){
        this.listListener.off();
    }
    if(this.playernumListener){
        this.playernumListener.off();
    }
    if(this.phaseListener){
        this.phaseListener.off();
    }
    if(this.nominationListener){
        this.nominationListener.off();
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

_updatePlayerState() {
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value', snap=>{
        
        var list = [];
        snap.forEach((child)=> {
            list.push({
                actionbtnvalue: child.val().actionbtnvalue,
                name:           child.val().name,
                dead:           child.val().dead,
                immune:         child.val().immune,
                type:           child.val().type,
                votes:          child.val().votes,

                key:            child.key,
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
    this.nominationListener.once('value',snap=>{
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
    
    this.listListener.once('value',snap=>{
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

_resetImmunity() {
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/').once('value',snap=>{
        snap.forEach((child)=>{
            //RESET IMMUNITY
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({immune:false})
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
        firebase.database().ref('rooms/' + this.state.roomname + '/count').transaction((count)=>{
            return count + 1;
        })
    } else {
         firebase.database().ref('rooms/' + this.state.roomname + '/count').transaction((count)=>{
            return count - 1;
        })
    }
}

_vote(bool) {
    this.roomRef.child('listofplayers').child(firebase.auth().currentUser.uid).child('name').once('value',snap=>{
        if(bool){
            this.roomRef.child('guiltyvotes').child(firebase.auth().currentUser.uid).set(snap.val());
        } else {
            this.roomRef.child('guiltyvotes').child(firebase.auth().currentUser.uid).set(null);
        }
    })
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

            this.roomRef.child('listofplayers').child(uid).child('votes')
            .transaction((votes)=>{ return votes - 1 })

            this._pressedUid('foo');
        } else {
            this._pressedUid(uid);

            if(this.state.presseduid != 'foo'){
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.presseduid + '/votes')
                .transaction((votes)=>{ return votes - 1 })
            }

            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid + '/votes')
            .transaction((votes)=>{ return votes + 1 })                        
                
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
    return <View><Text style = {{color:colors.font, alignSelf:'center', 
        fontFamily: 'ConcertOne-Regular', fontSize:25}}>
        {this.state.phasename}
    </Text></View>
}

//Rendering Main Visuals of Game Board
_renderListComponent(){

    if(this.state.screentype=='normal'){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this.state.disabled?{}:
                        this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.dead : (item.immune? styles.immune : styles.alive)}
                    disabled = {this.state.amidead?true:(item.immune?true:item.dead)}>
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
    } else if (this.state.screentype=='normal-person'){

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

    } else if(this.state.screentype=='voting-person'){
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
    }
}

//Rendering Message Boxes
_renderMessageComponent(){
    if (this.state.notificationchat){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5}}><FlatList
            data={this.state.globallist}
            renderItem={({item}) => (
                <Text style={{color:colors.font,fontWeight:'bold',marginTop:5}}>
                    {'[ ' + item.from + ' ] '+ item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View>
    } else if(this.state.messagechat){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5}}><FlatList
            data={this.state.msglist}
            renderItem={({item}) => (
                <Text style={{color:colors.font,fontWeight:'bold',marginTop:5}}>
                      {'[ ' + item.from + ' ] ' + item.message}</Text>
            )}
            keyExtractor={item => item.key}
            /></View>
    } else if (this.state.showprofile){
        return <View style = {{marginLeft:10,marginRight:10,marginBottom:5,marginTop:10}}>
                <Text style = {styles.leftconcerto}>{'-'+this.state.myrole+'-'}</Text>
                {this.state.amimafia?<FlatList
                    data={this.state.mafialist}
                    renderItem={({item}) => (
                        <Text style={{fontSize:17,
                            fontFamily:'ConcertOne-Regular',
                            color:colors.font,
                            textDecorationLine:item.alive?'none':'line-through'}}>
                            {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                    )}
                    keyExtractor={item => item.key}
                />:<View/>}
                <Text style = {styles.leftconcerto}>{'Description: '+this.state.roledesc}</Text>
                <Text style = {styles.leftconcerto}>{'Rules: '+this.state.rolerules}</Text>
            </View>
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
        if(this.state.messagechat){
            this.setState({messagechat:false})
        } else if (this.state.notificationchat || this.state.showprofile){
            this.setState({messagechat:true,notificationchat:false,showprofile:false})
        } else {
            this.setState({messagechat:true})
        }
    } else if (chattype == 'notifications'){
        if(this.state.notificationchat){
            this.setState({notificationchat:false})
        } else if (this.state.messagechat || this.state.showprofile){
            this.setState({messagechat:false,notificationchat:true,showprofile:false})
        } else {
            this.setState({notificationchat:true})
        }
    } else if (chattype == 'profile'){
        if(this.state.showprofile){
            this.setState({showprofile:false})
        } else if (this.state.messagechat || this.state.notificationchat){
            this.setState({messagechat:false,notificationchat:false,showprofile:true})
        } else {
            this.setState({showprofile:true})
        }
    }
}

//true  -> increase player count by 1
//false -> decrease player count by 1
_changePlayerCount(bool){
    if(bool){
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum')
            .transaction((playernum)=>{return playernum+1})
    } else {
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum')
            .transaction((playernum)=>{return playernum-1})
    }
}

//Sends a private notice message
_noticeMsg(target,color,message){
    firebase.database().ref('messages/' + target)
        .push({from: 'Private', color: color, message: message})
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

            if (child.val().O) {
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

              //Assassin
            if (child.val().roleid == 'a' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                .once('value',innersnap=>{
                    if(!innersnap.val().N){
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + child.val().target).update({dead:true});
                        this._changePlayerCount(false);

                        this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                            child.val().targetname + ' has been stabbed by the Mafia.')

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
    
            } 
            //Murderer 
            else if (child.val().roleid == 'b' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                .once('value',innersnap=>{
                    if(!innersnap.val().N){
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + child.val().target).update({dead:true});
                        this._changePlayerCount(false);

                        this._noticeMsgGlobal(this.state.roomname,'#d31d1d',
                            child.val().targetname + ' has been stabbed by the Mafia.')

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
   
            } 
            //Schemer
            else if (child.val().roleid == 'c' && !child.val().O) {
                this._noticeMsg(child.key,'#34cd0e','You attempted to frame ' 
                    + child.val().targetname +" last night.");
            } 
            //Spy
            else if (child.val().roleid == 'd' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + child.val().target).once('value',innersnap=>{
                    firebase.database().ref('roles/' + innersnap.val().roleid).once('value',rolename=>{
                        this._noticeMsg(child.key,'#34cd0e','You spied on ' 
                            + child.val().targetname +". Their role is the " + rolename.val().name);
                    })
                })

            } 
            //Detective
            else if (child.val().roleid == 'K' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                .once('value',insidesnap=>{
                    if(insidesnap.val().c || insidesnap.val().suspicious){
                        this._noticeMsg(child.key,'#34cd0e',child.val().targetname +' is hiding something ...');
                    } else {
                        this._noticeMsg(child.key,'#34cd0e',
                            'Nothing was learned from the investigation on ' + child.val().targetname + '.');
                    }
                })

                
            } 
            //Investigator
            else if (child.val().roleid == 'L' && !child.val().O) {
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

                
            } 
            //Doctor
            else if (child.val().roleid == 'N' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/actions/' + child.val().target)
                .once('value',insidesnap=>{
                    if(insidesnap.val().a || insidesnap.val().b){
                        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                            + firebase.auth().currentUser.uid).update({bloody:true});
                        this._noticeMsg(child.val().target,'#34cd0e','The Doctor took care of your stab wounds.');
                        this._noticeMsg(child.key,'#34cd0e','You healed ' 
                            + child.val().targetname +"'s stab wounds.");
                    } else {
                        this._noticeMsg(child.key,'#34cd0e','You visited '+ child.val().targetname + '.');
                    }
                })
            } 
            //Escort
            else if (child.val().roleid == 'O' && !child.val().O) {
                this._noticeMsg(child.val().target,'#34cd0e',
                    'You were distracted last night.');
                this._noticeMsg(child.key,'#34cd0e','You distracted '
                    + child.val().targetname +" last night.");     
            } 
            //Bird Watcher
            else if (child.val().roleid == 'Q' && !child.val().O) {
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
            } 
            //Forensic
            else if (child.val().roleid == 'R' && !child.val().O) {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + child.val().target).once('value',innersnap=>{
                    firebase.database().ref('roles/' + innersnap.val().roleid).once('value',rolename=>{
                        this._noticeMsg(child.key,'#34cd0e','You examined the body of ' 
                        + child.val().targetname + ', the ' + rolename.val().name + '.');
                    })
                })
            }
        })
    })

}

_leaveRoom() {
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    this.msgRef.remove();

    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Room_Screen'})
            ]
        })
    )
}
_deleteRoom() {
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    this.msgRef.remove();
    this.globalMsgRef.remove();
    this.roomRef.remove();
    
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Room_Screen'})
            ]
        })
    )
}
_enableCloseBtn() {
    this.setState({xdisabled:false});
    this.timer = setTimeout(() => {this.setState({xdisabled: true})}, 2000);
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
    
    //this.props.navigation.navigate('Room_Screen')
    this.props.navigation.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Room_Screen'})
            ]
        })
    )
}

render() {

if(!this.state.loaded){
    //Loading Screen
    return <View style = {{flex:1, backgroundColor:colors.background}}/>
}

return this.state.cover?<View style = {{flex:1,backgroundColor:this.state.screencolor}}>

    <View style = {{flex:2}}/>
    
    <FadeInView style = {{flex:1.5,backgroundColor:colors.main,justifyContent:'center'}}>
        {this._renderTransitionHeader()}
    </FadeInView>

    <View style = {{flex:7.5}}/>
    
    <View style = {{flex:1.5,flexDirection:'row',alignContent:'center',justifyContent:'center'}}>
        {this._renderContinueBtn()}
    </View>
    
    <View style = {{flex:2}}/>

</View>:
<View style = {{flex:1, backgroundColor:this.state.screencolor}}>

<View style = {{flex:1,flexDirection:'row',justifyContent:'center'}}>
    <View style = {{flex:1}}/>
    <View style = {{flex:4,backgroundColor:colors.main,justifyContent:'center',
        borderBottomLeftRadius:15,borderBottomRightRadius:15}}>
        {this._renderHeader()}
    </View>
    <View style = {{flex:1,justifyContent:'center'}}>
        <TouchableOpacity
            onPress={()=> {
                this.state.xdisabled?
                    this._enableCloseBtn():
                    this.state.amiowner?this._deleteRoom():this._leaveRoom();
            }}>
            <MaterialCommunityIcons name='close-circle'
                style={{color:this.state.xdisabled?colors.main:colors.highlight, 
                    fontSize:26,alignSelf:'center'}}/>
        </TouchableOpacity>
    </View>
</View>

<View style = {{flex:0.15}}/>

<View style = {{
    flex:11,
    flexDirection:'row',
}}>
    <View style = {{flex:2}}>
    </View>
    <View style = {{flex:13}}>
        <View style = {{flex:2}}>
            {this._renderListComponent()}
        </View>
        <View style = {{flex:this.state.messagechat||this.state.notificationchat||
            this.state.showprofile?3:0,backgroundColor:colors.color1,borderRadius:15}}>
            {this._renderMessageComponent()}
        </View>
    </View>

    <View style = {{flex:2, justifyContent:'center'}}>
        <View style = {{flex:1}}/>
        <View style = {{flex:0.6,justifyContent:'center'}}>
            <TouchableOpacity
                onPress={()=> {
                    this._chatPress('notifications')
                }}
                disabled={this.state.locked}>
                <MaterialCommunityIcons name='comment-alert'
                    style={{color:this.state.notificationchat?colors.highlight:colors.icon, 
                        fontSize:26,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
        <View style = {{flex:0.6,justifyContent:'center'}}>
            <TouchableOpacity
                onPress={()=> {
                    this._chatPress('messages')
                }}
                disabled={this.state.locked}>
                <MaterialCommunityIcons name='clipboard-text' 
                    style={{color:this.state.messagechat?colors.highlight:colors.icon, 
                        fontSize:26,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
        <View style = {{flex:3.3}}/>
        <View style = {{flex:0.6,justifyContent:'center'}}>
            <TouchableOpacity
                onPress={()=> {
                    this._chatPress('profile')
                }}
                disabled={this.state.locked}>
                <FontAwesome name='user-secret'
                    style={{color:this.state.showprofile?colors.highlight:colors.icon, 
                        fontSize:35,alignSelf:'center'}}/>
            </TouchableOpacity>
        </View>
        <View style = {{flex:0.2}}/>
    </View>

</View>

<View style = {{flex:0.15}}/>

<View style = {{flex:1,flexDirection:'row',justifyContent:'center'}}>
    <TouchableOpacity
        disabled={this.state.gameover?false:
            (this.state.disabled?true:(this.state.locked?true:this.state.amidead))}
        onPress={()=> {this.state.gameover?this._gameOver():
            (this._actionBtnPress(this.state.actionbtnvalue, this.state.presseduid,
            this.state.triggernum,this.state.phase,this.state.roomname))}}
        style = {{flex:0.82,justifyContent:'center',
            backgroundColor:!this.state.locked && this.state.actionbtnvalue?colors.highlight:colors.main,
            borderRadius:15}}>
        <Text style = {{color:!this.state.locked && this.state.actionbtnvalue?colors.main:colors.font,
            fontSize:26,alignSelf:'center', fontFamily:'ConcertOne-Regular'}}>
            {this.state.gameover?'CONTINUE':
                (!this.state.locked && !this.state.amidead?'READY':'LOCKED')}
        </Text>
    </TouchableOpacity>
</View>

<View style = {{flex:0.15}}/>

<View style = {{flex:0.5,flexDirection:'row',justifyContent:'center'}}>
    <View style = {{flex:0.7,backgroundColor:colors.main,borderRadius:10,
        justifyContent:'center',alignItems:'center'}}>
        <Text style = {{color:colors.font,fontFamily:'ConcertOne-Regular',
            fontSize:14}}>{this.state.bottommessage}</Text>
    </View>
</View>

<View style = {{flex:0.15}}/>
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
    leftconcerto:{
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        marginTop:5,
    }
});