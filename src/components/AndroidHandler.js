import React, { Component } from 'react'
import { StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'

import NavigationTool from '../modules/navigation/NavigationTool'
import {routeConfig} from '../modules/navigation/navConfig'

import {alertType, gameViewType} from '../modules/common/types'
import { showAlertByKey, showModalByKey, showGameViewByKey } from '../modules/common/ViewReducer'

class AndroidHandler extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        let currentRouteName
        if (this.props.alertView) {
            this.props.showAlertByKey()
            return true
        } else {
            currentRouteName = NavigationTool.getCurrentRoute().routeName
            if (routeConfig[currentRouteName] && routeConfig[currentRouteName].confirmBack) {
                this.props.showAlertByKey(alertType.confirmBack)
                return true
            }
        }
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
        alertView: state.view.alertView,
        modalView: state.view.modalView,
        gameView: state.view.gameView,
    }),
    {
        showAlertByKey,
        showModalByKey,
        showGameViewByKey,
    }
)(AndroidHandler)