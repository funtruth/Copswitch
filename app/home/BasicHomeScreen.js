import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native';
import { connect } from 'react-redux';
import { changeSection } from './HomeReducer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Join from './JoinRoomComponent';
import Create from './CreateRoomComponent'

import colors from '../misc/colors.js';

class BasicHomeScreen extends Component {

    constructor(props){
        super(props)
    }

    _renderSectionButton(section, icon, title, subtitle){
        return (
            <TouchableOpacity 
                style = {styles.container} 
                onPress = {() => this.props.changeSection(section)}
                activeOpacity = {0.9}
            >
                <View style = {{ margin: 10 }}>
                    <View style = {styles.titleContainer}>
                        <FontAwesome name = {icon} style = {styles.iconStyle} />
                        <Text style = {styles.titleStyle}>{title}</Text>
                    </View>
                    {this._renderSection(section)}
                    <Text style = {styles.subtitleStyle}>{subtitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderSection(section){
        if ( section === 'join' ) {
            return <Join {...this.props}/>
        } else {
            return <Create {...this.props}/>
        }
    }

    render() {
        return( 
            <View style = {{flex:1, justifyContent:'center'}}>
                {this._renderSectionButton('join', 'star', 'Join', 'Ask the room owner for the code!')}
                {this._renderSectionButton('create', 'edit', 'Create', 'Customize your own room!')}
                <View style = {{ flex:0.2 }} />
            </View>
        )
    }
}

const styles = {
    container:{
        justifyContent:'center',
        margin:2,
        backgroundColor:'white',
        borderRadius: 2,
        elevation:2
    },
    iconStyle:{
        fontSize: 25
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:5
    },
    titleStyle:{
        fontSize:20,
        fontFamily: 'FredokaOne-Regular'
    },
    subtitleStyle:{
        fontSize:16,
        alignSelf:'center'
    }
}

export default connect(
    state => ({
        section: state.home.section
    }),
    dispatch => {
        return {
            changeSection: (payload) => dispatch(changeSection(payload))  
        } 
    }
)(BasicHomeScreen)