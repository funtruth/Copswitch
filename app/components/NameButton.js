import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Animated, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';

export class NameButton extends React.Component {

/*
This button is specifically designed to contain ICONS for each players
Name button. 
*/

constructor(props) {
    super(props);

    this.state = {
        margin: this.props.depth
    }
}
      
_handlePressIn(){
    this.setState({margin:this.props.depth/2})
}

_handlePressOut(){
    this.setState({margin:this.props.depth})
}

render() {

    return (
        <Animated.View style = {{
            flex:this.props.size,
            flexDirection:'row',
            justifyContent:'center',
            opacity:this.props.opacity,
            borderRadius:this.props.radius,
            marginBottom:10
        }}>
            <View style = {{
                flex:0.8,
                justifyContent:'center',
                backgroundColor:this.props.shadow, 
                borderRadius:this.props.radius,
                marginTop:this.state.margin==this.props.depth?0:this.props.depth/2
            }}>
                <TouchableOpacity style = {{
                    flex:1, 
                    justifyContent:'center',
                    backgroundColor:this.props.color, 
                    marginBottom:this.state.margin, 
                    borderRadius:this.props.radius}}
                    onPress = {this.props.onPress}
                    onLongPress = {this.props.onLongPress}
                    onPressIn = {()=>{
                        this._handlePressIn()
                    }}
                    onPressOut = {()=>{
                        this._handlePressOut()
                    }}
                    activeOpacity = {1}
                    disabled = {this.props.disabled}>
                    {this.props.component}
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}
}
