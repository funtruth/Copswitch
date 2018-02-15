import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Rolecard extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        opacity: new Animated.Value(0),

        role: 'A',
        rules:'',
        win:'',

    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    this.animate()
}

animate(){
    Animated.timing(
        this.state.opacity, {
            toValue:1,
            duration:150
        }
    ).start()
}

render() {

    return (
        <Animated.View style = {{ 
            justifyContent:'center',
            opacity: this.state.opacity,
            transform: [{
                translateX: this.state.opacity.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, this.height*0.03, this.height*0.05],
                })
            }],
            width: this.width*0.7
        }}>
            <Text style = {styles.lfont}>YOU ARE A:</Text>
            <Text style = {styles.title}>{Rolesheet[this.props.roleid].name}</Text>
            <Text style = {styles.lfont}>AT NIGHT YOU:</Text>
            <Text style = {styles.roleDesc}>{Rolesheet[this.props.roleid].rules}</Text>
            <Text style = {styles.lfont}>you win when:</Text>
            <Text style = {styles.roleDesc}>{Rolesheet[this.props.roleid].win}</Text>
            {this.props.amimafia?<View>
                <Text style = {styles.lfont}>YOUR TEAMMATES:</Text>
                <FlatList
                    data={this.props.mafialist}
                    renderItem={({item}) => (
                        <Text style={[styles.roleDesc,{textDecorationLine:item.dead?'line-through':'none'}]}>
                            {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                    )}
                    keyExtractor={item => item.key}
                /></View>:null}
        </Animated.View>
    )
}
}
