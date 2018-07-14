export const Games = [{
    'Mafia': {
        settings: {
            timer: {
                none: 0,
                standard: 120
            }
        }
    }
}]

export const Modes = [
    {
        key: 'classic',
        title: 'Classic',
        display: 'CLASSIC',
        desc: 'Play the classic game of Mafia with all the original roles!'
    },
    {
        key: 'blitz',
        title: 'Blitz',
        display: 'BLITZ',
        desc: 'Play a speed round of Mafia with hand-picked roles, with 1 minute discussion rounds.'
    },
    {
        key: 'copswitch',
        title: 'Copswitch',
        display: 'COPSWITCH',
        desc: 'Play the classic game of Mafia with all the original roles!'
    },
    {
        key: 'custom',
        title: 'Custom',
        display: 'CUSTOM',
        desc: 'Play the classic game of Mafia with all the original roles!'
    }
]

export const Phases = {
    0: {
        name : 'DAY',
        message : 'Choose an Option',
        buttonOne : 'Vote',
        buttonTwo : 'Abstain'
    },
    1: {
        name : 'TRIAL',
        message : 'Decide their Fate',
        buttonOne : 'Innocent',
        buttonTwo : 'Guilty'
    },
    2: {
        name : 'NIGHT',
        message : 'Perform an Action',
        buttonOne : 'Visit',
        buttonTwo : 'sleep'
    }
    
}