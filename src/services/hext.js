import React from 'react'
import { Text } from 'react-native'

class Hext {
    constructor(catalog, {
        //Search for characters in Catalog instead
        allowAllChars = false,

        //Words beginning with allowed Characters will be given style={this.defaultStyle}
        allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',

        //Character(s) used to split up the string
        separator = ' ',

        //Default style
        defaultStyle = {},
    }) {
        this.config = {
            allowAllChars,
            allowedChars,
            separator,
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
            if (this.config.allowedChars.indexOf(charId) === -1) {
                parts[i] = <Text style={this.catalog[charId]} key={i}>{string.substr(1)}</Text>
            }
        }

        return <Text style={this.config.defaultStyle}>{parts}</Text>
    }
}

export default Hext