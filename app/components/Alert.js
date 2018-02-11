import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class Alert extends React.Component {

    
constructor(props) {
    super(props);

    this.opacity = new Animated.Value(0);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_cancel() {
    Animated.timing(
        this.opacity,{
            toValue:0,
            duration:200
        }
    ).start()
}

_show() {
    Animated.timing(
        this.opacity,{
            toValue:1,
            duration:300
        }
    ).start()
}

componentWillReceiveProps(newProps){
    if(newProps.visible){
        this._show()
    }
}

render() {

    if(!this.props.visible){
        return null
    }

    return ( 
        <Animated.View style = {{position:'absolute', top:0, bottom:0, left:0, right:0,
            backgroundColor:'rgba(0, 0, 0, 0.3)', opacity:this.opacity,
            justifyContent:'center', alignItems:'center'}}>
            {this.props.children}
        </Animated.View>
    )
}
}
