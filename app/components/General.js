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

export class General extends React.Component {
    
constructor(props) {
    super(props);


    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}



_xenderItem(item){
    return <Animated.View style = {{ marginTop:5, opacity:this.opacity[item.index], width:this.width*0.76,
        transform: [{
            translateX: this.opacity[item.index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, this.height*0.03, this.height*0.05],
            }),
        }] }}>
        <Text style = {styles.message}>{item.index}</Text>
    </Animated.View>
}

_renderItem(item){
    return <View style = {item.type==1?styles.sectionContainer:styles.messageContainer}>
        <Text style = {item.type==1?styles.section:styles.message}>{item.message}</Text>
    </View>
}

render() {
 
    return (
        <FlatList
            data={this.props.data}
            renderItem={({item}) => (this._renderItem(item))}
            contentContainerStyle={{
                alignSelf:'center',
                width:this.width*0.7
            }}
            initialNumToRender={12}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.index}
        />
    )
}
}
