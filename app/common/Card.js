import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

class Card extends Component {


    render(){

        
        const { style, children } = this.props

        return (
            <View style = {[styles.container,{style}]}>

                {children}
            
            </View>
        )

    }

}

const styles = {
    container:{
        backgroundColor: 'white',
        margin:5,
        borderRadius:2
    }
}

export default Card