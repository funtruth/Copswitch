import React, { Component } from 'react';
import { 
    View,
    Text,
    Animated,
    Dimensions,
    ScrollView,
    TouchableOpacity } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

import { Slide } from '../parents/Slide.js';
import Rolesheet from '../misc/roles.json';

export class Desc extends React.Component {
        
    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        
    }


    render() {

        return ( 
            <ScrollView
                showsVerticalScrollIndicator = {false}
                style = {{width:this.width*0.7, backgroundColor:colors.background}}>
                <Text style = {styles.lfont}>CHARACTER:</Text>
                <Text style = {styles.title}>{Rolesheet[this.props.roleid].name}</Text>
                <Text style = {styles.lfont}>DURING THE NIGHT:</Text>
                <Text style = {styles.roleDesc}>{Rolesheet[this.props.roleid].rules}</Text>
                <Text style = {styles.lfont}>WIN CONDITION:</Text>
                <Text style = {styles.roleDesc}>{Rolesheet[this.props.roleid].win}</Text>

            </ScrollView>
        )
    }
}
