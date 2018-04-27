
import React, { Component } from 'react';
import {
    TextInput,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
}   from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import firebaseService from '../firebase/firebaseService.js';

import colors from '../misc/colors.js';

const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ';

class NameComponent extends Component {
    
    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height
    }

    componentWillReceiveProps(newProps){

    }

    checkName(name){

        if(!name || name.length > 12){
            //too long
        }

        firebaseService.updateUsername(name)
        
    }

    render() {
        return <View style = {{height:this.height*0.1,flexDirection:'row'}}>

            <View style = {{width:45}}/>

            <TextInput
                ref = 'alias'
                keyboardType='default'
                autoCapitalize='words'
                placeholder='Nickname'
                placeholderTextColor={colors.dead}
                maxLength={12}
                style={[styles.nameInput,{width:this.width*0.4}]}
                onSubmitEditing = { (event) => this.checkName(event.nativeEvent.text.trim()) }
            />

            <AnimatedOpacity
                style = {{alignItems:'center', justifyContent:'center', width:45}}
                onPress = {()=> this.refs.alias.focus() }>
                <FontAwesome name='pencil'
                    style={{color:colors.font, fontSize:30}}/>
            </AnimatedOpacity>

        </View>
    }
}

const styles = {
    nameInput: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 18,
        color:colors.font,
        textAlign:'center',
        justifyContent:'center',
    },
}

export default NameComponent