
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
        listingtype: '',
        voting:'',
        phasename:'',

        namelist: dataSource,

        triggernum:'',

        actionbtnvalue: false,
        presseduid: '',

        amidead:true,

        nominate:'',
    };
    
    this.roomListener = firebase.database().ref('rooms/' + roomname);

}

componentWillMount() {
 
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.roomListener.on('value',snap=>{

        //Keep Phase updated for PERSONAL USER
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({phase:snap.val().phase});
        this.setState({phase:snap.val().phase})
        
        //Find layout type of Phase
        firebase.database().ref('rooms/' + this.state.roomname + '/phases/' + snap.val().phase)
        .once('value',layout=>{
                this.setState({
                    listingtype:layout.val().type,
                    voting:layout.val().voting,
                    phasename:layout.val().name,})
        })

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
        this._updateNominate();

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
        
        var list = [];
        snap.forEach((child)=> {

            var namebtncolor = 'black'
            var namefontcolor = 'white'
            if(child.key == this.state.presseduid){
                namebtncolor = '#e3c382'
                namefontcolor = '#74561a'
            }

            list.push({
                name: child.val().name,
                color: namebtncolor,
                font: namefontcolor,
                dead: child.val().dead,
                lynch: child.val().lynch,
                key: child.key,
            })
        })

        this.setState({namelist:list})
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

_updateNominate(){
    firebase.database().ref('rooms/' + this.state.roomname +'/nominate').once('value',snap=>{
        this.setState({nominate: snap.val()})
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

_resetActions(){
    firebase.database().ref('rooms/' + this.state.roomname + '/actions').remove();
}


//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue,presseduid,triggernum,phase,roomname){

    if(actionbtnvalue == true){

        //If you are UN-PRESSING action button, ALSO remove your vote from your selected player
        if(presseduid != 'foo'){
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + presseduid + '/votes')
            .once('value',snap=>{
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + presseduid)
                .update({votes:(snap.val()-1)})
            })
        }

        this._actionBtnValue(false);
        this._lowerCount();
    } else {

        //If you are PRESSING action button, ALSO add your vote to your selected player
        if(presseduid != 'foo'){
            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + presseduid + '/votes')
            .once('value',snap=>{
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + presseduid)
                .update({votes:(snap.val()+1)})
            })
        }

        this._actionBtnValue(true);
        this._raiseCount();

        firebase.database().ref('rooms/' + roomname + '/phases/' + phase).once('value',snap=>{

            //Check if trigger happens
            if(snap.val().trigger){
                //Check votes
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + presseduid + '/votes')
                .once('value',checkvotes=>{
                    if((checkvotes.val()+1)>triggernum){
                        if(snap.val().actionreset){
                            this._resetActions();
                        };
                        if(snap.val().nominate){
                            firebase.database().ref('rooms/' + roomname).update({nominate:presseduid})
                        };
                        this._changePhase(snap.val().trigger);
                    }
                })
            };
            
            //Check if continue
            firebase.database().ref('rooms/' + roomname + '/count').once('value',countsnap=>{
                firebase.database().ref('rooms/' + roomname + '/playernum').once('value',playernum=>{
                    if((countsnap.val()+1)>playernum.val()){
                        if(snap.val().action){
                            this._actionPhase();
                        }
                        if(snap.val().actionreset){
                            this._resetActions();
                        };
                        this._changePhase(snap.val().continue);
                    }
                })
            });
        })
    }
}

_nameBtnPress(uid,name,triggernum,phase,roomname){
    
    if(this.state.presseduid != uid){
        this._pressedUid(uid);

        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).once('value',snap=>{
                firebase.database().ref('rooms/' + roomname + '/actions/' + snap.val().roleid).set({
                    target:uid,
                    targetname:name,
                    user:snap.key,
                })
        })
    } else {
        this._pressedUid('foo');

        firebase.database().ref('rooms/' + roomname + '/listofplayers/' 
        + firebase.auth().currentUser.uid).once('value',snap=>{
                firebase.database().ref('rooms/' + roomname + '/actions/' + snap.val().roleid).remove();
        })
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
                + this.state.nominate).update({dead:true,lynch:false})

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

_renderHeader() {
    return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
        {this.state.phasename}
    </Text></View>
}

_renderListComponent(){

    if(this.state.listingtype=='normal'){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() => {this._nameBtnPress(item.key,item.name,this.state.triggernum,
                        this.state.phase,this.state.roomname)}}
                    style = {item.dead ? styles.dead : {height:40,
                        backgroundColor: item.color,
                        margin: 10,
                        justifyContent:'center'
                    }}
                    disabled = {item.dead}
                    > 
                    <Text style = {{color:item.font, alignSelf: 'center'}}>{item.name}</Text>
                </TouchableOpacity>

            )}
            keyExtractor={item => item.key}
        />
    } else if(this.state.listingtype=='voting-person'){
        return <FlatList
            data={this.state.namelist}
            renderItem={({item}) => (
                <TouchableOpacity
                    style = {item.dead ? styles.dead : 
                        {height:40,
                        backgroundColor: item.key == this.state.nominate ? '#b3192e' :'gray',
                        margin: 10,
                        justifyContent:'center'
                    }}
                    disabled = {true}
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

_actionPhase() {
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
                            if(m.exists() && m.val().target == child.val().target){
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

                firebase.database().ref('rooms/' + this.state.roomname + '/actions/A/target')
                    .once('value',insidesnap=>{
                        if(insidesnap.val() == child.val().target){
                            this._noticeMsgForTarget(child.val().target,'#34cd0e','The Doctor took care of your stab wounds.');
                            this._noticeMsgForUser(child.val().user,'#34cd0e','You healed ' 
                                + child.val().targetname +"'s stab wounds.");
                        } else {
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
    flexDirection:'row',
    backgroundColor:'white',
}}>

    <View style = {{flex:2,borderWidth:1}}>
        {this._renderListComponent()}
    </View>

    <View style = {{flex:1,borderWidth:1}}>
        <View style = {{flex:1,borderWidth:1,backgroundColor: 'black',justifyContent: 'center',}}>  
            {this._renderHeader()}
        </View>
        <View style = {{flex:1,borderWidth:1}}/>
        <View style = {{flex:0.6,borderWidth:1,justifyContent:'center'}}>
            <ProfileButton
                title='Yes'
                backgroundColor='black'
                color='white'
                disabled={this.state.voting?this.state.amidead:true}
                onPress={()=> {}}
            />
        </View>
        <View style = {{flex:0.6,borderWidth:1,justifyContent:'center'}}>    
            <ProfileButton
                title='No'
                backgroundColor='black'
                color='white'
                disabled={this.state.voting?this.state.amidead:true}
                onPress={()=> {}}
            />
        </View>
        <View style = {{flex:1.8,borderWidth:1}}/>
        <View style = {{flex:1,borderWidth:1,justifyContent:'center'}}>
            <ProfileButton
                title='Continue'
                backgroundColor={this.state.actionbtnvalue ? '#e3c382' : 'black'}
                color={this.state.actionbtnvalue ? '#74561a' : 'white'}
                disabled={this.state.amidead}
                onPress={()=> {this._actionBtnPress(this.state.actionbtnvalue, this.state.presseduid,
                    this.state.triggernum,this.state.phase,this.state.roomname)}}
            />
        </View>
    </View>

</View>
}

}

const styles = StyleSheet.create({
    dead: {
        height:40,
        backgroundColor: 'grey',
        margin: 10,
        justifyContent:'center'
    },
});