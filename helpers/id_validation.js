import { ObjectId } from "mongodb";

const id_validation = {
    //I am not sure how we are sending the adminAccount info this might be unnecessarry but oh well 

    async checkOrganizationID(o_id){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof o_id !== 'string') throw 'Organization ID is not a string!';
        const trimmedO_ID = o_id.trim();
        if(trimmedO_ID.length===0) throw 'Organization ID is empty!';
        if(!ObjectId.isValid(trimmedO_ID)) throw 'Organization ID is an invalid object id';
        return trimmedO_ID;
    },

    async checkID(id, category){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof id !== 'string') throw `${category} ID is not a string!`;
        id = id.trim();
        if(id.length===0) throw `${category} ID is empty!`;
        if(!ObjectId.isValid(id)) throw `${category} ID is an invalid object id`;
        return id;
    },

    async checkAdminAccount (adminAccount_ID){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof adminAccount_ID !== 'string') throw 'Admin Account ID is not a string!';
        const trimmedAdminAccount_ID = adminAccount_ID.trim();
        if(trimmedAdminAccount_ID.length===0) throw 'Admin Account ID is empty!';
        if(!ObjectId.isValid(trimmedAdminAccount_ID)) throw 'Admin Account ID is an invalid object id';
        return trimmedAdminAccount_ID;
    }
};

export default id_validation;
