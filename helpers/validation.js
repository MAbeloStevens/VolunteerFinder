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
        if(trimmedOrganizationName.length>100) throw  'Organaization name is too long, please it under 100 characters!'
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

    async checkEmail(email){
        //basic string checks
        if(typeof email !== 'string') throw 'Email is not a string!';
        const trimmedEmail = email.trim();
        if(trimmedEmail.length ===0) throw 'Email cannot be empty!';
        //pattern matches on email seemed like the easiest way to do this
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!pattern.test(trimmedEmail)) throw 'Email provided is not valid';
        return trimmedEmail;
    },

    async checkPhone(phoneNumber){
        if(typeof phoneNumber !== 'string') throw "Phone number is not a string!";
        const trimmedPhoneNumber= phoneNumber.trim();
        if(trimmedPhoneNumber.length ===0) throw 'Phone number cannot be empty!';
        //yoinked pattern from here: https://www.geeksforgeeks.org/how-to-validate-phone-numbers-using-javascript-with-regex/
        const pattern = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
        if(!pattern.test(trimmedPhoneNumber)) throw 'Phone number provided is not valid';
        return trimmedPhoneNumber
    },

    async checkContact(contactInfo){
        //basic string checks
        if(typeof contactInfo !=='string') throw 'Organization contact information is not a string!';
        const trimmedContactInfo= contactInfo.trim();
        if(trimmedContactInfo.length===0) throw 'Organization contact information cannot be empty!';
        //based on db proposal we are splitting by newline
        const seperate = trimmedContactInfo.split('\n');
        //check each invidually
        const trimmedEmail= await checkEmail(seperate[0]);
        const trimmedPhone= await checkPhone(seperate[1]);
        //put them back together
        return trimmedEmail+'\n'+trimmedPhone;
    },
    
    async checkImg(bannerImg){
      //TODO make function that verifies file is an image
      //currently avoiding this, I will come back I need to test if I can add these entries to the db first
    }

};

export default validation;

