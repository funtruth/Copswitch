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
import playerModule from '../mods/playerModule';
import ownerModule from '../mods/ownerModule';


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

            ready: null,

        }

        this.counterRef = null
        this.nominationRef = null
        this.myReadyRef = null
    }

    componentWillMount(){

        this.counterRef = playerModule.fetchGameRef('counter')
        this.nominationRef = playerModule.fetchGameRef('nomination')
        this.myReadyRef = playerModule.fetchMyReadyRef()
        this.loadedRef = playerModule.fetchGameRef('loaded')

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

                ownerModule.passCounterInfo(phase, snap.val())
                    
            }
        })

        this.nominationRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({nominee: snap.val()})
            }
        })

        this.myReadyRef.on('value',snap=>{
    
            if(snap.exists()){
                
                this.setState({ ready:readysnap.val() })
    
            } else {
    
                this.setState({ ready:null  })
    
                //TODO PERFORM ACTIONS HERE BEFORE SUBMITTING TRUE
    
                setTimeout(()=>{
                    this.myReadyRef.once('value',snap=>{
                        if(snap.exists()){
                            this.myReadyRef.remove();
                        } else {
                            playerModule.loaded()
                        }
                    })
                },1500)
            }
        })

    }

    componentWillUnmount(){

        if(this.counterRef) this.counterRef.off()
        if(this.nominationRef) this.nominationRef.off()
        if(this.myReadyRef) this.myReadyRef.off()

    }

    buttonOnePress() {

        if(this.state.phase == 1){
            this.props.viewList()
        } else if (this.state.phase == 2){
            playerModule.selectChoice(1)
        } else if (this.state.phase == 0){
            this.props.viewList()
        }

    }
    
    buttonTwoPress() {

        playerModule.selectChoice(-1)

    }

    resetOptionPress() {
        
        playerModule.selectChoice(null)

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

