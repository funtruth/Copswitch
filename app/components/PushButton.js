import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Animated, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';

export class PushButton extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        margin: 10
    }
}
      
_handlePressIn(){
    this.setState({margin:6})
}

_handlePressOut(){
    this.setState({margin:10})
}

render() {

    return (
        <Animated.View style = {{
            flex:this.props.size, 
            opacity:this.props.opacity,
            borderRadius:this.props.radius,
        }}>
            <View style = {{
                flex:1, 
                justifyContent:'center',
                backgroundColor:colors.shadow, 
                borderRadius:this.props.radius,
                marginTop:this.state.margin==10?0:4
            }}>
                <TouchableOpacity style = {{
                    flex:1, 
                    justifyContent:'center',
                    backgroundColor:this.props.color, 
                    marginBottom:this.state.margin, 
                    borderRadius:this.props.radius}}
                    onPress = {this.props.onPress}
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
