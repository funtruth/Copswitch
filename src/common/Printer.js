const processString = (string) => {
    console.log('string', string)
    let wordsArr = string.split(' ')
    let phraseArr = []
    for (var i in wordsArr) {
        switch(wordsArr[i].charAt(0)){
            case '!':
            default:
                phraseArr.push(wordsArr[i])
        }
    }
    return phraseArr
}

export {
    processString
}