import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';

export class About extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        nav: new Animated.Value(0),
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_show(bool) {
    Animated.timing(
        this.state.nav,{
            toValue:bool?1:0,
            duration:200
        }
    ).start()
}

componentWillReceiveProps(newProps){
    if(newProps.visible?!this.props.visible:this.props.visible) this._show(newProps.visible)
}


render() {

    const { flex, children } = this.props

    return ( 
        <Animated.View style = {{
            backgroundColor:colors.shadow,
            borderRadius:15,
            borderWidth:1,
            borderColor:colors.font,
            opacity:this.state.nav.interpolate({
                inputRange:[0,1],
                outputRange:[0,1]
            }),
            height:this.state.nav.interpolate({
                inputRange:[0,1],
                outputRange:[this.height*0.1,this.height*flex]
            }),
            width:this.width*0.8,
            position:'absolute',
            bottom:15,
        }}>
            {children}
        </Animated.View>
    )
}
}
