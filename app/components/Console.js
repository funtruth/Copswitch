import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import { CustomButton } from './CustomButton';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Console extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        ready: null,
        loading: null,

        listSize: new Animated.Value(2),
        listOpacity: new Animated.Value(0),

        optionSize: new Animated.Value(2),
        optionOpacity: new Animated.Value(0),
        optionDisabled: true,
        
        backSize: new Animated.Value(2),
        backOpacity: new Animated.Value(0),
        backDisabled: true,

        size: new Animated.Value(2),
        opacity: new Animated.Value(0),

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
    Animated.sequence([
        Animated.parallel([
            Animated.timing(
                this.state.opacity, {
                    duration: FADEIN_ANIM,
                    toValue: 0
            }),
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
                this.state.listSize, {
                    duration: FADEIN_ANIM,
                    toValue: 2
            }),
            Animated.timing(
                this.state.optionSize, {
                    duration: FADEIN_ANIM,
                    toValue: 2
            }),
            Animated.timing(
                this.state.backSize, {
                    duration: FADEIN_ANIM,
                    toValue: 2
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.listSize, {
                    duration: FADEIN_ANIM,
                    toValue: list?this.height*0.5:2
            }),
            Animated.timing(
                this.state.size, {
                    duration: FADEIN_ANIM,
                    toValue: list?this.height*0.75:this.height*0.22
            }),
            Animated.timing(
                this.state.optionSize, {
                    duration: FADEIN_ANIM,
                    toValue: option?this.height*0.1:2
            }),
            Animated.timing(
                this.state.backSize, {
                    duration: FADEIN_ANIM,
                    toValue: back?this.height*0.1:2
            })
        ]),
        Animated.parallel([
            Animated.timing(
                this.state.opacity, {
                    duration: FADEIN_ANIM,
                    toValue: 1
            }),
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
        this.setState({ready:newProps.ready, loading:newProps.loading})
        if(newProps.loading){
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
                
            <View style = {{justifyContent:'center', alignItems:'center'}}>
                <Text style = {{
                    fontSize:30,
                    fontFamily:'LuckiestGuy-Regular',
                    color:colors.font
                }}>{this.props.title}</Text>
                <Text style = {{
                    fontSize:20,
                    fontFamily:'LuckiestGuy-Regular',
                    color:colors.striker
                }}>{this.props.subtitle}</Text>
            </View>

            <Animated.View style = {{height:this.state.listSize, opacity:this.state.listOpacity, 
                justifyContent:'center', alignItems:'center'}}>
                {this.props.list}
            </Animated.View>

            <Animated.View style = {{height:this.state.optionSize, opacity:this.state.optionOpacity, 
                flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <View style = {{flex:0.4}}><CustomButton
                    size = {0.7}
                    flex = {1}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.shadow}
                    onPress = {()=> this.optionOne() }
                    disabled = {this.state.optionDisabled}
                    title = {this.props.okay}
                /></View>
                <View style = {{flex:0.05}}/>
                <View style = {{flex:0.4}}><CustomButton
                    size = {0.7}
                    flex = {1}
                    depth = {0}
                    radius = {15}
                    fontSize = {20}
                    color = {colors.background}
                    shadow = {colors.background}
                    onPress = {()=>this.props.onTwo()}
                    disabled = {this.state.optionDisabled}
                    title = {this.props.cancel}
                /></View>
            </Animated.View>

            <Animated.View style = {{height:this.state.backSize, opacity:this.state.backOpacity, 
                justifyContent:'center', alignItems:'center'}}>
                <CustomButton
                    size = {0.7}
                    flex = {0.4}
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
