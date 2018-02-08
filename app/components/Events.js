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

export class Events extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        size: new Animated.Value(2),
        opacity: new Animated.Value(0),

        role: 'A',
        rules:'',
        win:'',

        list: [],

    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    this.setState({
        list: this.props.gmsglist.concat(this.props.msglist)
    })
}

componentWillReceiveProps(newProps){
    this.setState({
        list: newProps.gmsglist.concat(newProps.msglist)
    })
}

_renderItem(item){
    return <View style = {{ marginTop:5,
        justifyContent:'center',alignItems:'center'}}>
        <Text style = {styles.roleDesc}>{item.message}</Text>
    </View>
}

render() {

    return (
        <View style = {{
            position:'absolute', left:this.width*0.1, right:this.width*0.1, bottom:this.height*0.4, height:this.height*0.5
        }}>
            <FlatList
                data={this.state.list}
                renderItem={({item}) => (this._renderItem(item))}
                initialNumToRender={12}
                inverted
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.key}
            />
        </View>
    )
}
}
