
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
import randomize from 'randomatic';

import { Button, List, ListItem } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';

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

        rightlist: dataSource,
        leftlist: dataSource,

        namesize: 3,
        middlesize:2,

        triggernum:'',

        actionbtnvalue: false,

        presseduid: '',

        amidead:true,

        choppingblock:'',
    };
    
    this.roomListener = firebase.database().ref('rooms/' + roomname);

}

componentWillMount() {
 
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.roomListener.on('value',snap=>{

        //Keep Phase updated for PERSONAL USER
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({phase:snap.val().phase});
        
        //Set up Layout based on phase
        if(snap.val().phase==2){
            this.setState({namesize:3, middlesize:2, phase:snap.val().phase})
        } else if(snap.val().phase == 3){
            this.setState({namesize:1, middlesize:6, phase:snap.val().phase})
        } else if(snap.val().phase == 4) {
            this.setState({namesize:3, middlesize:2, phase:snap.val().phase})
        } else if (snap.val().phase == 5){
            this.setState({namesize:3, middlesize:2, phase:snap.val().phase})
        }

        //Update the Trigger Number
        this._updateTrigger(snap.val().playernum)

        //Match Button Presses with the Database from PERSONAL USER
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .once('value',snap=>{
            this.setState({
                presseduid: snap.val().presseduid,
                actionbtnvalue: snap.val().pressedaction
            })
        })

        //Update colors + options for Player Name Buttons
        this._updatePlayerState();
        //Check if you are alive
        this._lifeStatus();
        //Update who's on the chopping block
        this._updateChoppingBlock();

    })

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    alert('umounting')
    if(this.roomListener){
        this.roomListener.off();
    }

}

_updatePlayerState() {
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value', snap=>{
        
        var leftlist = [];
        var rightlist = [];
        var counter = 1;

        snap.forEach((child)=> {

            var namebtncolor = 'black'
            var namefontcolor = 'white'
            if(child.key == this.state.presseduid){
                namebtncolor = '#e3c382'
                namefontcolor = '#74561a'
            }

            if((counter%2) == 1){
                leftlist.push({
                    name: child.val().name,
                    color: namebtncolor,
                    font: namefontcolor,
                    dead: child.val().dead,
                    lynch: child.val().lynch,
                    key: child.key,
                })
            } else {
                rightlist.push({
                    name: child.val().name,
                    color: namebtncolor,
                    font: namefontcolor,
                    dead: child.val().dead,
                    lynch: child.val().lynch,
                    key: child.key,
                })
            }
            counter++;
        })

        this.setState({leftlist:leftlist})
        this.setState({rightlist:rightlist})
    })
}

_lifeStatus(){
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).once('value',snap=>{
            if(snap.val().dead){
                this.setState({amidead:true})
            } else {
                this.setState({amidead:false})
            }
        })
}

_lowerCount() {
    firebase.database().ref('rooms/' + this.state.roomname + '/count').once('value',snap=>{
        firebase.database().ref('rooms/' + this.state.roomname).update({count:snap.val()-1})
    })
}

_raiseCount() {
    firebase.database().ref('rooms/' + this.state.roomname + '/count').once('value',snap=>{
        firebase.database().ref('rooms/' + this.state.roomname).update({count:snap.val()+1})
    })
}

_updateChoppingBlock(){
    firebase.database().ref('rooms/' + this.state.roomname +'/choppingblock').once('value',snap=>{
        this.setState({choppingblock: snap.val()})
    })
}

_changePhase(newphase){
    //Wait 1.5 seconds and then switch phase

    this.setState({actionbtncolor: 'black', actionfontcolor:'white'});
    
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/').once('value',snap=>{
        snap.forEach((child)=>{
            //Set all votes to 0
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                .update({votes:0,lynch:false})

            //Set all Statuses to Neutral
            firebase.database().ref('users/' + child.key + '/room')
                .update({presseduid: 'foo', pressedaction: false})
        })
    })

    firebase.database().ref('rooms/' + this.state.roomname).update({
        count:0, phase:newphase
    })
}

_actionBtnValue(status){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .update({pressedaction: status})
    this.setState({actionbtnvalue: status})
}

_pressedUid(uid){
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .update({presseduid: uid})
    this.setState({presseduid: uid})
}

//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue,triggernum,phase,roomname){

    if(phase == 2) {
        if(actionbtnvalue == true){
            this._actionBtnValue(false);
            this._lowerCount();
        } else {
            this._actionBtnValue(true);

            //When Player has pressed a name button and switches to Continue
            if(this.state.presseduid != 'foo'){
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.presseduid)
                    .once('value',snap=>{
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/'
                            + this.state.presseduid).update({votes:snap.val().votes-1})
                    })
                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                    .update({presseduid: 'foo'})
            }

            firebase.database().ref('rooms/' + roomname).once('value',snap=>{
                
                if((snap.val().count + 2) > this.state.triggernum){
                    firebase.database().ref('rooms/' + roomname + '/actions').remove();
                    this._changePhase(4);
                } else {
                    firebase.database().ref('rooms/' + roomname).update({count:snap.val().count + 1})
                }

            })

        }
    } else if(phase == 3) {
        if(this.state.actionbtnvalue){
            this._lowerCount();
            this._actionBtnValue(false);
        } else {

            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid).update({lynch:false})

            this._actionBtnValue(true);

            firebase.database().ref('rooms/' + this.state.roomname + '/count').once('value',snap=>{
                if((snap.val() + 2)>triggernum){
                    this._changePhase(2)
                } else {
                    firebase.database().ref('rooms/' + roomname).update({count:snap.val().count + 1});
                }
            })
        }
    } else if(phase == 4) {
        if(this.state.actionbtnvalue){
            this._lowerCount();
            this._actionBtnValue(false);
        } else {
            this._raiseCount();
            this._actionBtnValue(true);

            firebase.database().ref('rooms/' + this.state.roomname).once('value',snap=>{
                if((snap.val().count + 2)>snap.val().playernum){

                    //Enter Night phase algorithm
                    this._nightPhase();

                    this._changePhase(2);
                } 
            })
        }
    }
}

_nameBtnPress(uid,name,triggernum,phase,roomname){
    if(phase == 2){

        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid).once('value',snap=>{

            if(this.state.presseduid == uid){

                //Unselecting the Same Player
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                    .update({votes: snap.val().votes - 1})
                firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                    .update({presseduid: 'foo'})
            
            } else {

                //Selecting a Player Normally
                if(this.state.presseduid == 'foo'){

                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                        .update({presseduid: uid})
                    this.setState({presseduid: uid})

                    //When Player has pressed the Action button and switches to a Player
                    if(this.state.actionbtnvalue == true){
                        this._lowerCount();
                        this._actionBtnValue(false);
                    }

                    if((snap.val().votes + 2) > triggernum){
                        
                        firebase.database().ref('rooms/' + roomname).update({choppingblock:uid})
                        this._changePhase(3)
    
                    } else {
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                            .update({votes: snap.val().votes + 1})
    
                        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                            .update({presseduid: uid})
                    }

                } else {   

                    firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.presseduid)
                    .once('value',snapshot=>{
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + snapshot.key)
                            .update({votes: snapshot.val().votes - 1})
                    })

                    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
                        .update({presseduid: uid})
                    this.setState({presseduid: uid})

                    if((snap.val().votes + 2) > triggernum){
                        firebase.database().ref('rooms/' + roomname).update({choppingblock:uid})
                        this._changePhase(3)
    
                    } else {
                        
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                            .update({votes: snap.val().votes + 1})
                    }
                }

                

            }
        })
    } else if(phase == 3){
        
    } else if(phase == 4){
        //If Player has marked 'ready', unmark.
        if(this.state.actionbtnvalue){
            this._lowerCount();
            this._actionBtnValue(false);
        }

        //If user has not selected another Player yet
        if(this.state.presseduid == 'foo'){
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' + snap.val().roleid)
                        .update({target:uid, targetname:name, user:snap.key})
            })
            this._pressedUid(uid)
        //If user is unselecting Player
        } else if (this.state.presseduid == uid) {
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' + snap.val().roleid).remove()
            })
            this._pressedUid('foo')
        //If user is switching his Player selection
        } else {
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
                + firebase.auth().currentUser.uid).once('value',snap=>{
                    firebase.database().ref('rooms/' + roomname + '/actions/' + snap.val().roleid)
                        .update({target:uid,targetname:name})
            })
            this._pressedUid(uid)
        }
    }
}

_lynchBtnPress() {
    if(this.state.actionbtnvalue){
        this._actionBtnValue(false);
        this._lowerCount();
    } 

    //Updates the Players Vote on Lynch
    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).update({lynch:true})

    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value',snap=>{
        
        //Counts the Total number of Players that want to Lynch
        var counter = 0;
        snap.forEach((child)=>{
            if(child.val().lynch){counter++}
        })

        //If the total number reaches the trigger number, player on chopping block is lynched
        if((counter+1)>this.state.triggernum){
            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                + this.state.choppingblock).update({dead:true,lynch:false})

            this._changePlayerCount(false);
            this._changePhase(4);
        }
    })
    
}

_updateTrigger(playernum) {

    const mod = playernum%2;
    this.setState({
        triggernum: (((playernum - mod)/2)+1)
    })

}

_handleBackButton() {
    return true;
}

_renderComponent() {
    
    if(this.state.phase == 2){
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
            Day
        </Text></View>
    } else if(this.state.phase == 3){
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
            Nomination
        </Text></View>
    } else {
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
            Night
        </Text></View>
    }
}

_renderLeftComponent(){

    if(this.state.phase==2){
        return <FlatList
            data={this.state.leftlist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.deadleft : {height:40,
                        backgroundColor: item.color,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    > 
                    <Text style = {{color:item.font, alignSelf: 'center'}}>{item.name}</Text>
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.phase==3){
        return <FlatList
            data={this.state.leftlist}
            renderItem={({item}) => (
                <TouchableOpacity
                    style = {item.dead ? styles.deadleft : {height:40,
                        backgroundColor: item.lynch ? '#b3192e' :item.color,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    > 
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.phase==4){
        return <FlatList
            data={this.state.leftlist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.deadleft : {height:40,
                        backgroundColor: item.color,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    > 
                    <Text style = {{color:item.font, alignSelf: 'center'}}>{item.name}</Text>
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    }
}

_renderCenterComponent() {
    if(this.state.phase==3){
        return <Button
            title='kill'
            backgroundColor='black'
            color='white'
            borderRadius={15}
            onPress={()=>{this._lynchBtnPress()}}
        />
    } else if (this.state.phase == 5){

    }
}

_renderRightComponent(){
    
    if(this.state.phase==2){
        return <FlatList
            data={this.state.rightlist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.deadright : {height:40,
                        backgroundColor: item.color,
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    > 
                    <Text style = {{color:item.font, alignSelf: 'center'}}>{item.name}</Text>
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.phase==3){
        return <FlatList
            data={this.state.rightlist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    style = {item.dead ? styles.deadright : {height:40,
                        backgroundColor: item.lynch ? '#b3192e' :item.color,
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    > 
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />  
    } else if(this.state.phase == 4) {
        return <FlatList
            data={this.state.rightlist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.deadright : {height:40,
                        backgroundColor: item.color,
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                        marginBottom: 10,
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    > 
                    <Text style = {{color:item.font, alignSelf: 'center'}}>{item.name}</Text>
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    }
}

_changePlayerCount(bool){
    if(bool){
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum').once('value',snap=>{
            firebase.database().ref('rooms/' + this.state.roomname).update({playernum:snap.val()+1})
        })
    } else {
        firebase.database().ref('rooms/' + this.state.roomname + '/playernum').once('value',snap=>{
            firebase.database().ref('rooms/' + this.state.roomname).update({playernum:snap.val()-1})
        })
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

_nightPhase() {
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').once('value',snap=>{
        snap.forEach((child)=>{
                //Mafia Kill
            if(child.key == 'A'){

                firebase.database().ref('rooms/' + this.state.roomname + '/mafia/B').once('value',underboss=>{
                    if(underboss.exists()){
                        this._noticeMsgForTarget(underboss.val().uid,'#d31d1d','You were ordered to kill ' 
                            + child.val().target);
                        this._noticeMsgForUser(child.val().user,'#d31d1d','You called the hit on ' 
                            + child.val().targetname);

                        firebase.database().ref('rooms/' + this.state.roomname + '/actions/F').once('value',m=>{
                            //maybe check if it exists
                            if(m.val().target == child.val().target){
                                this._noticeMsgForUser(underboss.val().uid,'#d31d1d','You failed to kill ' 
                                    + child.val().targetname);
                            } else {
                                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                    + child.val().target).update({dead:true});
                                this._changePlayerCount(false);
                                this._noticeMsgForTarget(child.val().target,'#d31d1d','You have been stabbed.');
                                this._noticeMsgForUser(underboss.val().uid,'#d31d1d','You have stabbed ' 
                                    + child.val().targetname);
                            }
                        })
                            

                    } else {
                        if(m.val().target == child.val().target){
                            this._noticeMsgForUser(underboss.val().uid,'#d31d1d','You failed to kill ' 
                                + child.val().targetname);
                        } else {
                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' 
                                + child.val().target).update({dead:true});
                            this._changePlayerCount(false);
                            this._noticeMsgForTarget(child.val().target,'#d31d1d','You have been stabbed.');
                            this._noticeMsgForUser(underboss.val().uid,'#d31d1d','You have stabbed ' 
                                + child.val().targetname);
                        }
                    }
                })

                //Mafia Kill
            } else if (child.key == 'B') {
                

                //Doctor
            } else if (child.key == 'F') {

                //Implement similar logic to GodFather
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                    .once('value',insidesnap=>{
                        if(insidesnap.val().dead){
                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                                .update({dead:false})
                            this._changePlayerCount(true);
                            this._noticeMsgForTarget(child.val().target,'#34cd0e','The Doctor took care of your stab wounds.');
                            this._noticeMsgForUser(child.val().user,'#34cd0e','You healed ' 
                                + child.val().targetname +"'s stab wounds.");
                        } else {
                            firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                                .update({dead:false})
                            this._noticeMsgForTarget(child.val().target,'#34cd0e','The Doctor gave you a visit.');
                            this._noticeMsgForUser(child.val().user,'#34cd0e','You visited ' 
                                + child.val().targetname + '.');
                        }
                    })

                //Detective
            } else if (child.key == 'G') {
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.val().target)
                    .once('value',insidesnap=>{
                        if(insidesnap.val().roleid == 'B'||
                            insidesnap.val().roleid =='C'||
                            insidesnap.val().roleid =='D'||
                            insidesnap.val().roleid == 'E'){
                            this._noticeMsgForUser(child.val().user,'#34cd0e',child.val().targetname 
                                + ' is hiding something ...');
                        } else {
                            this._noticeMsgForUser(child.val().user,'#34cd0e',
                                'Nothing was learned from the investigation on ' + child.val().targetname + '.');
                        }
                    })

                //Villager
            } else if (child.key == 'H') {

            }
        })
    })

}

render() {
    return <View style = {{
        flex:1,
        backgroundColor:'white',
    }}>
        <View style = {{flex:1,flexDirection:'row'}}>
            <View style = {{flex:1}}/>
            <View style = {{
                flex:2,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: 'black',
                justifyContent: 'center',
            }}> 
                {this._renderComponent()}
            </View>
            <View style = {{flex:1}}/>
        </View>
        
        <View style = {{flex:0.2}}/>

        <View style = {{flex:7,flexDirection:'row'}}>
            <View style = {{flex:this.state.namesize}}>
                {this._renderLeftComponent()}
            </View>
            <View style = {{flex:this.state.middlesize,justifyContent:'center'}}>
                {this._renderCenterComponent()}
            </View>
            <View style = {{flex:this.state.namesize}}>
                {this._renderRightComponent()}
            </View>
        </View>


        <View style = {{flex:0.2}}/>

        <View style = {{flex:1,flexDirection:'row'}}>
            <View style = {{flex:1}}/>
            <View style = {{flex:2}}>
                <ProfileButton
                    title='Continue'
                    backgroundColor={this.state.actionbtnvalue ? '#e3c382' : 'black'}
                    color={this.state.actionbtnvalue ? '#74561a' : 'white'}
                    disabled={this.state.amidead}
                    onPress={()=> {this._actionBtnPress(this.state.actionbtnvalue,
                        this.state.triggernum,this.state.phase,this.state.roomname)}}
                />
            </View>
            <View style = {{flex:1}}/>
        </View>

    </View>

}
}

const styles = StyleSheet.create({
    deadleft: {
        height:40,
        backgroundColor: 'grey',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10,
        justifyContent:'center'
    },
    deadright: {
        height:40,
        backgroundColor: 'grey',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        marginBottom: 10,
        justifyContent:'center'
    },    

});