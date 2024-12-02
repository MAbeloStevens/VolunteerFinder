import { ObjectId } from "mongodb";

const validation = {
    checkID(id, paramName) {
        if (!id) throw `${paramName} must be provided`;
        if (typeof id !== 'string') throw `${paramName} is of an invalid type`;
        id = id.trim();
        if (id.length < 1) throw `${paramName} must not be empty or just spaces`;
        if (!ObjectId.isValid(id)) throw `${paramName} is an invalid object id`;
        return id;
    }
};

export default validation;