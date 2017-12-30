import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';
import Rolesheet from '../misc/roles.json';

export class Desc extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        opacity: new Animated.Value(1),
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

_cancel() {
    Animated.timing(
        this.state.opacity,{
            toValue:0,
            duration:200
        }
    ).start()

    setTimeout(()=>{
        this.props.onCancel()
        Animated.timing(
            this.state.opacity,{
                toValue:1,
                duration:50
            }
        ).start()
    },250)
}

render() {

    if(!this.props.visible){
        return null
    }

    return ( 
        <View>
            <View style = {{height:this.height*0.25, position:'absolute', left:25, right:25, bottom:this.props.marginBottom, 
                backgroundColor:colors.shadow, borderRadius:5, flexDirection:'row', justifyContent:'center'}}>
                <View style = {{flex:0.75, marginTop:5}}>
                    <Text style = {styles.lfont}>{Rolesheet[this.props.roleid].name}</Text>
                    <Text style = {styles.descFont}>{Rolesheet[this.props.roleid].rules}</Text>
                </View>
            </View>

            <TouchableOpacity style = {{position:'absolute', right:22, bottom:this.props.marginBottom + this.height*0.21,
                backgroundColor:colors.close,width:30,height:30,borderRadius:15,
                justifyContent:'center', alignItems:'center'}}
                activeOpacity = {0.8}
                onPress = {this.props.onClose}
            >
                <MaterialCommunityIcons name='close-circle'
                        style={{color:colors.font, fontSize:26}}/>
            </TouchableOpacity>

            <View style = {{margin:2}}/>

            <TouchableOpacity style = {{position:'absolute', left:15, bottom:this.props.marginBottom + 10,
                backgroundColor:colors.menubtn,width:50,height:50,borderRadius:25,
                justifyContent:'center', alignItems:'center'}}
                activeOpacity = {0.8}
                onPress = {this.props.onPressLeft}
            >
                <MaterialCommunityIcons name='chevron-left'
                        style={{color:colors.font, fontSize:26}}/>
            </TouchableOpacity>

            <TouchableOpacity style = {{position:'absolute', right:15, bottom:this.props.marginBottom + 10,
                backgroundColor:colors.menubtn,width:50,height:50,borderRadius:25,
                justifyContent:'center', alignItems:'center'}}
                activeOpacity = {0.8}
                onPress = {this.props.onPressRight}
            >
                <MaterialCommunityIcons name='chevron-right'
                        style={{color:colors.font, fontSize:26}}/>
            </TouchableOpacity>
            
            {this.props.optionOneName && this.props.optionTwoName?
            <View style = {{
                position:'absolute', bottom:this.props.marginBottom - 8, left:0, right:0, height:50,
                alignItems:'center', justifyContent:'center', flexDirection:'row'
            }}>
                <TouchableOpacity style = {{ borderBottomLeftRadius:30, borderTopLeftRadius:30,
                    backgroundColor:colors.menubtn,width:this.width*0.25,height:50,
                    justifyContent:'center', alignItems:'center'}}
                    activeOpacity = {0.8}
                    onPress = {this.props.optionOnePress}
                >
                    <Text style = {styles.lfont}>{this.props.optionOneName}</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {{ borderBottomRightRadius:30, borderTopRightRadius:30,
                    backgroundColor:colors.menubtn,width:this.width*0.25,height:50,
                    justifyContent:'center', alignItems:'center'}}
                    activeOpacity = {0.8}
                    onPress = {this.props.optionTwoPress}
                >
                    <Text style = {styles.lfont}>{this.props.optionTwoName}</Text>
                </TouchableOpacity>
            </View>
            :null}
        </View>
    )
}
}
