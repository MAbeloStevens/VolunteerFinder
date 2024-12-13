// given an object containing field _id, returns the same object with that field renamed to a_id 
function a_idRenameField(obj) {
    const newObj = {};
    for (let k of Object.keys(obj)){
        if (k === '_id') newObj['a_id'] = obj[k];
        else newObj[k] = obj[k];
    }
    return newObj;
};

// given an object containing field _id, returns the same object with that field renamed to o_id 
function o_idRenameField(obj) {
    const newObj = {};
    for (let k of Object.keys(obj)){
        if (k === '_id') newObj['o_id'] = obj[k];
        else newObj[k] = obj[k];
    }
    return newObj;
};

export { a_idRenameField, o_idRenameField };