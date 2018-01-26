import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';

export class OptionButton extends React.Component {

/*
This button is specifically designed for more customization

USED IN:
HOME SCREEN wifi button
*/

constructor(props) {
    super(props);

    this.width = Dimensions.get('window').width;
}
      
_handlePressIn(){
    this.setState({margin:this.props.depth/2})
}

_handlePressOut(){
    this.setState({margin:this.props.depth})
}

render() {

    return ( <View style = {{flex:1, width:this.width*0.22}}>
                <TouchableOpacity style = {{
                        position:'absolute', left:10, right:0, top:0, bottom:10, borderRadius:5,
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:this.props.backgroundColor,
                        borderRadius:5 }}
                    onPress = {this.props.onPress}
                    onLongPress = {this.props.onLongPress}
                    onPressIn = {()=>{
                        this._handlePressIn()
                    }}
                    onPressOut = {()=>{
                        this._handlePressOut()
                    }}
                    activeOpacity = {0.6}
                    disabled = {this.props.disabled}
                >
                    <MaterialCommunityIcons name={this.props.icon} style={{color:colors.font, fontSize:26}}/>
                    <Text style = {{
                        fontSize:16,
                        fontFamily:'LuckiestGuy-Regular',
                        color:colors.font,
                        alignSelf: 'center',
                    }}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>
    )
}
}
