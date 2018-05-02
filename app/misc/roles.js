export const Roles = {

    a : {
        index : 0,
        name : "Assassin",
        rules : "Choose a player to kill. If inspected by the Detective, the Assassin will not appear suspicious.",
        targetTown : true,
        type : 1,
        "visits" : true
    },
    b : {
        index : 1,
        name : "Murderer",
        rules : "Choose a player to kill.",
        sus : true,
        targetTown : true,
        type : 1,
        "visits" : true
    },
    c : {
        index : 2,
        name : "Thug",
        rules : "This role does not perform any actions.",
        sus : true,
        type : 1
    },
    d : {
        index : 3,
        name : "Schemer",
        rules : "Choose a player to frame. If the selected player is inspected by the detective in the same night, they will appear suspicious.",
        sus : true,
        targetTown : true,
        type : 1,
        "visits" : true
    },
    e : {
        index : 4,
        name : "Spy",
        rules : "Choose a player and find out what their role is.",
        sus : true,
        targetTown : true,
        type : 1,
    },
    ed : {
        index : 5,
        name : "Schemer / Spy",
        rules : "",
        sus : true,
        type : 1
    },
    f : {
        index : 6,
        name : "Mystic",
        rules : "Choose a player and make them forget anything that happened that night.",
        sus : true,
        targetTown : true,
        type : 1,
    },
    g : {
        index : 7,
        name : "Silencer",
        rules : "Choose a player and stop them from talking for the next day.",
        sus : true,
        type : 1,
    },
    gf : {
        index : 8,
        name : "Mystic / Silencer",
        rules : "",
        sus : true,
        type : 1
    },
    
    a : {
        index : 0,
        name : "Detective",
        rules : "Choose a player and discover if they are suspicious or not.",
        type : 2,
    },
    b : {
        index : 1,
        name : "Investigator",
        rules : "Choose a player and search for clues.",
        type : 2,
    },
    C : {
        index : 2,
        name : "Villager",
        rules : "Learn from other town members.",
        type : 2,
    },
    D : {
        index : 3,
        name : "Doctor",
        rules : "Choose someone to take care of. If they are attacked by the mafia that night, they will not die.",
        type : 2,
    },
    E : {
        index : 4,
        name : "Escort",
        rules : "Choose a player and stop them from performing their action.",
        type : 2,
    },
    G : {
        index : 5,
        name : "Warden",
        rules : "Choose a player and watch their house. If anyone visits the selected player, the warden will be alerted.",
        type : 2,
    },
    H : {
        index : 6,
        name : "Hunter",
        rules : "You ran out of bullets.",
        type : 2,
    },
    I : {
        index : 7,
        name : "Overseer",
        rules : "Choose a player to see if they visit anyone that night. If the target goes to another players house, the Overseer will be notified.",
        type : 2,
    },
    J : {
        index : 8,
        name : "Hunter",
        rules : "Choose to shoot another player. You are limited to performing this action once per game.",
        type : 2,
    },
    K : {
        index : 9,
        name : "Disguiser",
        rules : "Choose to copy the role of a dead player. The Disguiser is limited to choosing a dead Town person.",
        "targetdead" : true,
        targetTown : true,
        type : 2,
    },
      
}