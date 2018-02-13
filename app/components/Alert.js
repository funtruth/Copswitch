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

_show(view) {
    Animated.timing(
        this.opacity,{
            toValue:view?1:0,
            duration:300
        }
    ).start()
}

componentWillReceiveProps(newProps){
    if(newProps.visible?!this.props.visible:this.props.visible){
        this._show(newProps.visible)
    }
}

render() {

    if(this.props.unmount && !this.props.visible){
        return null
    }

    return ( 
        <Animated.View style = {{
            justifyContent:'center',
            opacity:this.opacity,
            height:this.opacity.interpolate({
                inputRange:[0,1],
                outputRange:[0,this.height*this.props.flex]
            }),
            width:this.width
            }}>
            {this.props.children}
        </Animated.View>
    )
}
}
