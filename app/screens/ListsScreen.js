
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    TextInput,
    StyleSheet,
    Keyboard,
    ListView,
    FlatList,
    TouchableOpacity
}   from 'react-native';
import { FormInput, List, ListItem, Button } from "react-native-elements";
import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import CountListItem from '../components/CountListItem.js';

class Roles_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Game',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: 'black',
    }
}

constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {

        roles: dataSource,

    }

    this.listRef = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
    this.roomListener = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
}


componentWillMount() {

    this.roomListener.on('value', snap => {
        if(snap.val().roomname){
            
            this.listRef.on('value',snapshot => {
                //If there is a listofroles ...
                if(snapshot.exists()){
                    
                    var roles = [];
                    snap.forEach((child)=> {
                        roles.push({
                            name: child.key,
                            desc: child.val().desc,
                            image: child.val().image,
                            type: child.val().type,
                            color: child.val().color,
                            count: child.val().count,
                            hideChevron: false,
        
                            key: child.key,
                        })
                    })
                    this.setState({ roles:roles })
        
                } else {
                    firebase.database().ref('games/' + snap.val().roomtype).once('value',innersnap=>{
                        var rules = [];
                        innersnap.forEach((child)=>{
                            rules.push({
                                name: child.val().name,
                                desc: child.val().rules,
                                image: child.val().image,
                                type: child.val().type,
                                color: child.val().color,
                                count: 1,
                                hideChevron: true,
            
                                key: child.key, 
                            })
                        })

                        this.setState({ roles: rules })

                    })
                }
            })



        } else {
            firebase.database().ref('users/' + firebase.auth().currentUser.uid 
                + '/games').once('value', snapshot => {
                
                var games = [];
                snapshot.forEach((child)=> {
                    games.push({
                        name: child.key,
                        desc: child.val().desc,
                        hideChevron: true,
                        color: 'black',
                        count: 1,
                        onPress: ()=>{firebase.database().ref('users/' 
                            + firebase.auth().currentUser.uid).update({roomtype:child.key})},

                        key: child.key,
                    })
                })
                this.setState({ roles:games })
            })
        }
    })

}

componentWillUnmount() {
    if(this.userRef){
        this.userRef.off();
    }
}

render(){

    return <View style={{
        flex: 1,
        backgroundColor: 'white'        
    }}>
        <FlatList
            data={this.state.roles}
            renderItem={({item}) => (
                <CountListItem
                    title={item.name}
                    color= {item.color}
                    subtitle={item.desc}
                    count = {item.count}
                    hideChevron={item.hideChevron}
                    onPress={item.onPress}
                />

            )}
            style = {{
                flex:2
            }}
            keyExtractor={item => item.key}
        /> 
    </View>
    }

}


class ViewRoom_Screen extends Component {

static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.roomname,
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#9373d9',
    },
    headerLeft: null,
    headerRight: 
        <HeaderButton
            title="Return"
            onPress={()=> {
                    navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'JoinRoom_Screen'})
                        ]
                    }));
            }}
    />,       
})


constructor(props) {
    super(props);
    this.currentRouteName = 'Createsecond';
    this.state = {
        roomname: '',
        owner: '',
        firstname: '',
        lastname: '',
        coffeeshop: '',
        dropoffloc: '',
        dropofftime: '',
        roomsize: '',
        cups: '',
        loading: false,

        currentuid: '',

        //Passed uid from navigation
        passeduid: '',
        passedgroup: '',
        passedlocation: '',

        drinktype: '',
        size: '',
        coffeeorder: '',
        comment: '',

    }

    this.ref=null;

}

//Sets all the this.state values that are necessary for viewing your own room
//listens for changes and updates
_compileRoomDB(){

    const { params } = this.props.navigation.state;
    const uid = params.uid;
    const activegroup = params.group;
    const activelocation = params.location;
    
    this.setState({passeduid: uid, currentuid: firebase.auth().currentUser.uid,
        passedgroup: activegroup, passedlocation: activelocation});

    this.ref = firebase.database().ref('rooms/' + activegroup + '/' 
    + activelocation + '/' + uid)

    this.ref.on('value', datasnap => {

            this.setState({

                roomname: datasnap.val().roomname,
                owner: datasnap.val().owner,
                firstname: datasnap.val().firstname,
                lastname: datasnap.val().lastname,
                coffeeshop: datasnap.val().coffeeshop,
                dropoffloc: datasnap.val().dropoffloc,
                roomsize: datasnap.val().roomsize,
                cups: datasnap.val().cups,

                _key: datasnap.key

            })
        })
  
}
/*
componentWillUnmount(){

    if(this.ref) {
        this.ref.off();
    }
}*/

//Renders a different button based on whether the uid of the room
//matches the current user.
_renderDeleteButton(owneruid,currentuid) {

    if(owneruid==currentuid){
        return <View><Button
            color='white'
            backgroundColor='#9373d9'
            title="Delete"
            borderRadius={16}
            fontSize={15}
            buttonStyle={{marginTop: 5, marginBottom: 5, paddingTop: 5, paddingBottom: 5, 
                paddingLeft: 8, paddingRight: 8}}
            onPress={() => {
                this._DeleteRoomDB(currentuid)
                this.props.navigation.navigate('JoinRoom_Screen')
                this._resetStack()
        }}/>
    </View>      
    }
}

/*
componentWillMount() {
    this._compileRoomDB();
}*/

    render(){
        
        const { params } = this.props.navigation.state;

        return <View style={{
                flex: 1,
                backgroundColor: 'white',
                }}>
                    <View style = {{
                        borderWidth: 1,
                        flex: 1,
                        flexDirection: 'row',
                    }}>
                        <View style = {{flex:2.4,borderWidth:1,}}>
                            <Text>{'Coffeeshop: ' + this.state.coffeeshop}</Text>
                            <Text>{'Location: ' + this.state.dropoffloc}</Text>
                            <Text>{'Owner: ' + this.state.firstname + ' ' + this.state.lastname}</Text>
                            <Text>{'Username: ' + this.state.owner}</Text>
                        </View>

                        <View style = {{flex:1,borderWidth:1,}}>
                            <Text>LOGO</Text>
                        </View>
                    </View>

                    <View style = {{
                        borderWidth: 1,
                        flex: 3,
                        flexDirection: 'row',
                    }}>
                        <View style = {{flex:1.2,borderWidth:1,}}>
                            <Text style = {{ flex:3 }}>Order Picture</Text>
                            
                            <View style = {{flex:1}}><ProfileButton 
                                title = "Add Order!"
                                icon={{name: 'add-circle', size: 18}}
                                onPress = {() => {alert('hi')}}
                            /></View>
                        </View>

                        <View style = {{flex:1,borderWidth:1,}}>
                            <View style = {{flex:0.3,borderWidth:1}}></View>
                            <Text style = {{flex:1}}>Order Details</Text>
                            <View style = {{flex:0.3,borderWidth:1}}></View>
                        </View>
                    </View>

                    <View style = {{
                        borderWidth: 1,
                        flex: 1.5,
                    }}>
                        <View style = {{flex:1,justifyContent:'center'}}>
                            <TextInput
                                placeholder='Comment ...'
                                style={{
                                    backgroundColor: '#decfc6',
                                    borderRadius: 10,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 10,
                                }}
                                value = {this.state.comment}
                                onChangeText = {(text) => {this.setState({comment: text})}}
                            />
                        </View>
                        <View style = {{flex:1,borderWidth:1,}}>
                            <Text>Blank Space?</Text>
                        </View>
                    </View>
            </View>
}}

class JoinRoom_Screen extends React.Component {

static navigationOptions = {
    headerTitle: 'Rooms',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#9373d9',
    }
}

constructor(props) {
    super(props);
    this.currentRouteName = 'Join';

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
        datac: dataSource,
        loading: false,

        roomflag: '',
        currentuid: '',

        activegroup: '',
        activelocation: '',
    };

    this.userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    this.filterRef = firebase.database().ref('filters/' + firebase.auth().currentUser.uid);
}

//Renders the Appropriate Action Button
_doIHaveARoom(checkuid) {

    if(this.state.roomflag == true){
        return <ActionButton.Item
            buttonColor='#9373d9' 
            title="My Room"
            hideShadow
            onPress={() => {
                alert('Navigate to My Room')    
            }}>
            <MaterialIcons name="home" style={styles.actionButtonItem} />
        </ActionButton.Item>
    } else {
        return <ActionButton.Item 
            buttonColor='#9373d9' 
            title="Create Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('Roles_Screen')}}>
            <MaterialIcons name="add" style={styles.actionButtonItem} />
        </ActionButton.Item>
    }
}

_makeRoomRequest = () => {

    this.setState({ 
        loading: true,
        currentuid: firebase.auth().currentUser.uid 
    });

    this.userRef.on('value', snapshot => {

        //Check if user has a room
        this.setState({roomflag: snapshot.val().roomflag, activegroup: snapshot.val().activegroup})

        firebase.database().ref('locations/' + firebase.auth().currentUser.uid
            + '/' + snapshot.val().activegroup).once('value', snap => {

                this.setState({activelocation: snap.val().activelocation})

                this.filterRef.once('value', filtersnap => {

                    firebase.database().ref('rooms/' + snapshot.val().activegroup + '/'
                        + snap.val().activelocation).orderByChild("coffeeshop")
                        .equalTo(filtersnap.val().roomfilter).once('value', insidesnap => {

                            var tasks = [];
                            insidesnap.forEach((child) => {
                            
                                //Set to != for non-debugging purposes
                                if(child.key == this.state.currentuid){
                                    tasks.push({
                                        "owner": child.val().owner,
                                        "coffeeshop": child.val().coffeeshop,
                                        "dropoffloc": child.val().dropoffloc,
                                        "roomname": child.val().roomname,
                                        "roomsize": child.val().roomsize,
                                        "spot1": child.val().spot1,
                                        "spot2": child.val().spot2,
                                        "spot3": child.val().spot3,
                                        "cups": child.val().cups,
                                        "_key": child.key
                                    });
                                }

                            })
                    
                            this.setState({
                                datac: tasks,
                            });
                    })

                })

        })

    });
}
/*
componentWillMount() {
    this._makeRoomRequest();
};

componentWillUnmount() {
    if (this.userRef) {
        this.userRef.off();
    }
};*/


render(){
    return <View style={{ backgroundColor: 'white',flex: 1 }}>

            <Button
            title={'Group: ' + this.state.activegroup + ' / ' + 'Location: ' + this.state.activelocation}
            onPress={()=>{}}
            backgroundColor= '#9373d9'
            borderRadius= {10}
            buttonStyle={{marginTop:5,marginBottom:5, height:23}}
            fontSize={12}
            />

            <List style={{ borderRadius:10,marginLeft:10,marginRight:10,marginBottom:10,
                backgroundColor: '#9373d9',}}>
                <FlatList
                    data={this.state.datac}
                    renderItem={({item}) => (
                        <ListItem 
                            title={item.roomname}
                            titleStyle={{
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            subtitle={item.coffeeshop + "\n" + item.dropoffloc + "\n" 
                                + item.firstname+" "+item.lastname+" ("+item.owner+")"}
                            subtitleNumberOfLines={4}
                            subtitleStyle={{
                                color: '#decfc6'
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('ViewRoom_Screen',
                                    { uid: item._key,roomname:item.roomname,
                                    group:this.state.activegroup, location: this.state.activelocation })
                            }}
                        />

                    )}
                    keyExtractor={item => item._key}
                />  
            </List>
             
        </View>
}};

export default stackNav = StackNavigator(
{
    Roles_Screen: {
        screen: Roles_Screen,
    },
    ViewRoom_Screen: {
        screen: ViewRoom_Screen,
    },
    JoinRoom_Screen: {
        screen: JoinRoom_Screen,
    },
},
    {
        headerMode: 'screen',
        initialRouteName: 'Roles_Screen',
    }
);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#8b6f4b',
    },
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});