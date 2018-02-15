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

    this.state = {
        role: 'A',
        rules:'',
        win:'',
    }

    this.list = this.props.gmsglist
    
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

shouldComponentUpdate(nextProps, nextState){
    return nextProps.gmsglist.length > this.props.gmsglist.length
}

componentWillUpdate(nextProps, nextState){
    this.list = nextProps.gmsglist
    for(i=0;i<this.list.length;i++){
        this.list[i].index = i
        this.opacity[i] = new Animated.Value(1)
    }
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
    return <Animated.View style = {{ marginTop:5, opacity:this.opacity[item.index], width:this.width*0.76,
        transform: [{
            translateX: this.opacity[item.index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, this.height*0.03, this.height*0.05],
            }),
        }] }}>
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
