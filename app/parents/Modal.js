import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

export class Modal extends React.Component {

    
constructor(props) {
    super(props);

    this.state ={
        mount:false
    }

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

    setTimeout(()=>{
        this.setState({
            mount:view
        })
    },500)
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

    if(!this.state.mount && !this.props.visible){
        return null
    }

    return ( 
        <Animated.View style = {[{
            position:'absolute',
            justifyContent:'center',
            alignSelf:'center',
            height: this.props.flex*this.height,
            opacity:this.nav 
        }, this.props.style]}>
            {this.props.children}
        </Animated.View>
    )
}
}
