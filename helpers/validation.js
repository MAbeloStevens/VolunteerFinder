import { ObjectId } from "mongodb";

const validation = {
    //I am not sure how we are sending the adminAccount info this might be unnecessarry but oh well 

    async checkOrganizationID(o_id){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof o_id !== 'string') throw 'Organization ID is not a string!';
        const trimmedO_ID = o_id.trim();
        if(trimmedO_ID.length===0) throw 'Organization ID is empty!';
        if(!ObjectId.isValid(trimmedO_ID)) throw 'Admin Account ID is an invalid object';
        return trimmedO_ID;
    },

    async checkID(id, category){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof id !== 'string') throw `${category} ID is not a string!`;
        id = id.trim();
        if(id.length===0) throw `${category} ID is empty!`;
        if(!ObjectId.isValid(id)) throw `${category} ID is an invalid object`;
        return id;
    },

    async checkAdminAccount (adminAccount_ID){
        //basic checks to see if we recieving a string, that is also a valid objectID
        if (typeof adminAccount_ID !== 'string') throw 'Admin Account ID is not a string!';
        const trimmedAdminAccount_ID = adminAccount_ID.trim();
        if(trimmedAdminAccount_ID.length===0) throw 'Admin Account ID is empty!';
        if(!ObjectId.isValid(trimmedAdminAccount_ID)) throw 'Admin Account ID is an invalid object';
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
    //Helper function because strings are stupid.
    //It will make sure the tag entires look like what they do in the proposal
    //example suppose a tag was 'race & ethnicity' or "raCe   & ethnicity " it will make sure its 'Race & Ethnicity' which will help filitering by tag
    properCaseTags(tags){
        const properTags = tags.map((tag) => {
            return tag
                .trim()
                .split(' ')
                .filter((word) => word.length !== 0)
                .map((word) => {
                    //this will check if the word has special characters or is an acronym
                    if (/[^a-zA-Z]/.test(word) || word.toUpperCase() === word)  return word
                    //else capitalize the first letter and lowercase the rest
                    else return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                })
                .join(' ');
        });
        return properTags;
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

    async checkString(string, category){
        if(typeof string !=='string') throw `${category} is not a string!`;
        string= string.trim();
        if(string.length===0) throw `${category} cannot be empty!`;
        return string;
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
        if(seperate.length!=2) throw'Contact information must include exactly one email and one phone number.';
        //check each invidually
        const trimmedEmail= await this.checkEmail(seperate[0]);
        const trimmedPhone= await this.checkPhone(seperate[1]);
        //put them back together
        return trimmedEmail+'\n'+trimmedPhone;
    },
    async checkLink(link){
        if(typeof link !=='string') throw 'Link is not a string!';
        link= link.trim();
        if(link.length===0) throw 'Link cannot be empy!';
        try{
            new URL (link);
            return link
        }catch(e){
            throw 'Link is not a valid URL!';
        }
    },


    async checkImg(bannerImg){
        //These are some allowed image types
        const allowedImageTypes =['image/jpeg', 'image/png'];
        const maxImageSize = 5*1024*1024; //its just 5MB

        if(!bannerImg) throw "No image provided!"
        const {mimetype, size} = bannerImg
        if (!allowedImageTypes.includes(mimetype)) {
            throw `Invalid file type! Allowed types are ${allowedImageTypes.join(',')}. `;
        }
        if (size> maxImageSize){
            throw `File is too large! Maximum image size allowed is 5MB!`
        }
        return true;
    },

    async checkPositiveNumber(number){
        //basic checks to see if we are sending a number, and that it is positive
        if (typeof number !== 'number') throw 'Given number is not a number';
        if (number < 0) throw 'Given number must be positive';
        return number;
    },

    async validRating(number){
        //checks to see if the rating is a number between 1 and 10
        if (typeof number !== 'number') throw 'Rating must be a number';
        if (number < 1 || number > 10) throw 'Rating must be between 1 and 10';
        return number;
    },

    async checkPassword(password) {
        //checks to see if the password is a string, and that it is at least 8 characters long
        if (typeof password!=='string') throw 'Password must be a string';
        if (password.length < 8) throw 'Password must be at least 8 characters long';
    }

};

export default validation;

