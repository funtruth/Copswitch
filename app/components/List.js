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

export class List extends React.Component {

    
constructor(props) {
    super(props);

    this.state = {
        role: 'A',
        rules:'',
        win:'',
    }

    this.list = this.props.namelist
    
    this.opacity = []
    for(i=0;i<this.list.length;i++){
        this.list[i].index = i
        this.opacity[i] = new Animated.Value(0)
    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    this.animate(true)
}


shouldComponentUpdate(nextProps, nextState){
    return nextProps.namelist.length > this.props.namelist.length
}

componentWillUpdate(nextProps, nextState){
    this.list = nextProps.namelist
    for(i=0;i<this.list.length;i++){
        this.list[i].index = i
        this.opacity[i] = new Animated.Value(0)
    }
}

animate (show) {
    const animations = this.list.map((item) => {
        return Animated.timing(
        this.opacity[item.index],
            {
                toValue: show?1:0,
                duration: 150
            }
        )
    })
    Animated.stagger(80, animations).start()
}


_renderItem(item){
    return <TouchableOpacity
        style = {{flexDirection:'row',alignItems:'center',
                justifyContent:'center', height:40, margin:5, marginTop:0, borderRadius:5,
        backgroundColor: item.dead ? colors.dead : (item.immune? colors.immune :
                    (item.status?colors.status:colors.shadow))}}   
        onPress         = {this.props.onPress}
        disabled        = {this.state.disabled}
    >
        <View style = {{flex:0.15,justifyContent:'center',alignItems:'center'}}>
        <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
            'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
            style={{color:colors.font, fontSize:26}}/>
        </View>
        <View style = {{flex:0.7, justifyContent:'center'}}>
            <Text style = {styles.lfont}>{false?item.name + ' (' + Rolesheet[item.roleid].name + ') ':
                item.name}</Text>
        </View>
        <View style = {{flex:0.15}}/>
    
    </TouchableOpacity>
}

render() {

    return (
        <View style = {{
            position:'absolute', left:0, top:MARGIN*2, bottom:MARGIN*2, right:0,
            borderRadius:5,
        }}>
            <FlatList
                data={this.list}
                renderItem={({item}) => (this._renderItem(item))}
                keyExtractor={item => item.uid}
            />
        </View>
    )
}
}
