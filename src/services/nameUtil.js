const defaultChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const checkIfValidName = (name, config) => {
    let allowedChars = defaultChars
    let invalidChars = []

    if (config) {
        const { allowSpaces } = config
        
        if (allowSpaces) allowedChars += ' '
    }

    for (var i=0; i<name.length; i++) {
        let isCharValid = false
        for (var j=0; j<allowedChars.length; j++) {
            if(name.charAt(i) === allowedChars.charAt(j)) {
                isCharValid = true
                break
            }
        }
        if (!isCharValid) {
            invalidChars.push(name.charAt(i))
        }
    }

    return {
        valid: invalidChars.length === 0,
        invalidChars
    }
}

export {
    checkIfValidName
}