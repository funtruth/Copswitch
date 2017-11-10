
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

    _goToRules(type) {
        this.props.navigation.navigate('Roles_Screen',{type:type})
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center', alignItems:'center'}}>
            <View style = {{justifyContent:'center',flex:0.1}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',fontSize:30,color:colors.main,
                    alignSelf:'center'}}>Roles
                </Text>
            </View>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Town'
                onPress = {()=>{ this._goToRules(2)}}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Mafia'
                onPress = {()=>{ this._goToRules(1)}}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Neutral'
                onPress = {()=>{ this._goToRules(3)}}
            />
            <View style = {{flex:0.02}}/>
            <View style = {{justifyContent:'center',flex:0.08}}>
                <Text style = {{
                    fontFamily:'ConcertOne-Regular',fontSize:30,color:colors.main,
                    alignSelf:'center'}}>How-to-Play
                </Text>
            </View>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Rules'
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
                onPress = {()=>{ }}
            />
            <View style = {{flex:0.06}}/>
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
            rolelist: [],
            roleid:   'a',
            modalVisible: false,
            ownermode:  false,
        }

        this.listOfRoles = firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid);
        
    }


    componentWillMount() {

        const { params } = this.props.navigation.state;
        const type = params.type;

        var keys = Object.keys(Rolesheet).sort()
        var rolelist = [];
        keys.forEach(function(key){
            if(Rolesheet[key].type == type){
                rolelist.push({
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
        this.setState({rolelist:rolelist})

        this.listOfRoles.on('value',snap=>{
            if(snap.exists()){
                var array = this.state.rolelist;
                snap.forEach((child)=>{
                    if(Rolesheet[child.key].type == type){
                        array[Rolesheet[child.key].index]['count'] = child.val()
                    }
                })
                this.setState({ownermode:true,rolelist:array})
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

    _roleBtnPress(key,index) {
        if(this.state.ownermode){
            firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
            + '/' + key).transaction((count)=>{
                return count + 1;
            })
        } else {
            this.setState({roleid:key, modalVisible:true})
        }
    }

    _deleteRole(key,index){
        firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
        + '/' + key).transaction((count)=>{
                return count - 1;
        })
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
                                <View style = {{backgroundColor:colors.main,flex:0.9,borderRadius:60}}>
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

            <View><FlatList
                data={this.state.rolelist}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress = {()=>{
                            this._roleBtnPress(item.key,item.index)  
                        }}
                        style = {{backgroundColor:item.count?colors.immune:colors.main,flex:0.5,
                            borderRadius:10, margin:5, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity
                            style = {{flexDirection:'row'}}
                            onPress={()=> {
                                {this._deleteRole(item.key,item.index)}
                            }}
                            disabled = {!item.count}>
                            <Text style = {{
                                fontFamily:'ConcertOne-Regular', fontSize: 20, 
                                color: colors.font, marginTop:3, marginLeft:3
                            }}>{item.count?item.count:null}</Text>
                            <View style = {{flex:0.85}}/>
                            <MaterialCommunityIcons name='close-circle' 
                                style={{color:item.count?colors.font:colors.disabled, 
                                    fontSize:25, marginTop:3}}/>
                        </TouchableOpacity>
                        <Image 
                            style={{width:100,height:100}}
                            source = {{uri:item.image}}
                        />
                        <Text style = {{
                            color:colors.font,
                            fontFamily: 'ConcertOne-Regular',
                            fontSize:20}}>{item.name}</Text>
                        <Text style = {{
                            color:colors.font,
                            fontFamily: 'ConcertOne-Regular',
                            fontSize:16,
                            marginBottom:10}}>{item.category}</Text>
                    </TouchableOpacity>
                )}
                style={{margin:5}}
                numColumns = {2}
                keyExtractor={item => item.key}
            /></View>
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