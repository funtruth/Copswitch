import News from './screen/News'
import GameChoice from './screen/GameChoice'
import Events from './screen/Events'

export const Tabs = [
    {
        label: 'News',
        icon: 'ios-megaphone',
        key: 'news',
        Component: News
    },
    {
        label: 'Game',
        icon: 'ios-home',
        key: 'lobby',
        Component: GameChoice,
    },
    {
        label: 'Events',
        icon: 'ios-paper-plane',
        key: 'events',
        Component: Events,
    }
]