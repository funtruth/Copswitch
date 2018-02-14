import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

export class Button extends React.Component {

constructor(props) {
    super(props);

    this.state ={
        disabled:false,
        depth:6
    }

    
}
      
_handlePressIn(){
    this.setState({
        depth:3
    })
}

_handlePressOut(){
    this._buttonPress()
}

_buttonPress() {
    this.setState({
        disabled:true,
        depth:6
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
                marginTop:6-this.state.depth,
                flex:this.props.horizontal,
                backgroundColor: this.props.backgroundColor || colors.dead,
                borderRadius:15,
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
                    disabled = {this.props.disabled || this.state.disabled}>
                    {this.props.children}
                </TouchableOpacity>

                <View style = {{height:this.state.depth}}/>
            </View>
        </View>
    )
}
}
