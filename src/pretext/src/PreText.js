import React from 'react'
import { Text } from 'react-native'

class PreText {
    constructor(catalog, {
        //Character(s) used to split up the string
        //Can be used with Regex, for example, /[\s,]+/ will split on spaces and commas.
        separator = ' ',

        //Checks for multiple prefixes
        stackPrefixes = false,

        //Default style
        defaultStyle = {},
    }) {
        this.config = {
            separator,
            stackPrefixes,
            defaultStyle
        }

        this.setCatalog(catalog)
    }

    setCatalog (catalog) {
        this.catalog = catalog
        return catalog
    }

    format (string) {
        let parts = string.split(this.config.separator)
        let charId

        for (var i=0; i<parts.length; i++) {
            charId = parts[i].charAt(0)

            if (this.catalog[charId]) {
                parts[i] = <Text style={this.catalog[charId]} key={i}>{string.substr(1)}</Text>
            }
        }

        return <Text style={this.config.defaultStyle}>{parts}</Text>
    }
}

export default PreText