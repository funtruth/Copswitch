import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

class Timer extends Component {
    state = {
        timer: null
    }

    componentWillReceiveProps(newProps) {
        let endTime = newProps.timeout

        if (!endTime) {
            this._clearTimers()
            return
        }

        let myTime = Date.now()
        let countdown = endTime - myTime

        this.setState({
            timer: Math.round(countdown/1000)
        })

        setTimeout(this._alarm,countdown)
        this.interval = setInterval(this._oneSecondPassed, 1000)
    }

    _clearTimers() {

    }

    _oneSecondPassed = () => {
        this.setState({
            timer: this.state.timer - 1
        })
    }

    _alarm = () => {
        clearInterval(this.interval)
        alert('ring ring!!')
    }

    render () {
        const { timeout } = this.props

        if (!timeout) return null
        return (
            <View>
                {this.state.timer}
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
)(Timer)