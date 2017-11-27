import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Animated, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';

export class PushButton extends React.Component {

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
        }}>
            <View style = {{
                flex:0.85,
                justifyContent:'center',
                backgroundColor:colors.shadow, 
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
                    activeOpacity = {0.6}
                    disabled = {this.props.disabled}>
                    {this.props.component}
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}
}
