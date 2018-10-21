import React, { Component } from 'react'
import { StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'

import {gameViewType} from '../modules/common/types'
import { showModalByKey, showGameViewByKey } from '../modules/common/ViewReducer'

class AndroidHandler extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        if (this.props.modalView) {
            this.props.showModalByKey()
        } else {
            switch(this.props.gameView) {
                case gameViewType.lobby:
                    this.props.showGameViewByKey(gameViewType.game)
                    break
                default:
            }
        }
        return true
    }

    render() {
        return (
            <StatusBar backgroundColor={'rgba(0,0,0,1)'}/>
        )
    }
}

export default connect(
    state => ({
        modalView: state.view.modalView,
        gameView: state.view.gameView,
    }),
    {
        showModalByKey,
        showGameViewByKey,
    }
)(AndroidHandler)