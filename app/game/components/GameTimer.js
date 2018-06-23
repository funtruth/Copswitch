import React, { Component } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Styler } from '@common'

const { height, width } = Dimensions.get('window')

class GameTimer extends Component {
    state = {
        stopwatch: null
    }
    endTime = null

    componentWillReceiveProps(newProps) {
        if (!newProps.timeout) {
            this._clearTimers()
            return
        }

        this.endTime = newProps.timeout
        this.interval = setInterval(this._oneSecondPassed, 1000)
    }

    _oneSecondPassed = () => {
        let diff = Date.now() - this.endTime
        if (diff <= 0) this._alarm()
        
        this.setState({
            stopwatch: Math.round(diff/1000)
        })
    }

    _alarm() {
        this.endTime = null
        clearInterval(this.interval)
    }

    componentWillUnmount() {
        if (this.timerRef) {
            clearTimeout(this.timerRef)
        }
    }

    render () {
        const { timeout } = this.props

        return (
            <View style={{
                height,
                width,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: Styler.fontFamily.Regular
                }}>{this.state.stopwatch}</Text>
            </View>
        )
    }
}

const styles = {

}

export default connect(
    state => ({
        timeout: state.game.timeout
    })
)(GameTimer)