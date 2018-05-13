import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

class MenuButton extends Component {

    render() {

        return(
            <TouchableOpacity 
                style = {styles.container}
                onPress = { this.props.onPress }>
                <FontAwesome name='book' style={styles.iconStyle}/>
                <Text style = {styles.fontStyle}>Menu</Text>
            </TouchableOpacity>
        )

    }

}

const styles = {
    container:{
        flexDirection: 'row',
        alignItems:'center',
        position:'absolute',
        top:20,
        left:30
    },
    iconStyle:{
        color:colors.font,
        fontSize:30
    },
    fontStyle:{
        marginLeft:15,
        color:colors.font,
        fontFamily:'FredokaOne-Regular'
    }
}

export default MenuButton
