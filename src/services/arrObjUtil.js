
//arrObjUtil mainly used to format lists / arrays / objects to standard format.

/*
joins [a, b] and {a:{}, b:{}} => [{}, {}]
*/
const join = (a, b) => {
    let c = []
    for (var i=0; i<a.length; i++) {
        b[a[i]] && c.push(b[a[i]])
    }
    return c
}

export {
    join
}