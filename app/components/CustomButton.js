import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

export class CustomButton extends React.Component {

/*
This button is specifically designed for more customization

USED IN:
HOME SCREEN wifi button
*/


/*DEPRECATED: LOCATIONS

Alert
Console
Pager

ListsScreen
LobbyScreen

*/
constructor(props) {
    super(props);

    this.state ={
        disabled:false,
    }

    
}
      
_handlePressIn(){

}

_handlePressOut(){
    this._buttonPress()
}

_buttonPress() {
    this.setState({disabled:true})
    this.timer = setTimeout(() => this.setState({disabled: false}), 600);
}

componentWillUnmount(){
    if(this.timer){
        clearTimeout(this.timer)
    }
    
}

render() {

    return (
        <Animated.View style = {{
            flex:this.props.size,
            flexDirection:'row',
            justifyContent:'center',
            opacity:this.props.opacity
        }}>
            <TouchableOpacity style = {{
                flex:this.props.flex,
                justifyContent:'center',
                backgroundColor:this.props.backgroundColor, 
                borderRadius:5,
            }}
                onPress = {this.props.onPress}
                onPressIn = {()=>{
                    this._handlePressIn()
                }}
                onPressOut = {()=>{
                    this._handlePressOut()
                }}
                activeOpacity = {0.6}
                disabled = {this.state.disabled}>
                {this.props.children}
            </TouchableOpacity>
        </Animated.View>
    )
}
}
