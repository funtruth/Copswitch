import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
}   from 'react-native';
import { connect } from 'react-redux';
import { changeSection } from './HomeReducer';

import { Alert } from '../components/Alert.js';
import { Button } from '../components/Button.js';
import RuleBook from '../menu/ListNavigator';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Join from './JoinRoomComponent';
import Create from './CreateRoomComponent'

import colors from '../misc/colors.js';
import firebaseService from '../firebase/firebaseService.js';

class BasicHomeScreen extends Component {

    constructor(props) {
        super(props);

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;

    }

    _renderChoice(){
        return <View style = {{ alignItems:'center' }}>
        
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = { () => this.props.changeSection('join') }>
                <MaterialCommunityIcons name='human-greeting'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Join a Room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = { () => this.props.changeSection('create') }>
                <FontAwesome name='edit'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Create a Room</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> firebaseService.joinPlayerList() }>
                <FontAwesome name='question-circle'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    About the App</Text>
            </TouchableOpacity>

        </View>
    }

    render() {

        return <View style = {{flex:1}}>

            <View style = {{flex:1, justifyContent:'center'}}>
                <Alert visible = {this.props.section=='join'} flex = {0.3}>
                    <Join {...this.props}/>
                </Alert>

                <Alert justify visible = {this.props.section=='create'} flex = {0.3}>
                    <Create {...this.props}/>
                </Alert>
            </View>

            {this._renderChoice()}

        </View>
    }
}

export default connect(
    state => ({
        section: state.home.section
    }),
    dispatch => {
        return {
            changeSection: () => dispatch(changeSection())  
        } 
    }
)(BasicHomeScreen)