import React, { Component } from 'react'
import { Context } from '@pretext'

class Pretext extends Component {
    render() {
        return (
            Context.format(this.props.children)
        )
    }
}

export default Pretext