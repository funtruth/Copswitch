import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

class GameTimer extends Component {
    state = {
        stopwatch: null
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.timeout) {
            this._clearTimers()
            return
        }

        let endTime = newProps.timeout
        let myTime = Date.now()
        let countdown = endTime - myTime

        this.setState({ stopwatch: Math.round(countdown/1000) })

        this.timerRef = setTimeout(this._alarm,countdown)
        this.interval = setInterval(this._oneSecondPassed, 1000)
    }

    _clearTimers() {

    }

    _oneSecondPassed = () => this.setState({ stopwatch: this.state.stopwatch - 1 })

    _alarm = () => {
        clearInterval(this.interval)
        alert('ring ring!!')
    }

    componentWillUnmount() {
        if (this.timerRef) {
            clearTimeout(this.timerRef)
        }
    }

    render () {
        const { timeout } = this.props

        return (
            <View>
                <Text>{this.state.stopwatch}</Text>
            </View>
        )
    }
}

const styles = {

}

export default connect(
    state => ({
        timer: state.game.timer
    })
)(GameTimer)