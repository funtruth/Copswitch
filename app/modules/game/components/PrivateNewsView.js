import React, { Component } from 'react'
import { 
    View, 
    Text,
} from 'react-native'
import { Button } from '@components'

class PrivateNewsView extends Component {
    render() {
        return (
            <View style = {{flex:0.25, justifyContent:'center'}}>
                
                <Button
                    horizontal = {0.4}
                    margin = {10}
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
        margin:4,
    },
}

export default PrivateNewsView
