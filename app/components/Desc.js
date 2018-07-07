import React, { Component } from 'react'
import { 
    View,
    Text,
    Animated,
    Dimensions,
    ScrollView,
    TouchableOpacity } from 'react-native'

import { Roles } from '../library/roles'

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
                style = {{width:this.width*0.7}}>
                <Text style = {styles.lfont}>CHARACTER:</Text>
                <Text style = {styles.title}>{Roles[this.props.roleid].name}</Text>
                <Text style = {styles.lfont}>DURING THE NIGHT:</Text>
                <Text style = {styles.roleDesc}>{Roles[this.props.roleid].rules}</Text>
                <Text style = {styles.lfont}>WIN CONDITION:</Text>
                <Text style = {styles.roleDesc}>{Roles[this.props.roleid].win}</Text>

            </ScrollView>
        )
    }
}

const styles = {

    title: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 25
    },
    lfont: {
        fontFamily:'LuckiestGuy-Regular',
        fontSize: 25
    },
    roleDesc: {
        fontSize: 15,
        fontFamily: 'FredokaOne-Regular',
        marginTop:5,
        marginBottom:5
    },

}
