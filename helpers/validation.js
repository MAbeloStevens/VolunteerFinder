import { ObjectId } from "mongodb";

const validation = {
    //I am not sure how we are sending the adminAccount info this might be unnecessarry but oh well 

    async checkAdminAccount (adminAccount_ID){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof adminAccount_ID !== 'string') throw 'Admin Account ID is not a string!';
        const trimmedAdminAccount_ID = adminAccount_ID.trim();
        if(trimmedAdminAccount_ID.length===0) throw 'Admin Account ID is empty!';
        if(!ObjectId.isValid(adminAccount_ID)) throw 'Admin Account ID is an invalid object';
        return trimmedAdminAccount_ID;
    },

    async checkName(organizationName){
        //basic string check
        if(typeof organizationName !=='string') throw 'Organization name is not a string!';
        const trimmedOrganizationName= organizationName.trim();
        if(trimmedOrganizationName.length===0) throw 'Organization name cannot be empty!';
        return trimmedOrganizationName;
    },

    async checkTags(tags){
        //checks to see if the tags are in a array
        if(!Array.isArray(tags)) throw 'Tags are not in an Array';
        if(tags.length===0) throw  'Organization must have at least 1 tag';
        //check tags individually. 
        tags.forEach((tag) =>{
            if (typeof tag !=='string' || tag.trim() ===0)  throw "Organization tag can not be empty strings"
        });
        //trim all tags
        return tags.map((tag) => tag.trim());
    },

    async checkDescription(description){
        //basic string checks
        if(typeof description !=='string') throw 'Organization description is not a string!';
        const trimmedDescription= description.trim();
        if(trimmedDescription.length===0) throw 'Organization description cannot be empty!';
        return trimmedDescription;
    },

    async checkContact(contactInfo){
        //basic string checks
        if(typeof contactInfo !=='string') throw 'Organization contact information is not a string!';
        const trimmedContactInfo= contactInfo.trim();
        if(trimmedContactInfo.length===0) throw 'Organization contact information cannot be empty!';
        //might add addtional regex tests here for the the email and phone number
        return trimmedContactInfo;
    },

};

export default validation;