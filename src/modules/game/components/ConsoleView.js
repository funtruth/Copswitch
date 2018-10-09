import React, { Component } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux'
import { GameInfo } from '@library';
import { Styler } from '@common'

import { statusType } from '../../common/types';

import Separator from '@components/Separator.js';

const { height, width } = Dimensions.get('window')
const { Phases } = GameInfo

class ConsoleView extends Component {
        
    buttonOnePress = () => {
        //this.props.viewList() do this in redux
    }
    
    buttonTwoPress = () => {
        
    }

    resetOptionPress() {
        
    }

    render() {
        const { config, gameState } = this.props
        if (config.status === statusType.pregame) return null

        return ( 
            <View style = {{
                height,
                width,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style = {styles.header}>
                    {Phases[gameState.phase].name + ' ' + gameState.dayNum}</Text>

                <View style={{width:'50%', alignItems:'center', margin: 20}}>
                    <TouchableOpacity
                        onPress = {this.buttonOnePress}
                    ><Text style = {styles.choiceButton}>{Phases[phase].buttonOne}</Text>
                    </TouchableOpacity>
                    <Separator />
                    <TouchableOpacity
                        onPress = {this.buttonTwoPress}
                    ><Text style = {styles.choiceButton}>{Phases[phase].buttonTwo}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = {
    header:{
        fontFamily: Styler.fontFamily.Medium,
        fontSize:30,
        marginBottom:5,
        alignSelf:'center'
    },
    choiceButton: {
        fontFamily: Styler.fontFamily.Regular,
        color: 'white',
        opacity: 0.8,
        fontSize: 20,
        margin:4
    }
}

export default connect(
    state => ({
        config: state.lobby.config,
        gameState: state.lobby.gameState,
    })
)(ConsoleView)

