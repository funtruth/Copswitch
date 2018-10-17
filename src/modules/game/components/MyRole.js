import React, { Component } from 'react'
import { 
    View, 
    Text,
} from 'react-native'
import { connect } from 'react-redux'

class MyRole extends Component {
    render() {
        return (
            <View style = {{flex:0.25, justifyContent:'center'}}>
                
                
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

export default connect(
    state => ({

    })
)(MyRole)