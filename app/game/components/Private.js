import React, { Component } from 'react';
import { 
    View, 
    Text,
} from 'react-native';
import { connect } from 'react-redux'

import { Button } from '../../components/Button.js';

class Private extends Component {
    render() {
        return (
            <View style = {{flex:0.25, justifyContent:'center'}}>
                
                <Button
                    horizontal = {0.4}
                    margin = {10}
                    backgroundColor = {colors.dead}
                    onPress = {() => {}}
                ><Text style = {styles.choiceButton}>Private</Text>
                </Button>
                
            </View>
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

export default connect(
    state => ({
        roleid: state.game.roleid
    })
)(Private)
