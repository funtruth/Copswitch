import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../misc/colors';

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
        backgroundColor: colors.lightgrey,
        borderRadius:5
    },
    padding:{
        margin: 5,
        alignItems:'center',
        flexDirection: 'row'
    },
    iconStyle:{
        color: colors.grey,
        fontSize:25,
        marginLeft:10
    },
    fontStyle:{
        marginLeft:15,
        marginRight:15,
        color: colors.grey,
        fontFamily:'FredokaOne-Regular',
        fontSize: 18
    }
}

export default MenuButton
