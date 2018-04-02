import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';
import { Message } from '..//parents/Message.js';
import { Button } from './Button.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Private extends React.Component {
    
constructor(props) {
    super(props);
}

render() {
 
    return (
        <View style = {{flex:0.25, justifyContent:'center'}}>
            
            <Button
                horizontal = {0.4}
                margin = {10}
                backgroundColor = {colors.dead}
            ><Text style = {styles.choiceButton}>Private</Text>
            </Button>
            
        </View>
    )
}
}
