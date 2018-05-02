import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions 
} from 'react-native';

import { Button } from '../../components/Button';
import playerModule from '../mods/playerModule';
import firebaseService from '../../firebase/firebaseService';


class Nomination extends Component {
        
    constructor(props) {
        super(props);

        this.state = {

            nominee:null,

        }

        this.nominationRef = null
        this.myReadyRef = null
    }

    on(show){

        


    }

    componentWillMount(){
        
        this.nominationRef = firebaseService.fetchRoomRef('nomination')
        this.myReadyRef = playerModule.fetchMyReadyRef()

        this.nominationRef.on('value',snap=>{
            if(snap.exists()){
                
                this.setState({
                    nominee: playerModule.getUserNameUsingPlace(snap.val())
                })

                this.on(true)

            }
        })

        this.myReadyRef.on('value',snap=>{
    
            if(snap.exists() && snap.val()){
                
                this.setState({
                    nominee: null
                })

                this.on(false)
    
            }

        })

    }

    componentWillUnmount(){

        if(this.nominationRef) this.nominationRef.off()
        if(this.myReadyRef) this.myReadyRef.off()

    }

    buttonOnePress() {

        playerModule.selectChoice(1)

    }
    
    buttonTwoPress() {

        playerModule.selectChoice(-1)

    }

    render() {

        return ( 
            <Animated.View style = {styles.console}>
                    
                <Text style = {styles.phase}>is now on Trial</Text>

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

export default Nomination

