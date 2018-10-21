
import React, { Component } from 'react';
import {modalType} from '../../common/types'
import LobbyTextInput from '../components/LobbyTextInput';
import LobbyModal from '../../common/modals/LobbyModal';

class MyName extends Component {
    render() {
        return (
            <LobbyModal
                type={modalType.myName}
                title="Edit Name"
            >
                <LobbyTextInput
                    name={this.props.name}
                    lobby={this.props.lobby}
                />
            </LobbyModal>
        )
    }
}

const styles = {
}

export default MyName