import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

import colors from '../misc/colors.js';
import { CustomButton } from './CustomButton';

const FADEOUT_ANIM = 200;
const BLINK_ANIM = 50;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Console extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        ready: null,

        listFlex: new Animated.Value(0.01),
        listOpacity: new Animated.Value(0),

        optionSize: new Animated.Value(2),
        optionOpacity: new Animated.Value(0),
        optionDisabled: true,
        
        backSize: new Animated.Value(2),
        backOpacity: new Animated.Value(0),
        backDisabled: true,

        size: new Animated.Value(2),

        radiusScale: new Animated.Value(0.25)
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_viewChange(list,option,back) {
    this.setState({
        optionDisabled:!option,
        backDisabled:!back,
    })
    setTimeout(()=>{
        this.setState({
            viewList:list
        })
    },3000)
    Animated.sequence([
        Animated.parallel([
            Animated.timing(
                this.state.listOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.optionOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.backOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.size, {
                    duration: FADEIN_ANIM,
                    toValue: list?this.height*0.75:this.height*0.15
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.listFlex, {
                    duration: BLINK_ANIM,
                    toValue: list?0.8:0.01
            }),
            Animated.timing(
                this.state.optionSize, {
                    duration: BLINK_ANIM,
                    toValue: option?this.height*0.15:2
            }),
            Animated.timing(
                this.state.backSize, {
                    duration: BLINK_ANIM,
                    toValue: back?this.height*0.075:2
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.listOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: list?1:0
            }),
            Animated.timing(
                this.state.optionOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: option?1:0
            }),
            Animated.timing(
                this.state.backOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: back?1:0
            })
        ])
    ]).start()
        
}

componentWillReceiveProps(newProps){
    if(newProps.ready != this.state.ready){
        this.setState({ready:newProps.ready})
        if(newProps.ready == null){
            this._viewChange(false,false,false)
        } else if(newProps.ready){
            this._viewChange(false,false,true)
        } else  {
            this._viewChange(false,true,false)
        }
    }
}

optionOne(){
    if(this.props.phase == 1 || this.props.phase == 3){
        this._viewChange(true,false,true)
    } else {
        this.props.onOne()
    }
}

optionTwo(){
    this.props.onTwo()
}

optionBack(){
    if(this.state.ready){
        this.props.onBack()
    } else {
        this._viewChange(false,true,false)
    }
}

render() {

    return ( 
        <Animated.View style = {{position:'absolute',bottom:this.height*0.14,height:this.state.size, width:this.width*0.8,
                backgroundColor:colors.background, borderRadius:20, justifyContent:'center'}}>
                
            <View style = {{ 
                position:'absolute', top:0, left:0, height:this.height*0.1, width:this.width*0.4,
                alignItems:'center', justifyContent:'center', 
            }}>
                <Text style = {{
                    fontSize:30,
                    fontFamily:'LuckiestGuy-Regular',
                    color:colors.font
                }}>{this.props.title}</Text>
            </View>

            <Animated.View style = {{flex:this.state.listFlex, opacity:this.state.listOpacity,
                justifyContent:'center', alignItems:'center'}}>
                {this.props.children}
            </Animated.View>

            <Animated.View style = {{
                position:'absolute', right:0, top:0, width:this.width*0.4,
                height:this.state.optionSize, opacity:this.state.optionOpacity, 
                justifyContent:'center', alignItems:'center'}}>
                <CustomButton
                    size = {0.4}
                    flex = {0.8}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.shadow}
                    onPress = {()=> this.optionOne() }
                    disabled = {this.state.optionDisabled}
                    title = {this.props.okay}
                />
                <CustomButton
                    size = {0.4}
                    flex = {0.8}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.background}
                    shadow = {colors.background}
                    onPress = {()=>this.optionTwo()}
                    disabled = {this.state.optionDisabled}
                    title = {this.props.cancel}
                />
            </Animated.View>

            <Animated.View style = {{
                position:'absolute', bottom:0, right:0, width:this.width*0.4,
                height:this.state.backSize, opacity:this.state.backOpacity, 
                alignItems:'center'}}>
                <CustomButton
                    size = {0.8}
                    flex = {0.8}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.shadow}
                    onPress = {()=>this.optionBack()}
                    disabled = {this.state.backDisabled}
                    title = 'return'
                />
            </Animated.View>

        </Animated.View>
    )
}
}
