import { NameSwap } from '@components'

const PLAYER_NAME = '!'

const processString = (string) => {
    console.log('string', string)
    let words = string.split(' ')
    let arr = []

    //TODO should proably make this a .map() and also make this a service
    for (var i in words) {
        switch(wordsArr[i].charAt(0)){
            case PLAYER_NAME:
                return arr.push(<NameSwap>{words[i].substr(1)}</NameSwap>)
            default:
                return arr.push(wordsArr[i])
        }
    }

    return phraseArr
}

export {
    processString
}