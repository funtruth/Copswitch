import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux'
import { gameChoice } from '../GameReducer'
import { Phases } from '../../misc/phases.js';
import { Styler } from '@common'

import firebaseService from '../../firebase/firebaseService';
import ownerModule from '../mods/ownerModule';
import Separator from '../../components/Separator.js';

const { height, width } = Dimensions.get('window')

class ConsoleView extends Component {
        
    buttonOnePress = () => {
        //this.props.viewList() do this in redux
    }
    
    buttonTwoPress = () => {
        this.props.gameChoice(-1)
    }

    resetOptionPress() {
        this.props.gameChoice(null)
    }

    render() {
        const { phase, dayNum } = this.props
        return ( 
            <View style = {{
                height,
                width,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style = {styles.header}>
                    {Phases[phase].name+' '+dayNum}</Text>

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
        phase: state.game.phase,
        dayNum: state.game.dayNum
    }),
    dispatch => {
        return {
            gameChoice: (choice) => dispatch(gameChoice(choice))
        }
    }
)(ConsoleView)

