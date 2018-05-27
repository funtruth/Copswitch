import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions 
} from 'react-native';
import { connect } from 'react-redux'

import { Phases } from '../../misc/phases.js';
import { Button } from '../../components/Button';

import firebaseService from '../../firebase/firebaseService';
import playerModule from '../mods/playerModule';
import ownerModule from '../mods/ownerModule';

class ConsoleView extends Component {
        
    buttonOnePress() {
        this.props.viewList()
    }
    
    buttonTwoPress() {
        playerModule.selectChoice(-1)
    }

    resetOptionPress() {
        playerModule.selectChoice(null)
    }

    render() {
        const { phase, dayNum } = this.props
        alert(phase)
        return ( 
            <Animated.View style = {styles.console}>
                    
                <Text style = {styles.phase}>{Phases[phase].name + ' ' + dayNum}</Text>

                <Button
                    horizontal = {0.4}
                    margin = {10}
                    backgroundColor = {colors.dead}
                    onPress = {() => this.buttonOnePress()}
                ><Text style = {styles.choiceButton}>{Phases[phase].buttonOne}</Text>
                </Button>

                <Button
                    horizontal = {0.4}
                    backgroundColor = {colors.dead}
                    onPress = {() => this.buttonTwoPress()}
                ><Text style = {styles.choiceButton}>{Phases[phase].buttonTwo}</Text>
                </Button>

            </Animated.View>
        )
    }
}

const styles = {
    console:{
        flex:0.3,
        margin:5,
        borderRadius:5,
        backgroundColor:colors.card,
        justifyContent:'center'
    },
    phase:{
        fontSize:30,
        fontFamily:'FredokaOne-Regular',
        marginBottom:5, 
        color:colors.shadow,
        alignSelf:'center'
    },
    choiceButton: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 17,
        alignSelf: 'center',
        color: colors.shadow,
        margin:4,
    },
}

export default connect(
    state => ({
        phase: state.room.phase,
        dayNum: state.room.dayNum,
        place: state.room.place
    })
)(ConsoleView)

