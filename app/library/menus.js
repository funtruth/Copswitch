const ScreenTypes = {
  menu: 'screen/menu',
  detail: 'screen/detail'
}

const Screens = {
  home: ScreenTypes.menu,
  rules:  ScreenTypes.menu,
  setup: ScreenTypes.menu,
  gameInfo: ScreenTypes.menu,
  phases: ScreenTypes.menu,
  about: ScreenTypes.detail,
  intro: ScreenTypes.detail,
  general: ScreenTypes.detail,
  making: ScreenTypes.detail,
  joining: ScreenTypes.detail,
  pickingRoles: ScreenTypes.detail,
  role: ScreenTypes.detail,
  day: ScreenTypes.detail,
  trial: ScreenTypes.detail,
  night: ScreenTypes.detail,
  events: ScreenTypes.detail,
  ending: ScreenTypes.detail
}

const MenuTypes = {
  menu: 'menu/menu',
  detail: 'menu/detail',
  other: 'menu/other'
}

const Menus = {
  home: {
    data: [
      {
        key: 'roles',
        label: 'Roles',
        type: MenuTypes.other
      },
      {
        key: 'rules',
        label: 'Rules',
        type: MenuTypes.menu
      },
      {
        key: 'about',
        label: 'About',
        type: MenuTypes.detail
      }
    ]
  },
  rules : {
    title: 'How to play',
    data: [
      {
        key: 'intro',
        label: 'Introduction',
        type: MenuTypes.detail
      },
      {
        key: 'general',
        label: 'General',
        type: MenuTypes.detail
      },
      {
        key: 'setup',
        label: 'Setting Up',
        type: MenuTypes.menu
      },
      {
        key: 'gameInfo',
        label: 'Game Info',
        type: MenuTypes.menu
      }
    ]
  },
  setup: {
    title: 'Setting up',
    data: [
      {
        key: 'joining',
        label: 'Joining a Game',
        type: MenuTypes.detail
      },
      {
        key: 'making',
        label: 'Making a Game',
        type: MenuTypes.detail
      },
      {
        key: 'pickingRoles',
        label: 'Picking Roles',
        type: MenuTypes.detail
      }
    ]
  },
  gameInfo: {
    title: 'Game info',
    data: [
      {
        key: 'profile',
        label: 'Profile',
        type: MenuTypes.detail
      },
      {
        key: 'phases',
        label: 'Phases',
        type: MenuTypes.menu
      },
      {
        key: 'events',
        label: 'Events',
        type: MenuTypes.detail
      },
      {
        key: 'ending',
        label: 'End of Game',
        type: MenuTypes.detail
      }
    ]
  },
  phases: {
    title: 'Game phases',
    data: [
      {
        key: 'day',
        label: 'Day',
        type: MenuTypes.detail
      },
      {
        key: 'trial',
        label: 'Trial',
        type: MenuTypes.detail
      },
      {
        key: 'night',
        label: 'Night',
        type: MenuTypes.detail
      }
    ]
  }
}

const DetailTypes = {
  subtitle: 'detail/subtitle',
  text: 'detail/text',
  note: 'detail/note',
  image: 'detail/image',
  button: 'detail/button'
}

const Details = {
  about: {
    title: 'About the App',
    data: [
      {
        type: DetailTypes.text,
        payload: "Pigeonhole'd! is as an expansion to the classic game of Mafia. The app itself functions as a standalone game, and does not require a physical copy of the game or any other purchases.",
      },
      {
        type: DetailTypes.text,
        payload: "Pigeonhole'd! is a social game which combines Strategy, Logic, and Deception, to deliver a unique experience between you and your friends! If you have not played Mafia before, make sure to review instructions under 'How to play'.",
      },
      {
        type: DetailTypes.button,
        payload: "How to Play",
        route: "general"
      },
      {
        type: DetailTypes.note,
        payload: "Best played in groups of 6+",
      },
      {
        type: DetailTypes.note,
        payload: "Everyone must have the app installed.",
      },
      {
        type: DetailTypes.note,
        payload: "Internet connection required.",
      },
      {
        type: DetailTypes.note,
        payload: "Narrator not required.",
      }
    ],
  },
  intro: {
    title: 'About the Game',
    data: [
      {
        type: DetailTypes.text,
        payload: "This game takes place in a small town, with a hidden gang of Mafia members that threaten its peaceful nature."
      },
      {
        type: DetailTypes.text,
        payload: "However, the townsfolk are not completely powerless. They outnumber the Mafia, forcing the Mafia to remain hidden until enough of the townsfolk have been disposed of.",
      },
      {
        type: DetailTypes.text,
        payload: "Every day, the Townsfolk will try to hang a member of the mafia, and every night, the Mafia will decide who to kill next.",
      },
      {
        type: DetailTypes.text,
        payload: "It is only a matter of time before one side prevails! Which will it be?",
      }
    ]
  },
  general: {
    title: 'General',
    data: [
      {
        type: DetailTypes.text,
        payload: "In order to start a game, one person needs to create a room so all the other players can join."
      },
      {
        type: DetailTypes.text,
        payload: "The room owner will be given a 6-digit room code that will allow other players to join the same room, where they will be prompted for their names."
      },
      {
        type: DetailTypes.text,
        payload: "We recommend the room owner to be the person with the most reliable internet connection."
      },
      {
        type: DetailTypes.subtitle,
        payload: "If you are unfamiliar with Rooms, you can find out more details on Making and Joining rooms below."
      },
      {
        type: DetailTypes.button,
        payload: "Making a Room",
        route: "making"
      },
      {
        type: DetailTypes.button,
        payload: "Joining a Room",
        route: "joining"
      },
      {
        type: DetailTypes.text,
        payload: "Each game can be setup differently, so you should take into account the number of players and the overall level of experience."
      },
      {
        type: DetailTypes.text,
        payload: "Before starting a game, read our guide on how to balance Character Selection."
      },
      {
        type: DetailTypes.button,
        payload: "Character Selection",
        route: "selection"
      },
      {
        type: DetailTypes.text,
        payload: "The game structure is characterized by three main phases, and all events that occur will follow this cycle until the game ends."
      },
      {
        type: DetailTypes.subtitle,
        payload: "If you are unfamiliar with the game structure, take a look the 'Game Info' section."
      },
      {
        type: DetailTypes.button,
        payload: "Game Info",
        route: "gameInfo"
      }
    ]
  },
  making: {
    title: 'Making a Room',
    data: [
      {
        type: DetailTypes.text,
        payload: "Pressing 'Make a Room' on the home screen will walk you through the entire process. There are 4 steps before your room is ready to go!"
      },
      {
        type: DetailTypes.subtitle,
        payload: "Enter your name."
      },
      {
        type: DetailTypes.text,
        payload: "Use a name that people can easily identify you with. Must be 5 - 10 characters in length."
      },
      {
        type: DetailTypes.text,
        payload: "Specify the total number of players."
      },
      {
        type: DetailTypes.text,
        payload: "Select your level of experience. "
      },
      {
        type: DetailTypes.text,
        payload: "Selecting your level of experience will not have any effect once the game starts. "
      },
      {
        type: DetailTypes.text,
        payload: "We will give you recommendations for Role Selection based on your level of experience."
      },
      {
        type: DetailTypes.text,
        payload: "Choose Roles."
      },
      {
        type: DetailTypes.text,
        payload: "Once you have completed these steps, you are ready to start! Wait for everyone to join the room. If all the numbers match up, you will be able to start the game."
      }
    ]
  },
  joining: {
    title: 'Joining a Room',
    data: [
      {
        type: DetailTypes.text,
        payload: "Pressing ‘Join a Room’ on the home screen will prompt you to enter the room code."
      },
      {
        type: DetailTypes.text,
        payload: "Get the code from either the room owner or other players that have joined the room."
      },
      {
        type: DetailTypes.text,
        payload: "Once you have joined, enter your name!"
      },
      {
        type: DetailTypes.text,
        payload: "Use a name that people can easily identify you with, 5 - 10 characters in length."
      },
      {
        type: DetailTypes.text,
        payload: "after choosing your name, wait for the owner to start the game."
      }
    ]
  },
  pickingRoles: {
    title: 'Role set-up',
    data: [
      {
        type: DetailTypes.text,
        payload: "Recommended"
      },
      {
        type: DetailTypes.text,
        payload: "balancing"
      }
    ]
  },
  role: {
    title: 'Your Role',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  day: {
    title: 'Day Phase',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  trial: {
    title: 'Trial Phase',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  night: {
    title: 'Night Phase',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  profile: {
    title: 'Your Role',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  events : {
    title: 'Game Events',
    data: [
      {
        type: DetailTypes.text,
        payload: "Coming Soon"
      },
      {
        type: DetailTypes.text,
        payload: "Coming soon"
      }
    ]
  },
  ending: {
    title: 'Ending the Game',
    data: [
      {
        type: DetailTypes.text,
        payload: "The Mafia wins when the number of Mafia members is equal to or greater than the number of Townspeople."
      },
      {
        type: DetailTypes.text,
        payload: "At this point, the townspeople cannot successfully lynch any more Mafia members because they would not be able to reach a majority vote."
      },
      {
        type: DetailTypes.text,
        payload: "The Town wins when every Mafia member has been killed or hung"
      },
      {
        type: DetailTypes.text,
        payload: "Neutral players win when they reach their win condition."
      },
      {
        type: DetailTypes.text,
        payload: "The game does not end if this happens, so regardless of if the Neutral player wins or not, either Town or Mafia will still end up victorious. However, it will be much more difficult for the Town to win in this case."
      }
    ]
  }
}

export {
  ScreenTypes, 
  Screens,
  MenuTypes,
  Menus,
  DetailTypes,
  Details
}