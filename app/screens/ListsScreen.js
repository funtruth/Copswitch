
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import Rules from '../misc/rules.json';
import firebase from '../firebase/FirebaseController.js';

import colors from '../misc/colors.js';
import { onSignOut } from "../auth";
import * as Animatable from 'react-native-animatable';

class General extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            active:false,
            roomname: null,
        }

        this.messageRef         = firebase.database().ref('messages')
                                .child(firebase.auth().currentUser.uid);
        this.listOfRolesRef     = firebase.database().ref('listofroles')
                                .child(firebase.auth().currentUser.uid);
    }

    _logOut() {
        if(firebase.auth().currentUser.isAnonymous){
            onSignOut().then(() => { 
                firebase.auth().currentUser.delete().then(()=>{
                    this.props.navigation.dispatch(
                        NavigationActions.reset({
                            index: 0,
                            key: null,
                            actions: [
                                NavigationActions.navigate({ routeName: 'SignedOut'})
                            ]
                        })
                    )
                })
            })
            
        } else {
            onSignOut().then(() => { 
                firebase.auth().signOut()
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedOut'})
                        ]
                    })
                )
            }) 
            
        }
    }

    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        this.messageRef.remove().then(()=>{
            this.listOfRolesRef.remove().then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedIn'})
                        ]
                    })
                )
            })
        })
    }

    componentWillMount() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            if(result!=null){
                this.setState({
                    active:true,
                    roomname:result,
                })
            } else {
                this.setState({
                    active:false,
                    roomname:null,
                })
            }
        })
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <MenuButton
                viewFlex = {0.13}
                flex = {0.9}
                fontSize = {25}
                title = 'Roles'
                onPress = {()=>{ this.state.active?
                    this.props.navigation.navigate('ActiveRoles', {roomname:this.state.roomname})
                    :
                    this.props.navigation.navigate('Roles')
                }}/>
            <MenuButton
                viewFlex = {0.13}
                flex = {0.9}
                fontSize = {25}
                title = 'Rulebook'
                onPress = {()=>{ this.props.navigation.navigate('Rulebook') }}
            />
            <MenuButton
                viewFlex = {0.13}
                flex = {0.9}
                fontSize = {25}
                title = 'About'
                onPress = {()=>{ this.props.navigation.navigate('InfoPage',{section:'about'}) }}
            />
            {this.state.active?<View><View style = {{flex:0.1}}/>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Leave Room'
                onPress = {()=>{ this._deleteRoom()}}
            /></View>:null}
        </View>
    }
}

class Roles extends Component {

    static navigationOptions = {
        headerTitle: <Text style = {{fontSize:20,
            fontFamily: 'ConcertOne-Regular',
            color:colors.font,
            marginLeft:15}}>Roles</Text>,
        headerStyle: { backgroundColor: colors.headerbackground},
        headerTintColor: colors.headerfont,
    };

    constructor(props) {
        super(props);

        this.state = {
            townlist: [],
            mafialist: [],
            neutrallist: [],
            roleid:   'a',
            modalVisible: false,

            showfilter:  false,
            showtown:    true,
            showmafia:   false,
            showneutral: false,
        }

    }


    componentWillMount() {

        var keys = Object.keys(Rolesheet).sort()
        var filterlist = [];
        var townlist = [];
        var mafialist = [];
        var neutrallist = [];
        keys.forEach(function(key){
            if(Rolesheet[key].type == 1){
                mafialist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    key:            key,
                })
            } else {
                neutrallist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    key:            key,
                })
            }
        })
        this.setState({
            mafialist:mafialist,
            townlist:townlist,
            neutrallist:neutrallist,
        })
    }

    _roleBtnPress(key) {
        this.setState({roleid:key, modalVisible:true})
    }

    _renderTitle() {
        return <View style = {{flex:0.7, flexDirection:'row',
            justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.titleFont}>
                {Rolesheet[this.state.roleid].name}</Text>
        </View>
    }
    _renderDesc() {
        return <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.normalFont}>
                {Rolesheet[this.state.roleid].desc}</Text>
        </View>
    }
    _renderImage(){
        return <View style = {{flex:4,justifyContent:'center',alignItems:'center'}}>
            <Image 
                style={{width:200,height:200}}
                source={{uri: Rolesheet[this.state.roleid].image}}
            />
        </View>
    }
    _renderInfoBox() {
        return <View style = {{flex:3,marginLeft:10,marginRight:10}}>
            <Text style = {styles.normalFont}>{'Team: ' + Rolesheet[this.state.roleid].type}</Text>
            <Text style = {styles.normalFont}>{'Suspicious: ' + Rolesheet[this.state.roleid].suspicious}</Text>
            <Text style = {styles.normalFont}>{'Visits: ' + Rolesheet[this.state.roleid].visits}</Text>
            <Text style = {styles.normalFont}>{'Rules: ' + Rolesheet[this.state.roleid].rules}</Text>
        </View>
    }
    _renderCloseBtn() {
        return <MenuButton
            viewFlex = {1}
            flex = {0.6}
            fontSize = {20}
            title = 'CLOSE'
            onPress = {()=>{this.setState({modalVisible:false})}}
        />
    }

    render(){
        return <View style = {{flex:1, backgroundColor:colors.background}}>

            <Modal
                animationType = 'fade'
                transparent
                visible = {this.state.modalVisible}
                onRequestClose = {()=>{this.setState({modalVisible:false})}} >
                <TouchableWithoutFeedback 
                    style = {{flex:1}}
                    onPress = {()=>{this.setState({modalVisible:false})}}>
                    <View style = {{flex:1, backgroundColor:'rgba(109, 132, 156, 0.73)',
                        justifyContent:'center',alignItems:'center'}}>
                        <TouchableWithoutFeedback>
                            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <View style = {{backgroundColor:colors.main,flex:0.9,borderRadius:10}}>
                                    {this._renderTitle()}
                                    {this._renderDesc()}
                                    {this._renderImage()}
                                    {this._renderInfoBox()}
                                    {this._renderCloseBtn()}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center', 
                    marginTop:5, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showfilter:!this.state.showfilter,
                    })
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:3}}>Filters</Text>
            </TouchableOpacity>

            {!this.state.showfilter? null: <View style = {{flex:0.2}}><FlatList
                data={this.state.townlist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showtown:!this.state.showtown,
                        showmafia:false,
                        showneutral:false,
                    })
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:3}}>Town</Text>
            </TouchableOpacity>

            {!this.state.showtown? null: <View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.townlist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showmafia:!this.state.showmafia,
                        showtown:false,
                        showneutral:false,
                    }) 
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:5}}>Mafia</Text>
            </TouchableOpacity>

            {!this.state.showmafia?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.mafialist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showneutral:!this.state.showneutral,
                        showtown:false,
                        showmafia:false,
                    })
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:5}}>Neutral</Text>
            </TouchableOpacity>

            {!this.state.showneutral?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.neutrallist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}
        </View>
    }
}

class ActiveRoles extends Component {
    
    static navigationOptions = {
        header:null
    };

    constructor(props) {
        super(props);

        this.state = {
            townlist: [],
            mafialist: [],
            neutrallist: [],
            roleid:   'a',
            modalVisible: false,

            showfilter:  false,
            showtown:    true,
            showmafia:   false,
            showneutral: false,
        }
    }


    componentWillMount() {

        const { params } = this.props.navigation.state;
        const roomname = params.roomname;

        this.listOfRoles = firebase.database().ref('listofroles/' + roomname);

        this.listOfRoles.on('value',snap=>{
            if(snap.exists()){
                var mafialist = [];
                var townlist = [];
                var neutrallist = [];
                snap.forEach((child)=>{
                    if(Rolesheet[child.key].type == 1){
                        mafialist.push({
                            name:           Rolesheet[child.key].name,
                            index:          Rolesheet[child.key].index,
                            category:       Rolesheet[child.key].category,
                            count:          child.val(),
                            image:          Rolesheet[child.key].image,
                            color:          Rolesheet[child.key].color,
                            key:            child.key,    
                        })
                        mafialist[Rolesheet[child.key].index]['count'] = child.val()
                    } else if (Rolesheet[child.key].type == 2) {
                        townlist.push({
                            name:           Rolesheet[child.key].name,
                            index:          Rolesheet[child.key].index,
                            category:       Rolesheet[child.key].category,
                            count:          child.val(),
                            image:          Rolesheet[child.key].image,
                            color:          Rolesheet[child.key].color,
                            key:            child.key,    
                        })
                    } else {
                        neutrallist.push({
                            name:           Rolesheet[child.key].name,
                            index:          Rolesheet[child.key].index,
                            category:       Rolesheet[child.key].category,
                            count:          child.val(),
                            image:          Rolesheet[child.key].image,
                            color:          Rolesheet[child.key].color,
                            key:            child.key,    
                        })
                    }
                })
                this.setState({
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist
                })
            }
        })

    }

    componentWillUnmount(){
        if(this.listOfRoles){
            this.listOfRoles.off();
        }
    }

    _roleBtnPress(key) {
        this.setState({roleid:key, modalVisible:true})
    }


    _renderTitle() {
        return <View style = {{flex:0.7, flexDirection:'row',
            justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.titleFont}>
                {Rolesheet[this.state.roleid].name}</Text>
        </View>
    }
    _renderDesc() {
        return <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
            <Text style = {styles.normalFont}>
                {Rolesheet[this.state.roleid].desc}</Text>
        </View>
    }
    _renderImage(){
        return <View style = {{flex:4,justifyContent:'center',alignItems:'center'}}>
            <Image 
                style={{width:200,height:200}}
                source={{uri: Rolesheet[this.state.roleid].image}}
            />
        </View>
    }
    _renderInfoBox() {
        return <View style = {{flex:3,marginLeft:10,marginRight:10}}>
            <Text style = {styles.normalFont}>{'Team: ' + Rolesheet[this.state.roleid].type}</Text>
            <Text style = {styles.normalFont}>{'Suspicious: ' + Rolesheet[this.state.roleid].suspicious}</Text>
            <Text style = {styles.normalFont}>{'Visits: ' + Rolesheet[this.state.roleid].visits}</Text>
            <Text style = {styles.normalFont}>{'Rules: ' + Rolesheet[this.state.roleid].rules}</Text>
        </View>
    }
    _renderCloseBtn() {
        return <MenuButton
            viewFlex = {1}
            flex = {0.6}
            fontSize = {20}
            title = 'CLOSE'
            onPress = {()=>{this.setState({modalVisible:false})}}
        />
    }

    render(){
        return <View style = {{flex:1, backgroundColor:colors.background}}>

            <Modal
                animationType = 'fade'
                transparent
                visible = {this.state.modalVisible}
                onRequestClose = {()=>{this.setState({modalVisible:false})}} >
                <TouchableWithoutFeedback 
                    style = {{flex:1}}
                    onPress = {()=>{this.setState({modalVisible:false})}}>
                    <View style = {{flex:1, backgroundColor:'rgba(109, 132, 156, 0.73)',
                        justifyContent:'center',alignItems:'center'}}>
                        <TouchableWithoutFeedback>
                            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <View style = {{backgroundColor:colors.main,flex:0.9,borderRadius:10}}>
                                    {this._renderTitle()}
                                    {this._renderDesc()}
                                    {this._renderImage()}
                                    {this._renderInfoBox()}
                                    {this._renderCloseBtn()}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showtown:!this.state.showtown,
                        showmafia:false,
                        showneutral:false,
                    })
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:3}}>Town</Text>
            </TouchableOpacity>

            {!this.state.showtown? null: <View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.townlist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showmafia:!this.state.showmafia,
                        showtown:false,
                        showneutral:false,
                    }) 
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:5}}>Mafia</Text>
            </TouchableOpacity>

            {!this.state.showmafia?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.mafialist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}

            <TouchableOpacity
                style = {{backgroundColor:colors.font, borderRadius:2,
                    justifyContent:'center', alignItems:'center',
                    marginTop:3, marginBottom:3, flex:0.075}}
                onPress = {()=>{
                    this.setState({
                        showneutral:!this.state.showneutral,
                        showtown:false,
                        showmafia:false,
                    })
                }} >
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',
                    fontSize: 25, color: colors.background,
                    marginTop:5, marginBottom:5}}>Neutral</Text>
            </TouchableOpacity>

            {!this.state.showneutral?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.neutrallist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:colors.background,flex:0.33,
                            borderRadius:10, margin:3}}>
                        <View style = {{justifyContent:'center',alignItems:'center'}}>
                            <Image 
                                style={{width:70,height:70}}
                                source={{uri: Rolesheet[item.key].image}}
                            />
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:18}}>{item.name}</Text>
                            <Text style = {{
                                color:colors.font,
                                fontFamily: 'ConcertOne-Regular',
                                fontSize:14,
                                marginBottom:5}}>{item.category}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={{margin:3}}
                numColumns = {3}
                keyExtractor={item => item.key}
            />
            </View>}
        </View>
    }
}

class Rulebook extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.messageRef         = firebase.database().ref('messages')
                                .child(firebase.auth().currentUser.uid);
        this.listOfRolesRef     = firebase.database().ref('lsitofroles')
                                .child(firebase.auth().currentUser.uid);
    }

    _logOut() {
        if(firebase.auth().currentUser.isAnonymous){
            onSignOut().then(() => { 
                firebase.auth().currentUser.delete().then(()=>{
                    this.props.navigation.dispatch(
                        NavigationActions.reset({
                            index: 0,
                            key: null,
                            actions: [
                                NavigationActions.navigate({ routeName: 'SignedOut'})
                            ]
                        })
                    )
                })
            })
            
        } else {
            onSignOut().then(() => { 
                firebase.auth().signOut()
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedOut'})
                        ]
                    })
                )
            }) 
            
        }
    }

    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        this.messageRef.remove().then(()=>{
            this.listOfRolesRef.remove().then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedIn'})
                        ]
                    })
                )
            })
        })
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <Text style = {styles.titleFont}>How to Play</Text>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'General'
                onPress = {()=>{  }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Set Up'
                onPress = {()=>{ this.props.navigation.navigate('InfoPage',{section:'making'}) }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'My Role'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Phases'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Messages'
                onPress = {()=>{ }}
            />
        </View>
    }
}

class Setup extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <Text style = {styles.titleFont}>Setup</Text>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Making a Room'
                onPress = {()=>{ this.props.navigation.navigate('Roles') }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Joining a Room'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Role Selection'
                onPress = {()=>{ }}
            />
            <View style = {{flex:0.1}}/>
        </View>
    }
}

class InfoPage extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            infolist: [],
        }
    }


    componentWillMount(){

        const { params } = this.props.navigation.state;
        const section = params.section;

        var keys = Object.keys(Rules[section]).sort()
        var infolist = [];
        keys.forEach(function(key){
            infolist.push({
                type:           (Rules[section])[key].type,
                desc:           (Rules[section])[key].desc,
                onpressroute:   (Rules[section])[key].route,
                key:            key,
            })
        })
        this.setState({infolist:infolist})
    }

    _renderListItem(item) {
        if(item.type == 1){
            return <View style = {styles.detailContainer}>
                <Text style = {styles.detail}>{item.desc}</Text>
            </View>
        } else if (item.type == 2){
            return <View style = {styles.commentContainer}>
                <Text style = {styles.comment}>{item.desc}</Text>
            </View>
        }
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <FlatList
                data={this.state.infolist}
                renderItem={({item}) => this._renderListItem(item) }
                numColumns = {1}
                keyExtractor={item => item.key}
            />
        </View>
    }
}


export default RuleBook = StackNavigator(
    {
      General: {
        screen: General,
      },
      Roles: {
        screen: Roles,
      },
      ActiveRoles: {
        screen: ActiveRoles,
      },
      Rulebook: {
        screen: Rulebook,
      },
      Setup: {
        screen: Setup,
      },
      InfoPage: {
        screen: InfoPage,
      },
    },
    {
      initialRouteName: 'General',
      headerMode: 'screen',
    }
  );

  const styles = StyleSheet.create({
    normalFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.background,
    },
    titleFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.main,
    },
    detail: {
        color:colors.font,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    detailContainer: {
        backgroundColor:colors.color2,
        borderRadius:2,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    comment: {
        color:colors.background,
        fontFamily: 'ConcertOne-Regular',
        fontSize:17,
        lineHeight: 25,
        alignSelf:'center',
        marginBottom:5,
        marginLeft:10,
        marginRight:10,
    },
    commentContainer: {
        backgroundColor:colors.main,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    }
});