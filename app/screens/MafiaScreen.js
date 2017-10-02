
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
import ToggleListItem from '../components/ToggleListItem.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Day_Screen extends React.Component {

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });


    this.state = {
        roomname: '',
        phase: '',

        rightlist: dataSource,
        leftlist: dataSource,
    };

    //this.ref = firebase.database().ref('rooms/' + params.roomname.toUpperCase());
    //this.playersRef = firebase.database().ref('rooms/' + params.roomname.toUpperCase() 
    //    + '/listofplayers');

}
 /*
componentWillMount() {

    alert('mafia mount')

    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.ref.on('value',snap=>{
        this.setState({phase:snap.val().phase})
    })

    this._pullListOfPlayers();
    
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.ref){
        this.ref.off();
    }
    if(this.playersRef){
        this.playersRef.off();
    }
}

_handleBackButton() {
    return true;
}

_pullListOfPlayers() {
    
    this.playersRef.on('value',snap => {
        
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

_renderComponent(phase) {
    
    if(phase == 2){
        return <View style = {{
            backgroundColor: 'white',
            flex: 1,
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
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        Day Phase
                    </Text>
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        {this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1}}/>
            </View>
    
            <View style = {{flex:0.2}}/>
    
            <View style = {{flex:7,flexDirection: 'row'}}>
                <View style = {{flex:3}}>
                    <FlatList
                        data={this.state.leftlist}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onPress={() => {alert('dumb')}}
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
                <View style = {{flex:2}}/>
                <View style = {{flex:3}}>
                    <FlatList
                        data={this.state.rightlist}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onPress={() => {alert('dumb')}}
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
    
            <View style = {{flex:1}}/>
    
        </View>   
    } 
    if(phase == 3) {
        return <View style = {{
            backgroundColor: 'white',
            flex: 1,
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
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        Nomination Phase
                    </Text>
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        {this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1}}/>
            </View>
    
            <View style = {{flex:0.2}}/>
    
            <View style = {{flex:7}}/>
    
            <View style = {{flex:0.2}}/>
    
            <View style = {{flex:1}}/>
    
        </View>   
    }
    if(phase==4){
        return <View style = {{
            backgroundColor: 'white',
            flex: 1,
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
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        Night Phase
                    </Text>
                    <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                        {this.state.roomname}
                    </Text>
                </View>
                <View style = {{flex:1}}/>
            </View>
    
            <View style = {{flex:0.2}}/>
    
            <View style = {{flex:7,flexDirection: 'row'}}>
                <View style = {{flex:3}}>
                    <FlatList
                        data={this.state.leftlist}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onPress={() => {alert('dumb')}}
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
                <View style = {{flex:2}}/>
                <View style = {{flex:3}}>
                    <FlatList
                        data={this.state.rightlist}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onPress={() => {alert('dumb')}}
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
    
            <View style = {{flex:1}}/>
    
        </View>
    }
}

*/
render() {
/*    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
    }}>
        {this._renderComponent(this.state.phase)}
    </View>*/
    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
    }}>
        <Text>hi</Text>
    </View>
}}
