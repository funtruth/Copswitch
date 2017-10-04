
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

import { Button, List, ListItem, FormInput } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
import NormalListItem from '../components/NormalListItem.js';

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

        actionbtncolor: 'black',
        actionfontcolor: 'white',
        actionbtnvalue: false,

        presseduid: 'foo',
    };
    
    this.roomListener = firebase.database().ref('rooms/' + roomname);

}

componentWillMount() {
 
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.roomListener.on('value',snap=>{

        //Keep Phase updated
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({phase:snap.val().phase});
        
        //Set up Layout based on phase
        if(snap.val().phase == 3){
            this.setState({namesize:2, middlesize:4, phase:snap.val().phase})
        } else {
            this.setState({namesize:3, middlesize:2, phase:snap.val().phase})
        }

        //Update the Trigger Number
        this._updateTrigger(snap.val().playernum)

    })

    firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers').once('value', snap=>{

        var leftlist = [];
        var rightlist = [];
        var counter = 1;

        snap.forEach((child)=> {
            if((counter%2) == 1){
                leftlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            } else {
                rightlist.push({
                    name: child.val().name,
                    key: child.key,
                })
            }
            counter++;
        })

        this.setState({leftlist:leftlist})
        this.setState({rightlist:rightlist})
    })


}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.roomListener){
        this.roomListener.off();
    }

}

_changePhase(newphase){
    //Wait 1.5 seconds and then switch phase
    setTimeout(()=> {
        this.setState({actionbtncolor: 'black', actionfontcolor:'white'});

        //Set all votes to 0
        firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/').once('value',snap=>{
            snap.forEach((child)=>{
                firebase.database().ref('rooms/' + this.state.roomname + '/listofplayers/' + child.key)
                    .update({votes:0})
            })

            firebase.database().ref('rooms/' + this.state.roomname).update({count:0})
        })

        firebase.database().ref('rooms/' + this.state.roomname).update({phase:newphase})
    },1500)
}

//Pressing the Action Button at the Bottom of Screen
_actionBtnPress(actionbtnvalue,triggernum,phase,roomname){
    alert(this.state.presseduid)
    if(phase == 2) {
        if(actionbtnvalue == true){

            this.setState({
                actionbtnvalue:false,
                actionbtncolor:'black',
                actionfontcolor:'white',
            })
            firebase.database().ref('rooms/' + roomname + '/count').once('value',snap=>{
                firebase.database().ref('rooms/' + roomname).update({count:snap.val() - 1})
            })

        } else {

            this.setState({
                actionbtnvalue:true,
                actionbtncolor:'#e3c382',
                actionfontcolor:'#74561a',
            })

            firebase.database().ref('rooms/' + roomname).once('value',snap=>{
                
                if((snap.val().count + 2) > this.state.triggernum){

                    firebase.database().ref('rooms/' + roomname).update({count:0});
                    this._changePhase(4);

                } else {
                    firebase.database().ref('rooms/' + roomname).update({count:snap.val().count + 1})
                }

            })

        }
    }
    if(phase == 3) {

    }
    if(phase == 4) {

    }
}

_nameBtnPress(uid,triggernum,phase,roomname){
    if(phase == 2){

        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid).once('value',snap=>{

            if(this.state.presseduid == uid){

                //Unselecting the Same Player
                firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                    .update({votes: snap.val().votes - 1})
                this.setState({presseduid: 'foo'})
            
            } else {

                //Selecting a Player Normally
                if(this.state.presseduid == 'foo'){

                    if((snap.val().votes + 2) > triggernum){
                        
                        firebase.database().ref('rooms/' + roomname).update({choppingblock:uid})
                        this._changePhase(3)
    
                    } else {
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                            .update({votes: snap.val().votes + 1})
    
                        this.setState({presseduid: uid})
                    }

                } else {

                    if((snap.val().votes + 2) > triggernum){
                        
                        firebase.database().ref('rooms/' + roomname).update({choppingblock:uid})
                        this.setState({presseduid: 'foo'})
                        this._changePhase(3)
    
                    } else {
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + this.state.presseduid)
                        .once('value',snapshot=>{
                            firebase.database().ref('rooms/' + roomname + '/listofplayers/' + snapshot.key)
                            .update({votes: snapshot.val().votes - 1})
                        })
                        
                        firebase.database().ref('rooms/' + roomname + '/listofplayers/' + uid)
                            .update({votes: snap.val().votes + 1})
    
                        this.setState({presseduid: uid})
                    }
                }

                

            }
        })
    }
    if(phase == 3){

    }
    if(phase == 4){

    }
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

_renderComponent(phase) {
    
    if(phase == 2){
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>2</Text></View>
    }
    if(phase == 3){
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>3</Text></View>
    }
    if(phase == 4){
        return <View><Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>4</Text></View>
    }
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
                {this._renderComponent(this.state.phase)}
            </View>
            <View style = {{flex:1}}/>
        </View>
        
        <View style = {{flex:0.2}}/>

        <View style = {{flex:7,flexDirection:'row'}}>
            <View style = {{flex:this.state.namesize}}>
                <FlatList
                    data={this.state.leftlist}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            onPress={() => {this._nameBtnPress(item.key,this.state.triggernum,
                                this.state.phase,this.state.roomname)}}
                            style = {{
                                height:40,
                                backgroundColor: 'black',
                                borderBottomRightRadius: 10,
                                borderTopRightRadius: 10,
                                marginBottom: 10,
                                justifyContent:'center'
                        }}> 
                            <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.key}
                />
            </View>
            <View style = {{flex:this.state.middlesize}}>


            </View>
            <View style = {{flex:this.state.namesize}}>
                <FlatList
                    data={this.state.rightlist}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            onPress={() => {this._nameBtnPress(item.key,this.state.triggernum,
                                this.state.phase,this.state.roomname)}}
                            style = {{
                                height:40,
                                backgroundColor: 'black',
                                borderBottomLeftRadius: 10,
                                borderTopLeftRadius: 10,
                                marginBottom: 10,
                                justifyContent:'center'
                        }}> 
                            <Text style = {{color:'white', alignSelf: 'center'}}>{item.name}</Text>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.key}
                />
            </View>
        </View>


        <View style = {{flex:0.2}}/>

        <View style = {{flex:1,flexDirection:'row'}}>
            <View style = {{flex:1}}/>
            <View style = {{flex:2}}>
                <ProfileButton
                    title='Continue'
                    backgroundColor={this.state.actionbtncolor}
                    color={this.state.actionfontcolor}
                    onPress={()=> {this._actionBtnPress(this.state.actionbtnvalue,
                        this.state.triggernum,this.state.phase,this.state.roomname)}}
                />
            </View>
            <View style = {{flex:1}}/>
        </View>

    </View>

}
}
