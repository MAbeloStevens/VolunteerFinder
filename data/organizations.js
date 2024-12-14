import { ObjectId } from "mongodb";
import { accounts, organizations } from "../config/mongoCollections.js";
import { o_idRenameField } from "../helpers/helpers.js";
import id_validation from "../helpers/id_validation.js";
import validation from '../helpers/validation.js';
import accountsFunctions from "./accounts.js";
import knownTagsFunctions from './knownTags.js';

const organizationFunctions ={
    async getOrganizationPageData(o_id, currentUser_id){
        //an extra parameter currentUser_id for comment and review deletion permissions
        //Given o_id, return data required for organization page elements
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await id_validation.checkOrganizationID(o_id);

        if(currentUser_id){
            currentUser_id = await id_validation.checkID(currentUser_id,"Account");
            //to make sure the account exist
            const user= await accountsFunctions.getAccount(currentUser_id);
        }

        //get organization
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOne({_id: new ObjectId(o_id)});
        if(!organizationData) throw 'No organization with that ID'


        let commentsDisplay = await Promise.all(organizationData.comments.map(async (comment) => ({
            comment_id: comment.id,
            author: await accountsFunctions.getAccountFullName(comment.author),
            body:comment.body,
            //not sure about the page data can delete stuff, because i would need the users ID (currentUser_id) to remove that 
            canDelete: currentUser_id ? (currentUser_id === comment.author ||  currentUser_id === organizationData.adminAccount) : false,
        })));
        let reviewsDisplay = await Promise.all(organizationData.reviews.map(async (review) => ({
            review_id: review.id,
            author: await accountsFunctions.getAccountFullName(review.author),
            rating: review.rating,
            body:review.body,
            //again not sure what to do about the can delete stuff, because  i would need the users (currentUser_id)  ID to remove that 
            canDelete: currentUser_id ? (currentUser_id === review.author || currentUser_id === organizationData.adminAccount) : false,
        })));
        //this is the stuff we are going to return based on the document.
        const pageData= {
            adminAccount: organizationData.adminAccount,
            name: organizationData.name,
            bannerImg: organizationData.bannerImg,
            interestCount: organizationData.interestCount,
            //adding this new field isInterested
            isInterested: organizationData.interestedAccounts.includes(currentUser_id),
            tags: organizationData.tags,
            description: organizationData.description,
            contact: organizationData.contact,
            link: organizationData.link,
            comments: commentsDisplay,
            reviews: reviewsDisplay
        };
        return pageData;
    },

    async getOrganizationName(o_id){
        //given o_id, get organization info {name, tags, description, bannerImg, contact, link}
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await id_validation.checkOrganizationID(o_id);
        //get organization
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOne(
            {_id: new ObjectId(o_id)},
            {projection: {_id: 1, name: 1}}
        );
        if(!organizationData) throw 'No organization with that ID'
        return o_idRenameField(organizationData);
    },

    async getOrganizationEditInfo(o_id){
        //given o_id, get organization info {name, tags, description, bannerImg, contact, link}
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await id_validation.checkOrganizationID(o_id);
        //get organization
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOne(
            {_id: new ObjectId(o_id)},
            {projection: {_id: 1, adminAccount: 1, name: 1, tags: 1, description: 1, bannerImg: 1, contact: 1, link: 1}}
        );
        if(!organizationData) throw 'No organization with that ID'
        return o_idRenameField(organizationData);
    },

    async getOrganizationsInterest(o_idList){
        //Given list of o_ids, return list of projections containing o_id, name, interestedAccounts, interestCount
        //this is some error checking 
        if(!o_idList) throw  'Organization ids are not provided, please input ID!'
        if(!Array.isArray(o_idList)) throw "Organization ids must be type array"
        if (o_idList.length === 0) return [];
        //seems like if I want to do it via a map thing i need to use Promise.all
        o_idList= await Promise.all(o_idList.map((o_id)=> id_validation.checkOrganizationID(o_id)))
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
        .find(
            {_id: {$in: o_idList.map((o_id) => new ObjectId(o_id))}}
        )
        .project({_id: 1, name: 1, interestedAccounts: 1, interestCount: 1})
        .toArray();
        //turn the id's into strings
        if (organizationsList.length===0) throw "No organizations from the list exists!";
        organizationsList= organizationsList.map((org) =>{
            org._id= org._id.toString();
            return o_idRenameField(org);
        });
        return organizationsList;
    },
    
    async getOrganizationsTags(o_idList) {
        //Given list of o_ids, return list of projections containing, o_id, name, tags, interestCount
        //this is some error checking 
        if(!o_idList) throw  'Organization ids are not provided, please input ID!'
        if(!Array.isArray(o_idList)) throw "Organization ids must be type array"
        if (o_idList.length === 0) return [];
        //seems like if I want to do it via a map thing i need to use Promise.all
        o_idList= await Promise.all(o_idList.map((o_id)=> id_validation.checkOrganizationID(o_id)))
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
        .find(
            {_id: {$in: o_idList.map((o_id) => new ObjectId(o_id))}}
        )
        .project({_id: 1, name: 1, tags: 1, interestCount: 1})
        .toArray();
        //turn them ids into strings
        if (organizationsList.length===0) throw "No organizations from the list exists!";
        organizationsList = organizationsList.map((org) => {
            org._id = org._id.toString();
            return o_idRenameField(org);
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
        newOrganization.adminAccount= await id_validation.checkAdminAccount(newOrganization.adminAccount);
        newOrganization.name= await validation.checkName(newOrganization.name);
        newOrganization.tags= await validation.checkTags(newOrganization.tags);
        const allTags = await knownTagsFunctions.getKnownTags();
        //TODO need to check if at least 1 tag is in knownTags
        newOrganization.tags = validation.properCaseTags(newOrganization.tags)
        const containsKnownTags = newOrganization.tags.filter((tag) => allTags.includes(tag))
        if(containsKnownTags.length===0) throw "Must include one tag from known tags"
    
        newOrganization.description= await validation.checkDescription(newOrganization.description);
        newOrganization.contact = await validation.checkContact(newOrganization.contact);
    
        let bannerImg= undefined;
        //optional fields
        if(newOrganization.bannerImg!==undefined) {
            //this should be a file object, we will be using some middleware named Multer during the route to put this file 
            try{
                bannerImg= await validation.validateFile(newOrganization.bannerImg);
            }catch(e){
                throw `Image validation failed: ${e}`;
            }
        }
        
        let link= undefined;
        if(newOrganization.link!==undefined) {
            link= await validation.checkLink(newOrganization.link);
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
            contact:newOrganization.contact,
            link:link
        };
        //grab collection
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection';
        const insertOrganization= await organizationCollection.insertOne(organization);
        if(!insertOrganization.acknowledged || !insertOrganization.insertedId) throw "Could not add Organization"
        return insertOrganization.insertedId.toString() //not sure, will change this
    },

    async getRecommendedOrgs(tags, a_id){
        //Given list of tags, return list of o_ids for the top 10 organizations. Prioritizing organizations with more matching tags, then of higher interest count (call the function getRecommendedOrgs(tags)) 

        if(!tags) throw  'Organization tags are not provided, please input tags!'
        if(!Array.isArray(tags)) throw "Organization tags must be type array"
        if (tags.length === 0) throw "Please provide tags!" //could be return []
        
        if(!a_id) throw 'Account id is not provided, please input ID!'
        a_id = await id_validation.checkID(a_id,"Account");
        //validate these tags 
        tags= await validation.checkTags(tags)
        tags= validation.properCaseTags(tags)
        const accountCollection = await accounts()
        if(!accountCollection) throw 'Failed to connect to organization collection'; 
        const accountInfo = await accountCollection.findOne({_id: new ObjectId(a_id)})
        const excludedOrgIds = accountInfo.interestedOrgs
        const organizationCollection= await organizations()
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        let organizationsList= await organizationCollection
        .aggregate([
            //excludes prexisting organizations 
            {$match: {_id: {$nin: excludedOrgIds.map(id => new ObjectId(id))}}},
            //basically makes a field seeing how many of tags match  in the organization to the list 
            {$addFields:{numberOfTagsMatch: {$size: {$setIntersection: ["$tags", tags]}}}}, 
            //first sort by number of matching tags then by interest count
            {$sort: {numberOfTagsMatch: -1, interestCount:-1}},
            //only o_ids
            {$project:{_id:1}},
            //give me 10
            {$limit:10},
        ]).toArray()
        return organizationsList.map((org)=> org._id.toString())
    },

    async getMostInterestedOrgs(){
        // Given nothing, return 10 organizations with the highest interest count (call the function getMostInterestedOrgs() )
        //grab collections
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection';
        const organizationsList = await organizationCollection
            .find({})
            .sort({interestCount:-1}) //we want to highest to lowest
            .limit(10)  //following Mark's instructions
            .project({_id:1})  
            .toArray();
        return organizationsList.map((org)=> org._id.toString())
    },
    
    /*
        These are mostly assumptions from the Page Blue print files.
        o_id: Object ID required
        name: string (required)
        tags: array (required)
        bannerImg: image file type (seems optional)
        description: string (required)
        contact: string (required)
        link: string (url) (optional)
    */
    async updateOrganization(o_id, name, tags, bannerImg, description, contact, link) {
        //checking ID name, and tags, description and contact since they are required.
        if (!o_id) throw 'Organization ID is not provided. Please input a valid ID!';
        o_id = await id_validation.checkOrganizationID(o_id);
        name = await validation.checkName(name);
        tags = await validation.checkTags(tags);
        const allTags = await knownTagsFunctions.getKnownTags();
        //ensure at least one tag is in knownTags
        tags = validation.properCaseTags(tags);
        const containsKnownTags = tags.filter((tag) => allTags.includes(tag));
        if (containsKnownTags.length === 0) throw "Must include at least one tag from known tags.";
        description = await validation.checkDescription(description);
        contact = await validation.checkContact(contact);
    
        //optional tags now 
        let processedBannerImg = undefined;
        if (bannerImg !== undefined) {
            try {
                await validation.checkImg(bannerImg);
                processedBannerImg = `/public/images/${bannerImg.filename}`;
            } catch (e) {
                throw `Image validation failed: ${e}`;
            }
        }
    
        let processedLink = undefined;
        if (link !== undefined) {
            processedLink = await validation.checkLink(link);
        }
    
        // Create the update object dynamically
        const updateFields = {
            name,
            tags,
            description,
            contact,
        };
    
        if (processedBannerImg) updateFields.bannerImg = processedBannerImg;
        if (processedLink) updateFields.link = processedLink;
    
        // Update the organization in the database
        const organizationCollection = await organizations();
        if (!organizationCollection) throw 'Failed to connect to organization collection.';
        const updateInfo = await organizationCollection.findOneAndUpdate(
            { _id: new ObjectId(o_id) },
            { $set: updateFields },
            { returnDocument: 'after' }
        );
    
        if (updateInfo.modifiedCount === 0) throw 'Could not update the organization successfully.';
        //not sure but this seems fine
        return o_id;
    },
        
    async deleteOrganization(o_id){
        //delete Organization given o_id
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id= await id_validation.checkOrganizationID(o_id);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const organizationData =  await organizationCollection.findOneAndDelete({_id: new ObjectId(o_id)});
        if(!organizationData) throw 'Cannot delete organization';
        return `${organizationData.name} have been successfully deleted!`;
    },

    async addInterestedAccount(o_id, a_id){
        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!a_id) throw 'Account id is not provided, please input ID!'

        o_id= await id_validation.checkOrganizationID(o_id);
        a_id = await id_validation.checkID(a_id,"Account");
        //add the organization to the account's interestedOrgs
        const user= await accountsFunctions.addInterestedOrg(a_id, o_id);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!';
        const updateInfo = await organizationCollection.findOneAndUpdate(
            { _id: new ObjectId(o_id) },
            {$inc: {interestCount: 1},$push: {interestedAccounts: a_id}},
            { returnDocument: 'after' }
        );

        if (updateInfo.modifiedCount === 0) throw 'Could not update the organization successfully.';
        //not sure but this seems fine
        return o_id;
    },
    async removeInterestedAccount(o_id, a_id){
        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!a_id) throw 'Account id is not provided, please input ID!'

        o_id= await id_validation.checkOrganizationID(o_id);
        a_id = await id_validation.checkID(a_id,"Account");
        //remove the organization from the account's interestedOrgs
        const user= await accountsFunctions.removeInterestedOrg(a_id, o_id);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!';
        //check to see if this account is in the array
        const getOrg = await organizationCollection.findOne({_id: new ObjectId(o_id), interestedAccounts:{$in: [a_id]}})
        if(!getOrg) throw "Account Id is not insterest in this organization!"
        else{
            const updateInfo = await organizationCollection.findOneAndUpdate(
                { _id: new ObjectId(o_id) },
                {$inc: {interestCount: -1},$pull: {interestedAccounts: a_id}},
                { returnDocument: 'after' }
            );
            if (updateInfo.modifiedCount === 0) throw 'Could not update the organization successfully.';
            //not sure but this seems fine
            return o_id;
        }
    }
}
export default organizationFunctions;
