import Game from './screen/Game'
import Roles from './screen/Roles'
import Lobby from './screen/Lobby'

export const Tabs = [
    {
        label: 'Roles',
        icon: 'ios-grid',
        key: 'roles',
        Component: Roles,
    },
    {
        label: 'Game',
        icon: 'ios-flash',
        key: 'game',
        Component: Game,
    },
    {
        label: 'Players',
        icon: 'ios-people',
        key: 'lobby',
        Component: Lobby,
    },
]

export const Constants = {
    headerHeight: 80,
    footerHeight: 80,
    modalHeaderHeight: 35,
}