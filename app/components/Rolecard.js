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
        size: new Animated.Value(2),
        opacity: new Animated.Value(0),

        role: 'A',
        rules:'',
        win:'',

    }

    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
}

componentDidMount(){
    this.setState({
        role:Rolesheet[this.props.roleid].name,
        rules:Rolesheet[this.props.roleid].rules,
        win:Rolesheet[this.props.roleid].win,
    }) 
}

componentWillReceiveProps(newProps){
    this.setState({
        role:Rolesheet[newProps.roleid].name,
        rules:Rolesheet[newProps.roleid].rules,
        win:Rolesheet[newProps.roleid].win,
    })
}

render() {

    return (
        <View style = {{
            position:'absolute', left:this.height*0.1, right:this.height*0.1, bottom:this.height*0.4
        }}>
            <View style = {{justifyContent: 'center', alignItems: 'center' }}>
                <Text style = {styles.lfont}>you are a:</Text>
                <Text style = {styles.mfont}>{this.state.role}</Text>
                <Text style = {styles.lfont}>At night you:</Text>
                <Text style = {styles.roleDesc}>{this.state.rules}</Text>
                {this.props.amimafia?<View>
                    <Text style = {styles.lfont}>Your teammates:</Text>
                    <FlatList
                        data={this.props.mafialist}
                        renderItem={({item}) => (
                            <Text style={[styles.roleDesc,{textDecorationLine:item.dead?'line-through':'none'}]}>
                                {'[ ' + item.name + ' ] ' + item.rolename}</Text>
                        )}
                        keyExtractor={item => item.key}
                    /></View>:<View><Text style = {styles.lfont}>you win when:</Text>
                    <Text style = {styles.roleDesc}>{this.state.win}</Text></View>}
            </View>
        </View>
    )
}
}
