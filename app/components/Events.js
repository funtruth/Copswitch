import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 500;
const FADEIN_ANIM = 600;

const MARGIN = 10;

export class Events extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        role: 'A',
        rules:'',
        win:'',
    }

    this.list = this.props.msglist

    this.opacity = []
    for(i=0;i<this.list.length;i++){
        this.list[i].index = i
        this.opacity[i] = new Animated.Value(0)
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    this.animate()
}

animate () {
    const animations = this.list.map((item) => {
        return Animated.timing(
        this.opacity[item.index],
            {
                toValue: 1,
                duration: 150
            }
        )
    })
    Animated.stagger(80, animations).start()
}

_renderItem(item){
    return <Animated.View style = {{ marginTop:5, opacity:this.opacity[item.index] }}>
        <Text style = {styles.message}>{item.message}</Text>
    </Animated.View>
}

render() {

    return (
        <FlatList
            data={this.list}
            renderItem={({item}) => (this._renderItem(item))}
            initialNumToRender={12}
            inverted
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.key}
        />
    )
}
}
