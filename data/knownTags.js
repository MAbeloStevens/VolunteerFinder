import { knownTags } from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';

const knownTagsFunctions  ={
    async getKnownTags (){
        //go to DB and grab the single entry 
        const tagsCollection = await knownTags();
        const tagList = await tagsCollection.findOne({});
        if (!tagsCollection) throw 'Failed to connect to the KnownTags collection';
        if(!tagList) throw 'Could not get known tags'
        //i am assuming we only need the list 
        return tagList ? tagList.tags : [];
    },
    
    async addToKnownTags (listOfTags) {
        //check listOfTags, which will be appended to the existing tags
        if(!listOfTags) throw  'No additonal tags were provided'
        
        const tagsCollection = await knownTags();
        if (!tagsCollection) throw 'Failed to connect to the KnownTags collection';

        //this wasn't really clarified IDK for sure
        //lets normalize these tags (this was shown in the db proposal)
        const verifiedTags= await validation.checkTags(listOfTags)
        const normalizeTags= validation.properCaseTags(verifiedTags) 

        const tagList = await tagsCollection.findOne({});
        //insert new object in collection
        if(!tagList){
            //remove duplicates and add to tag collections
            const insertedTags=await tagsCollection.insertOne({tags:Array.from(new Set([...normalizeTags]))})
            if (!insertedTags.acknowledged) throw new Error("Failed to insert new tags");
            //not really sure what i should exactly return but this should be fine????
            return insertedTags
        }
        else{
            //normalize existing tags not sure if we need this but eh
            const existingTags= validation.properCaseTags(tagList.tags)
            //remove duplicates and concat two arrays together
            const updateTags= Array.from(new Set([...existingTags,...normalizeTags]));
            const updatingTagsDB = await tagsCollection.updateOne({},{$set: {tags:updateTags}});
            if (!updatingTagsDB.modifiedCount) throw new Error("Failed to update known tags");
            //again not sure
            return updatingTagsDB;
        }
    },
    
    async deleteKnownTag (tag) {
        //can be changed by a single string check, i am not sure who is doing it but yeah
        if(!tag) throw   'No tag was provided!'
        if(typeof tag !== 'string') throw 'Tag must be type string!';
        const trimTag= tag.trim();
        if(trimTag.length===0) throw 'Tag can not be empty!'

        //update it 
        const tagsCollection = await knownTags();
        const tagList = await tagsCollection.updateOne(
            {},
            {$pull: {tags: trimTag}}
        );
        if (!tagList.modifiedCount) throw new Error("Failed to update known tags, or these tags already exist in ");
        //this seems alright
        return await this.getKnownTags();
    }
}
export default knownTagsFunctions;