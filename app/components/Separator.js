import React, { Component } from 'react'
import { View } from 'react-native'

class Separator extends Component {
    render() {
        return (
            <View style = {{
                height:2,
                backgroundColor:'white',
                opacity:0.2,
                width: '50%',
                alignSelf: 'center'
            }}/>    
        )
    }
}

export default Separator