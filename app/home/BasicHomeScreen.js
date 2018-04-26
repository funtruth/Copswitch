
import React, { Component } from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    Keyboard,
    Animated,
    Dimensions,
    TouchableOpacity,
    TextInput
}   from 'react-native';

import { Alert } from '../components/Alert.js';
import { Button } from '../components/Button.js';
import { RuleBook } from '../screens/ListsScreen.js';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Join from './JoinRoomComponent';
import Create from './CreateRoomComponent'

import { Slide } from '../parents/Slide.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

class BasicHomeScreen extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            section: null,
            about: false,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;

    }

    _renderMenu(){
        return <TouchableOpacity style = {{
            opacity:0.5,
            flexDirection:'row', alignItems:'center',
            position:'absolute', top:20, left:20}}
            onPress = {()=> {} }>
            <FontAwesome name='gears'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>Options</Text>
        </TouchableOpacity>
    }

    _renderChoice(){
        return <View style = {{ alignItems:'center' }}>
        
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> this.setState({section:'join'}) }>
                <MaterialCommunityIcons name='human-greeting'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Join a Room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> this.setState({section:'create'}) }>
                <FontAwesome name='edit'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Create a Room</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> {} }>
                <FontAwesome name='book'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    How to Play</Text>
            </TouchableOpacity>

        </View>
    }

    _renderAbout(){
        return <TouchableOpacity style = {{
            opacity:0.3,
            flexDirection:'row', alignItems:'center',
            position:'absolute', bottom:20, left:20}}
            onPress = {()=> {} }>
            <FontAwesome name='question-circle'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>About the App</Text>
        </TouchableOpacity>
    }

    render() {

        return <View style = {{flex:1}}>

            <View style = {{flex:1, justifyContent:'center'}}>
                <Alert visible = {this.state.section=='join'} flex = {0.3}>
                    <Join {...this.props.screenProps}/>
                </Alert>

                <Alert justify visible = {this.state.section=='create'} flex = {0.3}>
                    <Create {...this.props.screenProps}/>
                </Alert>
            </View>

            <Alert flex = {0.5} visible = {this.state.section == 'menu'}>
                <RuleBook screenProps = {{ quit:false }}/>
            </Alert>

            {this._renderMenu()}

            {this._renderChoice()}


        </View>
    }
}

export default BasicHomeScreen