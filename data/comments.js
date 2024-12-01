import {organizations} from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';

const commentsFunctions = {

    // Function to create a new comment
    async createComment(o_id, comment) {
        //add a comment to the organization associated with the o_id
        /*
        o_id: string,
        comment: string
        returns comment_id
        */
    },

    async deleteComment(o_id, comment_id) {
        //removes the given comment_id from the organization's comment list
        /*
        o_id: string,
        comment_id: string
        returns boolean indicating success (or potentially the deleted comment???)
        */
    }


}

export default commentsFunctions;