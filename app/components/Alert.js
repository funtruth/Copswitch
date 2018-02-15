import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

export class Alert extends React.Component {

    
constructor(props) {
    super(props);

    this.nav = new Animated.Value(0);
    this.opacity = new Animated.Value(0);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_show(view) {
    Animated.timing(
        this.nav,{
            toValue:view?1:0,
            duration:500
        }
    ).start()
}

componentDidMount(){
    this._show(this.props.visible)
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
            opacity:this.nav.interpolate({
                inputRange:[0,0.7,1],
                outputRange:[0,0,1]
            }),
            height:this.nav.interpolate({
                inputRange:[0,0.7,1],
                outputRange:[0,this.height*this.props.flex,this.height*this.props.flex]
            }),
            width:this.width
            }}>
            {this.props.children}
        </Animated.View>
    )
}
}
