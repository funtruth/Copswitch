function sortRoles(roles) {
    let rolesArr = []
    for (var roleId in roles) {
        rolesArr.push({
            key: roleId,
            count: roles[roleId]
        })
    }
    return rolesArr
}


export {
    sortRoles
}