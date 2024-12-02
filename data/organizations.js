import { ObjectId } from "mongodb";
import { organizations } from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';
import knownTagsFunctions from './knownTags.js';

const organizationFunctions ={
    async getOrganizationPageData(o_id){ //an extra parameter currentUser_id
        //Given o_id, return data required for organization page elements
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await validation.checkOrganizationID(o_id);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOne({_id: new ObjectId(o_id)});
        if(!organizationData) throw 'No organization with that ID'
        //this is the stuff we are going to return based on the document.
        const pageData={
            name: organizationData.name,
            bannerImg: organizationData.bannerImg,
            interestCount: organizationData.interestCount,
            tags: organizationData.tags,
            description: organizationData.description,
            contact: organizationData.contact,
            link: organizationData.link,
            comments: organizationData.comments.map((comment)=>({
                author:comment.author,
                body:comment.body,
                //not sure about the page data can delete stuff, because i would need the users ID (currentUser_id) to remove that 
                //canDelete: currentUser ? (currentUser_id === comment.author ||  currentUser._id === organizationData.adminAccount) : false,
            })),
            reviews: organizationData.reviews.map((review) => ({
                author:review.author,
                rating: review.rating,
                body:review.body,
                //again not sure what to do about the can delete stuff, because  i would need the users (currentUser_id)  ID to remove that 
                //canDelete: currentUser ? (currentUser._id === review.author || currentUser._id === organizationData.adminAccount) : false,
            }))
        };
        return pageData;
    },

    async getOrganizationsInterest(o_idList){
        //Given list of o_ids, return list of projections containing o_id, name, interestedAccounts
        //this is some error checking 
        if(!o_idList) throw  'Organization ids are not provided, please input ID!'
        if(!Array.isArray(o_idList)) throw "Organization ids must be type array"
        if (o_idList.length === 0) return [];
        //seems like if I want to do it via a map thing i need to use Promise.all
        o_idList= await Promise.all(o_idList.map((o_id)=> validation.checkOrganizationID(o_id)))
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
        .find(
            {_id: {$in: o_idList.map((o_id) => new ObjectId(o_id))}}
        )
        .project({_id: 1, name: 1, interestedAccounts: 1})
        .toArray();
        //turn them id's into strings
        if (organizationsList.length===0) throw "No organizations from the list exists!";
        organizationsList= organizationsList.map((org) =>{
            org._id= org._id.toString();
            return org;
        });
        return organizationsList
    },
    
    async getOrganizationsTags(o_idList) {
        //Given list of o_ids, return list of projections containing, o_id, name, tags
        //this is some error checking 
        if(!o_idList) throw  'Organization ids are not provided, please input ID!'
        if(!Array.isArray(o_idList)) throw "Organization ids must be type array"
        if (o_idList.length === 0) return [];
        //seems like if I want to do it via a map thing i need to use Promise.all
        o_idList= await Promise.all(o_idList.map((o_id)=> validation.checkOrganizationID(o_id)))
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
        .find(
            {_id: {$in: o_idList.map((o_id) => new ObjectId(o_id))}}
        )
        .project({_id: 1, name: 1, tags: 1})
        .toArray();
        //turn them ids into strings
        if (organizationsList.length===0) throw "No organizations from the list exists!";
        organizationsList = organizationsList.map((org) => {
            org._id = org._id.toString();
            return org;
        });
        return organizationsList;
    },

    async getOrganizationsWithTags(tags){
        //Given list of tags, return a list of organization ids that contain ANY of the tags
        //this is some error checking 
        if(!tags) throw  'Organization tags are not provided, please input tags!'
        if(!Array.isArray(tags)) throw "Organization tags must be type array"
        if (tags.length === 0) return [];
        tags= await validation.checkTags(tags)
        tags= validation.properCaseTags(tags)
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
            .find({tags:{$in :tags}})
            .project({_id: 1})
            .toArray();
        //could be one of the two
        if (organizationsList.length===0) return [] //throw "No organizations hold any of these tags!";
        //turn them ids into strings
        organizationsList= organizationsList.map((org) =>{
            org._id= org._id.toString()
            return org;
        });
        return organizationsList
    },

    async getOrganizationsWithAllTags(tags){
        //Given list of tags, return a list of organization ids that contain ALL of the tags
        if(!tags) throw  'Organization tags are not provided, please input tags!'
        if(!Array.isArray(tags)) throw "Organization tags must be type array"
        if (tags.length === 0) return [];
        tags= await validation.checkTags(tags)
        tags= validation.properCaseTags(tags)
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
            .find({tags:{$all :tags}})
            .project({_id: 1})
            .toArray();
        //could be one of the two
        if (organizationsList.length===0) return [] //throw "No organizations hold any of these tags!";
        //turn them ids into strings
        organizationsList= organizationsList.map((org) =>{
            org._id= org._id.toString()
            return org;
        });
        return organizationsList
    },

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
    async createOrganziation(newOrganization){
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
            comments:[],
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
    },
    
    /*
        These are mostly assumptions from the Page Blue print files.
        o_id: Object ID required
        org_name: string (optional)
        tags: array (optional)
        bannerImg: image file type (seems optional)
        description: string (optionak)
        contact: string (optional)
        link: string (url) (optional)
    */
    async updateOrganization(o_id, org_name, tags, bannerImg, description, contact, link){
        //update Organization,
        console.log("Implement Me")
    },

    async deleteOrganization(o_id){
        //delete Organization given o_id
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await validation.checkOrganizationID(o_id);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOneAndDelete({_id: new ObjectId(o_id)});
        if(!organizationData) throw 'Cannot delete organization';
        return `${organizationData.name} have been successfully deleted!`;
    }
}
export default organizationFunctions;