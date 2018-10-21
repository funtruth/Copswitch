import {gameViewType} from '../modules/common/types'

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
        name : 'Day',
        message : 'Choose an Option',
        choices: [
            { 
                label: 'Vote',
                detail: 'Put someone\non trial',
                icon: 'ios-compass',
                onPress: gameViewType.lobby,
            },
            {
                label: 'Abstain',
                detail: 'Get ready\nto sleep',
                icon: 'ios-megaphone',
                onPress: -1,
            }
        ],
    },
    1: {
        name : 'Trial',
        message : 'Decide the fate of ',
        choices: [
            { 
                label: 'Innocent',
                detail: 'Vouch for\ntheir innocence!',
                icon: 'ios-thumbs-up',
                onPress: 1,
            },
            {
                label: 'Guilty',
                detail: 'Sentence them\nto death!',
                icon: 'ios-thumbs-down',
                onPress: 0,
            }
        ],
    },
    2: {
        name : 'Night',
        message : 'Perform an Action',
        choices: [
            { 
                label: 'Vote',
                detail: 'Put someone\non trial',
                icon: 'ios-compass',
            },
            {
                label: 'Abstain',
                detail: 'Get ready\nto sleep',
                icon: 'ios-megaphone',
            }
        ],
    }
}