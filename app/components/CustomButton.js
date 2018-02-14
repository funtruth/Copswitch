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
        depth:4
    }

    
}
      
_handlePressIn(){
    this.setState({
        depth:2
    })
}

_handlePressOut(){
    this._buttonPress()
}

_buttonPress() {
    this.setState({
        disabled:true,
        depth:4
    })
    this.timer = setTimeout(() => this.setState({disabled: false}), 50);
}

componentWillUnmount(){
    if(this.timer){
        clearTimeout(this.timer)
    }
    
}

render() {

    return (
        <View style = {{
            flex:this.props.vertical,
            opacity:this.props.opacity,
            flexDirection:'row',
            justifyContent:'center',
            marginBottom:this.props.margin
        }}>
            <View style = {[{
                marginTop:4-this.state.depth,
                flex:this.props.horizontal,
                backgroundColor: this.props.backgroundColor || colors.dead,
                borderRadius:15
            },
                this.props.style
            ]}>
                <TouchableOpacity style = {[{
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor: this.props.color || colors.font, 
                    borderRadius:15,
                },
                    this.props.style
                ]}
                    onPress = {this.props.onPress}
                    onPressIn = {()=>{
                        this._handlePressIn()
                    }}
                    onPressOut = {()=>{
                        this._handlePressOut()
                    }}
                    activeOpacity = {1}
                    disabled = {this.state.disabled}>
                    {this.props.children}
                </TouchableOpacity>

                <View style = {{height:this.state.depth}}/>
            </View>
        </View>
    )
}
}
