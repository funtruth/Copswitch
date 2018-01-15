import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';
import Rolesheet from '../misc/roles.json';


const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Desc extends React.Component {
    
constructor(props) {
    super(props);

    this.opacity = new Animated.Value(0);
    this.detailOpacity = new Animated.Value(0);
    this.descWidth = new Animated.Value(60);

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentWillReceiveProps(nextProps) {
    if(nextProps.visible){
        this._show()
    }
}

_hide(){
    Animated.sequence([
        Animated.timing(
            this.detailOpacity,{
                toValue:0,
                duration:FAST_ANIM
            }
        ),
        Animated.timing(
            this.descWidth,{
                toValue:60,
                duration:MED_ANIM
            }
        ),
        Animated.timing(
            this.opacity,{
                toValue:0,
                duration:FAST_ANIM
            }
        )
    ]).start()

    setTimeout(()=>{
        this.props.onClose(false)
    },FAST_ANIM*2 + MED_ANIM)
}
_show() {
    Animated.sequence([
        Animated.timing(
            this.opacity,{
                toValue:1,
                duration:FAST_ANIM
            }
        ),
        Animated.timing(
            this.descWidth,{
                toValue:this.width - 20,
                duration:MED_ANIM
            }
        ),
        Animated.timing(
            this.detailOpacity,{
                toValue:1,
                duration:FAST_ANIM
            }
        )
    ]).start()
}


render() {

    if(!this.props.visible){
        return null
    }

    return ( 
        <Animatable.View ref='continue' animation={{
            0: {marginBottom:0},
            0.25:{marginBottom:3},
            0.5:{marginBottom:6},
            0.75:{marginBottom:3},
            1:{marginBottom:0},
        }}
        iterationCount="infinite" duration={2000}>
        <Animated.View style = {{height:this.height*0.25 + 35, width:this.width, opacity:this.opacity,
            position:'absolute', left:0, right:0, bottom:this.props.marginBottom, 
            borderRadius:5, flexDirection:'row', justifyContent:'center'}}>

            <Animated.View style = {{height:this.height*0.25, width:this.descWidth, marginTop:35,
                backgroundColor:colors.shadow, borderRadius:5, flexDirection:'row', justifyContent:'center'}}>

                <Animated.View style = {{flex:0.75, marginTop:5, opacity:this.detailOpacity}}>
                    <Text style = {styles.lfont}>{Rolesheet[this.props.roleid].name}</Text>
                    <Text style = {styles.descFont}>{Rolesheet[this.props.roleid].rules}</Text>
                </Animated.View>

            </Animated.View>

            <TouchableOpacity style = {{position:'absolute', right:10, top:0,
                backgroundColor:colors.close,width:30,height:30,borderRadius:15,
                justifyContent:'center', alignItems:'center'}}
                activeOpacity = {1}
                onPress = {()=>{this._hide()}}
            >
                <MaterialCommunityIcons name='close-circle'
                        style={{color:colors.font, fontSize:26}}/>
            </TouchableOpacity>
            
            {this.props.optionOneName && this.props.optionTwoName?
            <Animated.View style = {{
                position:'absolute', bottom:5, left:0, right:0, height:40,
                alignItems:'center', justifyContent:'center', flexDirection:'row', opacity:this.detailOpacity
            }}>
                <TouchableOpacity style = {{ borderBottomLeftRadius:30, borderTopLeftRadius:30,
                    backgroundColor:colors.menubtn,width:this.width*0.15,height:40,
                    justifyContent:'center', alignItems:'center'}}
                    activeOpacity = {0.5}
                    onPress = {this.props.optionOnePress}
                >
                    <Text style = {styles.lfont}>{this.props.optionOneName}</Text>
                </TouchableOpacity>

                <View style = {{backgroundColor:'white', width:this.width*0.15, height:40,
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.dfont}>
                        {this.props.count}</Text>
                </View>

                <TouchableOpacity style = {{ borderBottomRightRadius:30, borderTopRightRadius:30,
                    backgroundColor:colors.menubtn,width:this.width*0.15,height:40,
                    justifyContent:'center', alignItems:'center'}}
                    activeOpacity = {0.5}
                    onPress = {this.props.optionTwoPress}
                >
                    <Text style = {styles.lfont}>{this.props.optionTwoName}</Text>
                </TouchableOpacity>
            </Animated.View>
            :null}
        </Animated.View>
        </Animatable.View>
    )
}
}
