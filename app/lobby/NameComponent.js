
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

import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';


class NameComponent extends Component {
    
    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height
    }

    componentWillReceiveProps(newProps){

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
                maxLength={10}
                style={[styles.nameInput,{width:this.width*0.4}]}
                onSubmitEditing = {(event)=>{
                    this.props.name(event.nativeEvent.text.trim());
                }}
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