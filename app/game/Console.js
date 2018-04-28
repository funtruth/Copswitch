import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    Dimensions 
} from 'react-native';

import Phases from './phases.json';
import { Button } from '../components/Button';


class Console extends Component {
        
    constructor(props) {
        super(props);
    }

    render() {

        return ( 
            <Animated.View style = {{flex:0.3, margin:5, borderRadius:5, 
                backgroundColor:colors.card, justifyContent:'center'}}>
                    
                <Text style = {{ fontSize:30, fontFamily:'FredokaOne-Regular', marginBottom:5, 
                    color:colors.shadow, alignSelf:'center' }}>{this.props.title}</Text>

                    <Button
                        horizontal = {0.4}
                        margin = {10}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.first}
                    ><Text style = {styles.choiceButton}>{this.props.btn1}</Text>
                    </Button>

                    <Button
                        horizontal = {0.4}
                        backgroundColor = {colors.dead}
                        onPress = {this.props.second}
                        ><Text style = {styles.choiceButton}>{this.props.btn2}</Text>
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

