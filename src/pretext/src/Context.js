import React from 'react'
import { Text } from 'react-native'

class Context {
    constructor() {
        this.defaultStyle = {}
        this.context = {}
        this.config = {
            //Character(s) used to split up the string
            //Can be used with Regex, for example, /[\s,]+/ will split on spaces and commas.
            separator: ' ',

            //Checks for multiple prefixes
            stackPrefixes: false,
        }
    }

    give (defaultStyle, context, config) {
        console.log('giving Context', defaultStyle, context, config)
        this.defaultStyle = defaultStyle
        this.context = context
        this.config = Object.assign(this.config, config)
    }

    format (string) {
        let parts = string.split(this.config.separator)
        let charId

        for (var i=0; i<parts.length; i++) {
            charId = parts[i].charAt(0)

            if (this.context[charId]) {
                parts[i] = <Text style={this.context[charId]} key={i}>{string.substr(1)}</Text>
            }
        }

        return <Text style={this.defaultStyle}>{parts}</Text>
    }
}

export default new Context()