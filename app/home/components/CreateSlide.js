import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ActivityIndicator
}   from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import colors from '../misc/colors.js'

class CreateSlide extends Component {
    render() {
        return(
            <TouchableOpacity 
                style = {styles.container} 
                onPress = { this.props.createRoom }
                activeOpacity = {0.9}
            >
                <View style = {{ margin: 10 }}>
                    <View style = {styles.titleContainer}>
                        <FontAwesome name = 'edit' style = {styles.iconStyle} />
                        <Text style = {styles.titleStyle}>Create</Text>
                        <ActivityIndicator
                            animating = { this.props.loading } 
                            size = "large"
                            color = { colors.shadow }
                            style = { styles.indicator }
                        />
                    </View>
                    <Text style = {styles.subtitleStyle}>Customize your own room!</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    container:{
        marginLeft:20,
        marginRight:20,
        backgroundColor: colors.lightgrey,
        borderRadius: 5
    },
    iconStyle:{
        fontSize: 25,
        marginLeft:5
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
    },
    titleStyle:{
        fontSize:30,
        fontFamily: 'BarlowCondensed-SemiBold',
        marginLeft:10
    },
    subtitleStyle:{
        fontSize:16,
        marginLeft:5
    },
    textInput: {
        fontSize: 16,
        color: colors.shadow,
        fontWeight:'bold'
    },
    indicator:{
        marginLeft: 20
    }
}

export default CreateSlide