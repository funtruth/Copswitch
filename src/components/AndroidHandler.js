import React, { Component } from 'react'
import { StatusBar, BackHandler } from 'react-native'
import { connect } from 'react-redux'

import { showModalByKey } from '../modules/common/ViewReducer'

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
    }),
    {
        showModalByKey,
    }
)(AndroidHandler)