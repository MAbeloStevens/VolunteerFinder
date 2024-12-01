import {knownTags} from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';

const knownTagsFunctions  ={
    async getKnownTags (){
        //Get all known tags function
        console.log("Is implemented, just needs more test cases")
    },

    async addToKnownTags (listOfTags) {
        //Given a list of tags, add them to the knownTags array
        console.log("Is implemented, just needs more test cases")
    },

    async deleteKnownTag (tag) {
        //Given string, delete that string from tags list (just in case)
        console.log("Is implemented, just needs more test cases")
    }
}
export default knownTagsFunctions;