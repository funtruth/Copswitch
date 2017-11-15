
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    BackHandler,
    AsyncStorage,
    StyleSheet,
    Keyboard,
    FlatList,
    SectionList,
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
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

class General_Screen extends Component {
    
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    _logOut() {
        if(firebase.auth().currentUser.isAnonymous){
            onSignOut().then(() => { firebase.auth().currentUser.delete() })
            this.props.navigation.navigate('SignedOut');
        } else {
            onSignOut().then(() => { firebase.auth().signOut() }) 
            this.props.navigation.navigate('SignedOut');
        }
    }

    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        firebase.database().ref('messages').child(firebase.auth().currentUser.uid).remove();
        firebase.database().ref('listofroles').child(firebase.auth().currentUser.uid).remove();

        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'SignedIn'})
                ]
            })
        )
    }
    
    _exitRoom() {
        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid).remove();
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'SignedIn'})
                ]
            })
        )
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Characters'
                onPress = {()=>{ this.props.navigation.navigate('Roles_Screen') }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'How to Play'
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
                title = 'Setup'
                onPress = {()=>{ }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Tutorial'
                onPress = {()=>{  }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Leave Room'
                onPress = {()=>{ this._exitRoom() }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Quit Game'
                onPress = {()=>{ this._deleteRoom() }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Log Out'
                onPress = {()=>{ this._logOut() }}
            />
        </View>
    }
}

class Roles_Screen extends Component {

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
            ownermode:  false,

            showfilter:  false,
            showtown:    false,
            showmafia:   false,
            showneutral: false,
        }

        this.listOfRoles = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
        
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
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
                    image:          Rolesheet[key].image,
                    color:          Rolesheet[key].color,
                    key:            key,
                })
            } else {
                neutrallist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    category:       Rolesheet[key].category,
                    count:          0,
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

        this.listOfRoles.on('value',snap=>{
            if(snap.exists()){
                var mafialist = this.state.mafialist;
                var townlist = this.state.townlist;
                var neutrallist = this.state.neutrallist;
                snap.forEach((child)=>{
                    if(Rolesheet[child.key].type == 1){
                        mafialist[Rolesheet[child.key].index]['count'] = child.val()
                    } else if (Rolesheet[child.key].type == 2) {
                        townlist[Rolesheet[child.key].index]['count'] = child.val()
                    } else {
                        neutrallist[Rolesheet[child.key].index]['count'] = child.val()
                    }
                })
                this.setState({
                    ownermode:true,
                    mafialist:mafialist,
                    townlist:townlist,
                    neutrallist:neutrallist
                })
            } else {
                this.setState({ownermode:false})
            }
        })

    }

    componentWillUnmount(){
        if(this.listOfRoles){
            this.listOfRoles.off();
        }
    }

    _roleBtnPress(key,index,count) {
        if(this.state.ownermode){
            if(count>0){
                firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                + '/' + key).transaction((count)=>{
                    return count - 1;
                })
            } else {
                firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                + '/' + key).transaction((count)=>{
                    return count + 1;
                })
            }
        } else {
            this.setState({roleid:key, modalVisible:true})
        }
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
        return <View style = {{flex:1, backgroundColor:colors.main}}>

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
                    fontSize: 25, color: colors.main,
                    marginTop:5, marginBottom:3}}>Filters</Text>
            </TouchableOpacity>

            {!this.state.showfilter? null: <View style = {{flex:0.2}}><FlatList
                data={this.state.townlist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:item.count?colors.immune:colors.main,flex:0.33,
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
                    fontSize: 25, color: colors.main,
                    marginTop:5, marginBottom:3}}>Town</Text>
            </TouchableOpacity>

            {!this.state.showtown? null: <View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.townlist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index,item.count)  
                        }}
                        style = {{backgroundColor:item.count?colors.immune:colors.main,flex:0.33,
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
                    fontSize: 25, color: colors.main,
                    marginTop:5, marginBottom:5}}>Mafia</Text>
            </TouchableOpacity>

            {!this.state.showmafia?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.mafialist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index,item.count)  
                        }}
                        style = {{backgroundColor:item.count?colors.immune:colors.main,flex:0.33,
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
                    fontSize: 25, color: colors.main,
                    marginTop:5, marginBottom:5}}>Neutral</Text>
            </TouchableOpacity>

            {!this.state.showneutral?null:<View style = {{flex:this.state.showfilter?0.5:0.7}}><FlatList
                data={this.state.neutrallist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index,item.count)  
                        }}
                        style = {{backgroundColor:item.count?colors.immune:colors.main,flex:0.33,
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


export default RuleBook = StackNavigator(
    {
      General_Screen: {
        screen: General_Screen,
      },
      Roles_Screen: {
        screen: Roles_Screen,
      },
    },
    {
      initialRouteName: 'General_Screen',
      headerMode: 'screen',
    }
  );

  const styles = StyleSheet.create({
    normalFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 18,
        color: colors.font,
    },
    titleFont: {
        fontFamily:'ConcertOne-Regular',
        fontSize: 25,
        color: colors.font,
    },
});