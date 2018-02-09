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

        listOpacity: new Animated.Value(0),

        optionOneOpacity: new Animated.Value(0),
        optionTwoOpacity: new Animated.Value(0),
        optionDisabled: true,
        
        backOpacity: new Animated.Value(0),
        backDisabled: true,

        size: new Animated.Value(2),
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_viewChange(list,optionOne,optionTwo,back) {
    this.setState({
        optionDisabled:back,
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
                this.state.optionOneOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: 0
            }),
            Animated.timing(
                this.state.optionTwoOpacity, {
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
                    toValue: list?this.height*0.76:this.height*0.15
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.listOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: list?1:0
            }),
            Animated.timing(
                this.state.optionOneOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: optionOne?1:0
            }),
            Animated.timing(
                this.state.optionTwoOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: optionTwo?1:0
            }),
            Animated.timing(
                this.state.backOpacity, {
                    duration: FADEIN_ANIM,
                    toValue: back?1:0
            })
        ])
    ]).start()
        
}

componentDidMount(){
    this._viewChange(false,true,true,false)
}

componentWillReceiveProps(newProps){

    if(!newProps.section && this.props.section){
        this._viewChange(true,false,true,false)
    } else if (newProps.section && !this.props.section) {
        this._viewChange(false,true,true,false)
    }

    if(newProps.ready != this.props.ready){
        if(newProps.ready == null){
            this._viewChange(false,false,false,false)
        } else if(newProps.ready){
            this._viewChange(false,false,false,true)
        } else  {
            this._viewChange(true,false,true,false)
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
    if(this.props.ready){
        this.props.onBack()
    } else {
        this._viewChange(true,false,true,false)
    }
}

render() {

    return ( 
        <Animated.View style = {{position:'absolute',bottom:this.height*0.13,height:this.state.size, width:this.width*0.87,
                backgroundColor:colors.background, borderRadius:10}}>
                
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

            <Animated.View style = {{
                flex:this.state.listOpacity.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.01, 0.4, 0.8],
                }), 
                opacity:this.state.listOpacity,
                top:this.height*0.07,
                justifyContent:'center', alignItems:'center'}}>
                {this.props.children}
            </Animated.View>

            <Animated.View style = {{
                position:'absolute', right:0, top:0, width:this.width*0.4,
                height:this.state.optionOneOpacity.interpolate({
                    inputRange: [0, 0.1, 1],
                    outputRange: [2, this.height*0.07, this.height*0.075],
                }), 
                opacity:this.state.optionOneOpacity, 
                justifyContent:'center', alignItems:'center'}}>
                <CustomButton
                    size = {0.8}
                    flex = {0.8}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.shadow}
                    onPress = {()=> this.optionOne() }
                    disabled = {this.state.optionDisabled}
                    title = {this.props.okay}
                />
            </Animated.View>

            <Animated.View style = {{
                position:'absolute', right:0, bottom:0, width:this.width*0.4,
                height:this.state.optionTwoOpacity.interpolate({
                    inputRange: [0, 0.1, 1],
                    outputRange: [2, this.height*0.07, this.height*0.075],
                }),  
                opacity:this.state.optionTwoOpacity, 
                justifyContent:'center', alignItems:'center'}}>
                <CustomButton
                    size = {0.8}
                    flex = {0.8}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.shadow}
                    onPress = {()=>this.optionTwo()}
                    disabled = {this.state.optionDisabled}
                    title = {this.props.cancel}
                />
            </Animated.View>

            <Animated.View style = {{
                position:'absolute', bottom:0, right:0, width:this.width*0.4,
                height:this.state.backOpacity.interpolate({
                    inputRange: [0, 0.1, 1],
                    outputRange: [2, this.height*0.07, this.height*0.075],
                }), 
                opacity:this.state.backOpacity, 
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
                    title = 'cancel'
                />
            </Animated.View>

        </Animated.View>
    )
}
}
