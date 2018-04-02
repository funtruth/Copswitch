import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';
import { Message } from '..//parents/Message.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class General extends React.Component {
    
constructor(props) {
    super(props);
}

_renderItem(item){
    if(item.type == 1){
        return <Message style = {styles.sectionContainer}>
            <Text style = {styles.section}>{item.message}</Text>
        </Message>
    } else {
        return <Message style = {styles.messageContainer}>
            <Text style = {styles.message}>{item.message}</Text>
        </Message>
    }
}

render() {
 
    return (
        <View style = {{flex:0.55}}>
            <FlatList
                data={this.props.data}
                renderItem={({item}) => (this._renderItem(item))}
                inverted
                initialNumToRender={12}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.index}
            />
        </View>
    )
}
}
