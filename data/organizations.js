import { organizations } from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';
import knownTagsFunctions from './knownTags.js';
/*
    newOranization - is an dictionary object which will hold all the information added by the user. 
    {
        adminAccount: ObjectID
        name: String
        tags: [] <- has Strings
        comment: [] <- has dictionaries
        reviews: [] <- has dictionaries
        interestedAccounts [] <- ObjectIDs
        interestCount: Number
        description: string
        bannerImg: string (path to image i am assuming we will do it during the post requst part)
        contact: string
        link: string <- idk if we need to verify if the url is valid
    }
*/
const createOrganziation= async(newOrganization) =>{
    //these are the required fields, check to see if those exist
    if(newOrganization.adminAccount===undefined) throw "Organization admin account required!";
    if(newOrganization.name===undefined) throw "Organization name required!";
    if(newOrganization.tags===undefined) throw "Organization tags required!";
    if(newOrganization.description===undefined) throw "Organization description required!";
    if(newOrganization.contact===undefined) throw "Organization contact information required!";

    //validation checks for required fields
     //skip that for now
    //newOrganization.adminAccount= await validation.checkAdminAccount(newOrganization.adminAccount);
    newOrganization.name= await validation.checkName(newOrganization.name);
    newOrganization.tags= await validation.checkTags(newOrganization.tags);
    const allTags = await knownTagsFunctions.getKnownTags();
    //TODO need to check if at least 1 tag is in knownTags
    newOrganization.tags = validation.properCaseTags(newOrganization.tags)
    const containsKnownTags = newOrganization.tags.filter((tag) => allTags.includes(tag))
    if(containsKnownTags.length===0) throw "Must include one tag from known tags"

    newOrganization.description= await validation.checkDescription(newOrganization.description);
    newOrganization.contact = await validation.checkContact(newOrganization.contact);

    let bannerImg= null;
    //optional fields
    if(newOrganization.bannerImg!==undefined) {
        //TODO maybe some valiation needs to happen here not sure yet
        bannerImg=newOrganization.bannerImg;
    }
    
    let link= null;
    if(newOrganization.link!==undefined) {
        //TODO maybe some validation is needs to happen to check if this even is a url
        link=newOrganization.link;
    }
    const organization={
        adminAccount:newOrganization.adminAccount,
        name:newOrganization.name,
        tags:newOrganization.tags,
        comment:[],
        reviews:[],
        interestedAccounts:[],
        interestCount:0,
        description:newOrganization.description,
        bannerImg:bannerImg,
        link:link
    };
    //grab collection
    const organizationCollection= await organizations();
    if(!organizationCollection) throw 'Failed to connect to organization collection';
    const insertOrganization= await organizationCollection.insertOne(organization);
    if(!insertOrganization.acknowledged || !insertOrganization.insertedId) throw "Could not add Organization"
    return true //not sure, will change this
}

export default createOrganziation;