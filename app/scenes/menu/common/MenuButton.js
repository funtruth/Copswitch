import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class MenuButton extends Component {
    render() {
        return(
            <TouchableOpacity 
                style = {styles.container}
                onPress = { this.props.onPress }>
                <View style = { styles.padding }>
                    <FontAwesome name='book' style={styles.iconStyle}/>
                    <Text style = {styles.fontStyle}>Menu</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    container:{
        position:'absolute',
        top:20,
        left:20,
        borderRadius:5
    },
    padding:{
        margin: 5,
        alignItems:'center',
        flexDirection: 'row'
    },
    iconStyle:{
        fontSize:25,
        marginLeft:10
    },
    fontStyle:{
        marginLeft:15,
        marginRight:15,
        fontFamily:'FredokaOne-Regular',
        fontSize: 18
    }
}

export default MenuButton
