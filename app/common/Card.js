import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';

class Card extends Component {


    render(){

        
        const { cardStyle, children } = this.props

        return (
            <View style = {[styles.container,cardStyle]}>

                {children}
            
            </View>
        )

    }

}

const styles = {
    container:{
        backgroundColor: 'white',
        margin:5,
        borderRadius:2,
        alignSelf:'center',
    }
}

export default Card