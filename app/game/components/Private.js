import React, { Component } from 'react';
import { 
    View, 
    Text,
} from 'react-native';

import { Button } from '../../components/Button.js';
import firebaseService from '../../firebase/firebaseService.js';

class Private extends Component {
    
    constructor(props) {
        super(props);
    }

    debug(){

        firebaseService.wipeRefs()
        this.props.navigate('Home')

    }

    render() {
    
        return (
            <View style = {{flex:0.25, justifyContent:'center'}}>
                
                <Button
                    horizontal = {0.4}
                    margin = {10}
                    backgroundColor = {colors.dead}
                    onPress = {()=>this.debug()}
                ><Text style = {styles.choiceButton}>Private</Text>
                </Button>
                
            </View>
        )
    }
}

export default Private
