import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
}   from 'react-native'
import { Styler } from '@common'
import { Pretext } from 'react-native-pretext'

import { NavigationTool } from '@navigation'

import joinBook from '../../../../assets/images/JoinRoomBook.png'
import createBook from '../../../../assets/images/CreateRoomBook.png'
import leftArrow from '../../../../assets/images/ArrowLeft.png'

const { height, width } = Dimensions.get('window')

const T = (props) => <Text style={styles.optionStyle}>{props.children}</Text>

class HomeScreen extends Component {
    _joinRoom = () => {
        NavigationTool.navigate('Join')
    }
    
    _createRoom = () => {
        NavigationTool.navigate('Create')
    }

    render() {
        const { container, wrapper, title,
            imageContainer, arrowContainer, rightArrowContainer, optionContainer,
            THE, COPSWITCH, CASES } = styles
        return( 
            <View style = {container}>
                <TouchableOpacity style={wrapper} onPress={this._joinRoom}>
                    <Image source={joinBook} style={imageContainer}/>
                    <Image source={leftArrow} style={arrowContainer}/>
                    <View style={[optionContainer,{transform:[{rotate:'7.36deg'}]}]}>
                        <T>{'JOIN\nROOM'}</T>
                    </View>
                </TouchableOpacity>

                <View style={{height: 0.1*height}}/>

                <TouchableOpacity style={wrapper} onPress={this._createRoom}>
                    <View style={[optionContainer,{transform:[{rotate:'-3.38deg'}]}]}>
                        <T>{'CREATE\nROOM'}</T>
                    </View>
                    <Image source={leftArrow} style={rightArrowContainer}/>
                    <Image source={createBook} style={imageContainer}/>
                </TouchableOpacity>

                <View style={title}>
                    <Text style={THE}>THE</Text>
                    <Text style={COPSWITCH}>COPSWITCH</Text>
                    <Text style={CASES}>CASES</Text>
                </View>
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#2E2620',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        position: 'absolute',
        top: 0.32*height,
        height: 0.3*height,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: {
        width: 0.4*width,
        height: 0.475*width,
        resizeMode: 'contain'
    },
    arrowContainer: {
        width: 0.25*width,
        height: 0.1*width,
        resizeMode: 'contain',
        marginBottom: 0.1*width
    },
    rightArrowContainer: {
        width: 0.25*width,
        height: 0.1*width,
        resizeMode: 'contain',
        marginTop: 0.1*width,
        transform: [
            {rotate: '180deg'}
        ]
    },
    optionContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionStyle: {
        fontSize:20,
        fontFamily: Styler.fontFamily.Medium,
        color: '#C4C4C4',
        textAlign: 'center'
    },
    THE: {
        fontSize:30,
        fontFamily: Styler.fontFamily.Medium,
        color: Styler.color.title,
        marginRight: 50
    },
    COPSWITCH: {
        fontSize:60,
        fontFamily: Styler.fontFamily.SemiBold,
        color: Styler.color.title,
        borderWidth: 2,
        borderColor: Styler.color.title,
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 5
    },
    CASES: {
        fontSize:35,
        fontFamily: Styler.fontFamily.Medium,
        color: Styler.color.title,
        marginRight: 50
    }
}

export default HomeScreen