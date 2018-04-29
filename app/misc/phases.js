export const Phases = [
    
    {
        name : 'NIGHT',
        message : 'Visit another Player',
        buttonOne : 'Visit',
        buttonTwo : 'Sleep',
        continue : -2
    },
    {
        name : 'DAY',
        message : 'Choose an Option',
        buttonOne : 'Vote',
        buttonTwo : 'Abstain',
        continue : 2,
        trigger : 1
    },
    {
        name : 'LYNCHING',
        message : 'has been nominated',
        buttonOne : 'Innocent',
        buttonTwo : 'Guilty',
        continue : -1,
        trigger : 1
    }
    
]
  
  