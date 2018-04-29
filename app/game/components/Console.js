import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions 
} from 'react-native';

import Phases from '../../misc/phases.json';
import { Button } from '../../components/Button';
import firebaseService from '../../firebase/firebaseService';
import playerActions from '../mods/playerActions';


class Console extends Component {
        
    constructor(props) {
        super(props);

        this.state = {

            counter: null,
            phase:null,
            buttonOne: null,
            buttonTwo: null,
            phaseName: null,

            nominee: null,

        }

        this.counterRef = null
        this.nominationRef = null
    }

    componentWillMount(){

        this.counterRef = firebaseService.fetchGameListener('counter')
        this.nominationRef = firebaseService.fetchGameListener('nomination')

        this.counterRef.on('value',snap=>{
            if(snap.exists()){

                const phase = snap.val() % 3
                
                this.setState({
                    counter: snap.val(),
                    phase:phase,
                    buttonOne: Phases[phase].btn1,
                    buttonTwo: Phases[phase].btn2,
                    phaseName: Phases[phase].name,
                })
                    
            }
        })

        this.nominationRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({nominee: snap.val()})
            }
        })

    }

    componentWillUnmount(){

        if(this.counterRef) this.counterRef.off()
        if(this.nominationRef) this.nominationRef.off()

    }

    buttonOnePress() {

        if(this.state.phase == 1){
            this.setState({section:'list'})
        } else if (this.state.phase == 2){
            playerActions.selectChoice(1)
        } else if (this.state.phase == 0){
            this.setState({section:'list'})
        }
    }
    
    buttonTwoPress() {
        playerActions.selectChoice(-1)
    }

    render() {

        return ( 
            <Animated.View style = {{flex:0.3, margin:5, borderRadius:5, 
                backgroundColor:colors.card, justifyContent:'center'}}>
                    
                <Text style = {{ fontSize:30, fontFamily:'FredokaOne-Regular', marginBottom:5, 
                    color:colors.shadow, alignSelf:'center' }}>
                    {(this.state.phase == 1 || this.state.phase == 0)?
                        this.state.phaseName + ' ' + ((this.state.counter - this.state.counter%3)/3+1)
                        :this.state.phaseName}</Text>

                    <Button
                        horizontal = {0.4}
                        margin = {10}
                        backgroundColor = {colors.dead}
                        onPress = {() => this.buttonOnePress()}
                    ><Text style = {styles.choiceButton}>{this.state.buttonOne}</Text>
                    </Button>

                    <Button
                        horizontal = {0.4}
                        backgroundColor = {colors.dead}
                        onPress = {() => this.buttonTwoPress()}
                    ><Text style = {styles.choiceButton}>{this.state.buttonTwo}</Text>
                    </Button>

            </Animated.View>
        )
    }
}

const styles = {
    choiceButton: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 17,
        alignSelf: 'center',
        color: colors.shadow,
        margin:4,
    },
}

export default Console

