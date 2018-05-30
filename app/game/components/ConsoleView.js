import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux'
import { Phases } from '../../misc/phases.js';

import firebaseService from '../../firebase/firebaseService';
import playerModule from '../mods/playerModule';
import ownerModule from '../mods/ownerModule';
import Styler from '../../common/Styler.js';

class ConsoleView extends Component {
        
    buttonOnePress = () => {
        //this.props.viewList() do this in redux
    }
    
    buttonTwoPress = () => {
        playerModule.selectChoice(-1)
    }

    resetOptionPress() {
        playerModule.selectChoice(null)
    }

    render() {
        const { phase, dayNum } = this.props
        return ( 
            <View style = {{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style = {[styles.header,Styler.default]}>
                    {Phases[phase].name+' '+dayNum}</Text>

                <View style={{width:'50%', alignItems:'center', margin: 20}}>
                    <TouchableOpacity
                        onPress = {this.buttonOnePress}
                    ><Text style = {[styles.choiceButton,Styler.fading]}>{Phases[phase].buttonOne}</Text>
                    </TouchableOpacity>
                    <View style={{height:2, backgroundColor:'white', opacity:0.2, width: '50%'}}/>
                    <TouchableOpacity
                        onPress = {this.buttonTwoPress}
                    ><Text style = {[styles.choiceButton,Styler.fading]}>{Phases[phase].buttonTwo}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = {
    header:{
        fontSize:30,
        marginBottom:5,
        alignSelf:'center'
    },
    choiceButton: {
        fontSize: 20,
        margin:4
    }
}

export default connect(
    state => ({
        phase: state.game.phase,
        dayNum: state.game.dayNum
    })
)(ConsoleView)

