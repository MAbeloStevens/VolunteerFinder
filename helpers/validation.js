const validation = {

    async checkName(name){
        //basic string check
        if(typeof name !=='string') throw 'Name is not a string!';
        const trimmedName= name.trim();
        if(trimmedName.length===0) throw 'Name cannot be empty!';
        if(trimmedName.length>100) throw  'Name is too long, please keep it under 100 characters!'
        return trimmedName;
    },

    // async checkName(name, varName){
    //     //basic string check
    //     if(typeof name !=='string') throw `${varName} is not a string!`;
    //     const trimmedName= name.trim();
    //     if(trimmedName.length===0) throw `${varName} cannot be empty!`;
    //     if(trimmedName.length>100) throw  `${varName} is too long, please keep it under 100 characters!`
    //     return trimmedName;
    // },

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
        if(trimmedDescription.length > 1000) throw 'Description is too long, please keep it under 1000 characters!'
        return trimmedDescription;
    },

    async checkComment(comment){
        //basic string checks
        if(typeof comment !=='string') throw 'Comment body is not a string!';
        const trimmedComment= comment.trim();
        if(trimmedComment.length===0) throw 'Comment body cannot be empty!';
        if(trimmedComment.length > 1000) throw 'Comment is too long, please keep it under 1000 characters!'
        return trimmedComment;
    },

    async checkReview(review){
        //basic string checks
        if(typeof review !=='string') throw 'Review body is not a string!';
        const trimmedReview= review.trim();
        if(trimmedReview.length===0) throw 'Review body cannot be empty!';
        if(trimmedReview.length > 1000) throw 'Review is too long, please keep it under 1000 characters!'
        return trimmedReview;
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
        if(trimmedContactInfo.length > 500) throw 'Contact info body is too long, please keep it under 500 characters!'
        return trimmedContactInfo;
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

        if(!bannerImg || typeof bannerImg !== 'object') throw "No image provided!"
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
        return password
    },
};

export default validation;

