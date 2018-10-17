import React, { Component } from 'react'
import { 
    View, 
    Text,
} from 'react-native'
import { connect } from 'react-redux'
import LobbyModal from '../modal/LobbyModal';

class MyRole extends Component {
    render() {
        return (
            <LobbyModal
                type="myRole"
                title="My Role Information"
            >

            </LobbyModal>
        )
    }
}

const styles = {
    
}

export default connect(
    state => ({

    })
)(MyRole)