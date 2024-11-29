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
        //check listOfTags, which will be appended to the 
        if(!listOfTags) throw  'No additonal tags were provided'
        const verifiedTags= await validation.checkTags(listOfTags)
        const tagList = await tagsCollection.findOne({});
        //this wasn't really clarified IDK for sure
        //lets normalize these tags (this was shown in the db proposal)
        const normalizeTags= verifiedTags.map((tag) => 
            tag.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase()+ word.slice(1)).join(' ')
        );
    
        //insert new object in collection
        if(!tagList){
            //remove duplicates and add to tag collections
            const insertedTags=await tagsCollection.insertOne({tags:Array.from(new Set([...normalizeTags]))})
            //not really sure what i should exactly return but this should be fine????
            return insertedTags
        }
        else{
            //normalize existing tags not sure if we need this but eh
            const existingTags= tagList.tags.map((tag) => 
                tag.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase()+ word.slice(1)).join(' ')
            );
            //remove duplicates and concat two arrays together
            const updateTags= Array.from(new Set([...existingTags,...normalizeTags]));
            const updatingTagsDB = await tagsCollection.updateOne({},{$set: {tags:updateTags}});
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
        //this seems alright
        return await this.getKnownTags;
    }
}
export default knownTagsFunctions;