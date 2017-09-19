
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
import ActionButton from 'react-native-action-button';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

//Components
import HeaderButton from '../components/HeaderButton.js';

class CreateRoom_Screen extends Component {

static navigationOptions = {
    headerTitle: 'Create a Room',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
    }
}

//Initial Room Creation -> Makes a room in Database
_MakeRoomDB(roomname,coffeeshop,roomsize,dropoffloc,dropofftime,uid,cups,owner){
    firebase.database().ref('rooms/' + uid)
    .set({
        roomname,
        owner,
        coffeeshop,
        dropoffloc,
        dropofftime,
        roomsize,
        cups,
        spot1: '',
        spot2: '',
        spot3: '',
        drinktype1: '',
        drinktype2: '',
        drinktype3: '',
        size1: '',
        size2: '',
        size3: '',
        coffeeorder1: '',
        coffeeorder2: '',
        coffeeorder3: '',
        comment1: '',
        comment2: '',
        comment3: '',
    })
}

constructor(props) {
    super(props);
    this.currentRouteName = 'Createfirst';
    this.state = {
        username: null,
        firstname: '',
        lastname: '',
        roomname: '',
        coffeeshop: '', 
        roomsize: '',
        dropoffloc: '', 
        dropofftime: '',
        cups: '',
        loading: false,

        currentuid: '',
    }
  }

componentWillMount() {
    const uid = firebase.auth().currentUser.uid
    const UserDB = firebase.database().ref("users/" + uid)

    UserDB.once('value',snapshot => {
        this.setState({
            username: snapshot.val().username,
            firstname: snapshot.val().firstname,
            lastname: snapshot.val().lastname,
        })
    })

    this.setState({currentuid: firebase.auth().currentUser.uid});
}

render(){

    //Arrays with Dropdown menu options
    let index = 0;
    const shops = [
        { key: index++, section: true, label: 'Coffeeshops' },
        { key: index++, label: "Tim Horton's" },
        { key: index++, label: "William's" },
        { key: index++, label: "Starbucks" },
        { key: index++, label: "Second Cup" },
    ];
    let index2 = 0;
    const cups = [
        { key: index2++, section: true, label: 'How many more Cups?' },
        { key: index2++, label: "1" },
        { key: index2++, label: "2" },
        { key: index2++, label: "3" },
    ];


    this.state.roomname = this.state.firstname + " " + this.state.lastname + "'s Room"

    return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#e6ddd1'        
            }}>

                <FormInput
                    value={this.state.roomname}
                    onChangeText={roomname => this.setState({ roomname })}
                    style={{
                        width: 180,
                        alignSelf: 'center',
                        textAlign: 'center'
                    }}
                />
                
                <ModalPicker
                    data={shops}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({coffeeshop:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="Select a Coffeeshop ..."
                            value={this.state.coffeeshop} />
                </ModalPicker>

                <ModalPicker
                    data={cups}
                    initValue="LOL"
                    onChange={(option)=>{ this.setState({roomsize:option.label})}}>
                        <TextInput
                            style={{
                                padding:10, 
                                height:50,
                                width: 250,
                                alignSelf: 'center',
                                textAlign: 'center'}}
                            editable={false}
                            placeholder="How many more Cups?"
                            value={this.state.roomsize} />
                </ModalPicker>

                <FormInput
                    placeholder="Location ..."
                    value={this.state.dropoffloc}
                    onChangeText={dropoffloc => this.setState({ dropoffloc })}
                />

                <FormInput
                    placeholder="Time ..."
                    value={this.state.dropofftime}
                    onChangeText={dropofftime => this.setState({ dropofftime })}
                />

                <View style = {{marginTop:20, width: 180}}>
                <Button
                    backgroundColor='#b18d77'
                    color='white'
                    title="Create Room"
                    onPress={() => {
                        this._MakeRoomDB(this.state.roomname,this.state.coffeeshop,
                            this.state.roomsize,this.state.dropoffloc,this.state.dropofftime,
                            this.state.currentuid,1,this.state.username);

                        this.props.navigation.navigate('ViewRoom_Screen',{uid: this.state.currentuid,
                            roomname: this.state.roomname})
                        Keyboard.dismiss() }
                    }
                />
                </View>
            </View>
        }
}


class ViewRoom_Screen extends Component {

static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.roomname,
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
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
        coffeeshop: '',
        dropoffloc: '',
        dropofftime: '',
        roomsize: '',
        cups: '',
        spot1: '',
        spot2: '',
        spot3: '',
        loading: false,

        drinktype1: '',
        size1: '',
        coffeeorder1: '',
        comment1: '',
        drinktype2: '',
        size2: '',
        coffeeorder2: '',
        comment2: '',
        drinktype3: '',
        size3: '',
        coffeeorder3: '',
        comment3: '',

        currentuid: '',

        //Passed uid from navigation
        passeduid: '',
    }
    this.ref = null;
}

//Sets all the this.state values that are necessary for viewing your own room
//listens for changes and updates
_compileRoomDB(){
    const { params } = this.props.navigation.state;
    const uid = params.uid
    
    this.setState({passeduid: uid})
    this.ref = firebase.database().ref('rooms/' + uid)
    
    this.ref.on('value', (snapshot) => {
        if(snapshot.exists()){
            this.setState({
                roomname: snapshot.val().roomname,
                owner: snapshot.val().owner,
                coffeeshop: snapshot.val().coffeeshop,
                dropoffloc: snapshot.val().dropoffloc,
                dropofftime: snapshot.val().dropofftime,
                roomsize: snapshot.val().roomsize,
                cups: snapshot.val().cups,
                spot1: snapshot.val().spot1,
                spot2: snapshot.val().spot2,
                spot3: snapshot.val().spot3,

                drinktype1: snapshot.val().drinktype1,
                size1: snapshot.val().size1,
                coffeeorder1: snapshot.val().coffeeorder1,
                comment1: snapshot.val().comment1,
                drinktype2: snapshot.val().drinktype2,
                size2: snapshot.val().size2,
                coffeeorder2: snapshot.val().coffeeorder2,
                comment2: snapshot.val().comment2,
                drinktype3: snapshot.val().drinktype3,
                size3: snapshot.val().size3,
                coffeeorder3: snapshot.val().coffeeorder3,
                comment3: snapshot.val().comment3,

                _key: snapshot.key
            })
        }
    })
}

componentWillUnmount(){
    if(this.ref){
        this.ref.off();
    }
}

//Renders the Order
_renderActiveOrder(username,drinktype,size,coffeeorder,comment,owneruid,currentuid) {
if(username){
    return <View style={styles.orderDetails}>
        <Text style={styles.orderDetailCoffee}>{size + " " + drinktype}</Text>
        <Text style={styles.orderDetailOrder}>{coffeeorder}</Text>
        <Text style={{flex:5,textAlignVertical:'center'}}>picture</Text>
        <Text style={styles.orderDetailUsername}>{username}</Text>
        <Text style={styles.orderDetailComment}>{comment}</Text>
    </View>
} else {
        if(owneruid != currentuid){
            return <View 
                    style={styles.orderDetails}>
                    <Button 
                        color='white'
                        title="Add an Order!"
                        borderRadius={17}
                        backgroundColor='#b18d77'
                        onPress = {() => {
                            this.props.navigation.navigate('MakeOrder_Screen')
                        }}
                    />
                </View> 
        } else {
            return <View 
                    style={styles.orderDetails}>
                    <Button 
                        color='white'
                        title="Add an Order!"
                        borderRadius={17}
                        backgroundColor='#b18d77'
                        onPress = {() => {
                            this.props.navigation.navigate('ViewOrder_Screen')
                        }}
                    />
            </View> 
        }
}}


_DeleteRoomDB(uid){
    firebase.database().ref('rooms/' + uid).remove()
}

_resetStack(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'JoinRoom_Screen'})
                    ]
                  }));
  }

//Renders a different button based on whether the uid of the room
//matches the current user.
_renderDeleteButton(owneruid,currentuid) {

if(owneruid==currentuid){
    return <View
    ><Button
        color='white'
        backgroundColor='#b18d77'
        title="Delete"
        borderRadius={16}
        fontSize={15}
        buttonStyle={{marginTop: 5, marginBottom: 5, paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8}}
        onPress={() => {
            this._DeleteRoomDB(currentuid)
            this.props.navigation.navigate('JoinRoom_Screen')
            this._resetStack()

        }}
    />
</View>      
}}


componentWillMount() {
    this.setState({currentuid: firebase.auth().currentUser.uid});
    this._compileRoomDB();
}

    render(){
        
        const { params } = this.props.navigation.state;

        return <View style={{
                flex: 1,
                backgroundColor: '#e6ddd1',
                }}>
                    <View style = {{
                        flex: 1,
                    }}>
                        <View style ={{
                            flexDirection: 'row',
                            backgroundColor: '#DECFC6',
                        }}>
                            <View style={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 16}}>{this.state.coffeeshop}</Text>
                            </View>

                            <View style={{
                                flex: 1.6,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text 
                                    style={{fontSize: 16}}
                                    numberOfLines= {2}>
                                {this.state.dropoffloc + "\n" + this.state.dropofftime}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 16}}>{this.state.owner}</Text>
                            </View>

                            <View style ={{
                                flex: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {this._renderDeleteButton(this.state._key,this.state.currentuid)}
                            </View>
                        </View>
                    </View>

                    {/*order boxes*/}
                    <View style={{
                        flex: 9,
                        marginBottom: 5,
                    }}>
                        {/*first row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>
                            {/*first order*/}
                            <View style={styles.orderBox}>
                                <View style={styles.orderDetails}>
                                    <Text>{this.state.owner}</Text>
                                </View>
                            </View >

                            {/*second order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot1,this.state.drinktype1,
                                this.state.size1,this.state.coffeeorder1,this.state.comment1,
                                this.state._key,this.state.currentuid)}
                            </View>

                        </View>

                        {/*second row*/}
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                        }}>

                            {/*3rd order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot2,this.state.drinktype2,
                                this.state.size2,this.state.coffeeorder2,this.state.comment2,
                                this.state._key,this.state.currentuid)}
                            </View>

                            {/*4th order*/}
                            <View style={styles.orderBox}>
                                {this._renderActiveOrder(this.state.spot3,this.state.drinktype3,
                                this.state.size3,this.state.coffeeorder3,this.state.comment3,
                                this.state._key,this.state.currentuid)}
                            </View>

                        </View>

                    </View>
            </View>
}}

class JoinRoom_Screen extends React.Component {

static navigationOptions = {
    headerTitle: 'Rooms',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: '#b18d77',
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

        myroomname: '',
        currentuid: '',
    };
    this.ref = null;
    this.ref2 = null;
}

//Renders the Appropriate Action Button
_doIHaveARoom(checkuid,myroomname) {

    if(myroomname){
        return <ActionButton.Item
            buttonColor='#b18d77' 
            title="My Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('ViewRoom_Screen',{uid:checkuid,
                    roomname:myroomname})}}>
            <MaterialIcons name="home" style={styles.actionButtonItem} />
        </ActionButton.Item>
    } else {
        return <ActionButton.Item 
            buttonColor='#b18d77' 
            title="Create Room" 
            hideShadow
            onPress={() => {
                this.props.navigation.navigate('CreateRoom_Screen')}}>
            <MaterialIcons name="add" style={styles.actionButtonItem} />
        </ActionButton.Item>
    }
}

_makeRoomRequest = () => {

    this.setState({ 
        loading: true,
        currentuid: firebase.auth().currentUser.uid 
    });

    this.ref = firebase.database().ref('rooms/')
    this.ref.on('value', (dataSnapshot) => {  
        if(dataSnapshot.exists()){
            var tasks = [];
            dataSnapshot.forEach((child) => {
            if(child.key != this.state.currentuid){
                tasks.push({
                    "owner": child.val().owner,
                    "coffeeshop": child.val().coffeeshop,
                    "dropoffloc": child.val().dropoffloc,
                    "dropofftime": child.val().dropofftime,
                    "roomname": child.val().roomname,
                    "roomsize": child.val().roomsize,
                    "spot1": child.val().spot1,
                    "spot2": child.val().spot2,
                    "spot3": child.val().spot3,
                    "cups": child.val().cups,
                    "_key": child.key
                });
            }
    });
        
        this.setState({
            datac: tasks,
        });
    } else {
        this.setState({
            datac: [],
        })
    }
    });

    //Grab the name of my Room
    this.ref2 = firebase.database().ref('rooms/' + firebase.auth().currentUser.uid  + '/roomname/')
    this.ref2
        .on('value',(snapshot) => {
            if(snapshot.exists()){
                this.setState({
                    myroomname: snapshot.val(),
                })
            } else {
                this.setState({myroomname: null})
            }
        })
    

};

componentWillMount() {
    this._makeRoomRequest();
};

componentWillUnmount() {
    if (this.ref) {
        this.ref.off();
      }
    if (this.ref2) {
        this.ref2.off();
    }
};

render(){
    return <View style={{ backgroundColor: '#e6ddd1',flex: 1 }}>

            <List style={{ borderTopWidth:0, borderBottomWidth:0, backgroundColor: '#e6ddd1', }}>
                <FlatList
                    data={this.state.datac}
                    renderItem={({item}) => (

                        <TouchableOpacity style = {{
                            backgroundColor: '#decfc6', 
                            borderRadius: 15,
                            margin: 15,}}
                            onPress={() => {
                                this.props.navigation.navigate('ViewRoom_Screen',
                                    { uid: item._key,roomname:item.roomname })
                            }}>
                            <Text style = {{
                                backgroundColor:'#b18d77',
                                borderTopLeftRadius:15,
                                borderTopRightRadius:15,
                                color: 'white',
                                textAlign: 'center',}}>{item.roomname}</Text>
                            
                            <View style = {{flexDirection: 'row'}} >
                                <View style = {{flex:1}} >
                                </View>

                                <View style = {{ flex:3,borderWidth:1}}>
                                    <Text>{item.coffeeshop}</Text>
                                    <Text>{item.dropoffloc}</Text>
                                    <Text>{item.dropofftime}</Text>
                                    <Text>{item.owner}</Text>
                                </View>

                                <View style = {{flex:1, justifyContent: 'center'}}>
                                    <Button
                                        title='A'
                                        color='white'
                                        backgroundColor='#b18d77'
                                        borderRadius={4}
                                        fontSize={11}
                                        buttonStyle={{
                                            paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8,
                                            marginTop: 5, marginBottom:5,
                                            }}
                                        onPress={()=>{alert('hi')}}
                                    />
                                    <Button
                                        title='Q'
                                        color='white'
                                        backgroundColor='#b18d77'
                                        borderRadius={4}
                                        fontSize={11}
                                        buttonStyle={{
                                            paddingTop: 5, paddingBottom: 5, paddingLeft: 8, paddingRight: 8,
                                            marginBottom:5,}}
                                        onPress={()=>{alert('hi')}}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item._key}
                />  
            </List>

            <ActionButton
                buttonColor="rgba(222, 207, 198, 1)"
                degrees={30}
                useNativeFeedback = {false} 
                icon={<MaterialIcons name="menu" style={styles.actionButtonIcon }/>}>
                
                    {this._doIHaveARoom(this.state.currentuid,this.state.myroomname)}

             </ActionButton>
             
        </View>
}};

export default stackNav = StackNavigator(
{
    CreateRoom_Screen: {
        screen: CreateRoom_Screen,
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
        initialRouteName: 'JoinRoom_Screen',
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
    orderBox: {
        flex: 1,
        borderWidth: 3,
        margin: 5,
        borderColor: '#b18d77',
        borderStyle: 'dotted',
        borderRadius: 5,
    },
    orderDetails: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderDetailCoffee: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailOrder: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailUsername: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderDetailComment: {
        flex:1,
        textAlignVertical:'center',
        backgroundColor: '#b18d77',
        color: 'white',
        borderRadius:5,
        margin: 2,
        paddingLeft: 10,
        paddingRight: 10,
    }
});