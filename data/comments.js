import { ObjectId } from "mongodb";
import { organizations } from "../config/mongoCollections.js";
import id_validation from "../helpers/id_validation.js";
import validation from '../helpers/validation.js';
import accountsFunctions from "./accounts.js";
const commentsFunctions = {

    // Function to create a new comment
    async createComment(o_id, a_id, commentBody) {
        //add a comment to the organization associated with the o_id
        /*
        o_id: string,
        body: string
        //added a_id <- Kush 
        returns comment_id
        */

        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!a_id) throw 'Account id is not provided, please input ID!'
        if(!commentBody) throw 'No comment body was provided, please input comment body!'

        o_id= await id_validation.checkOrganizationID(o_id);
        a_id = await id_validation.checkID(a_id,"Account");
        //to make sure the account exist
        const user= await accountsFunctions.getAccount(a_id);
        
        commentBody= await validation.checkComment(commentBody);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!'; 
        const newComment={
            id: new ObjectId(),
            author: a_id,
            body:commentBody
        }
        //pushes the new comment entry 
        const updateResult  =  await organizationCollection.updateOne({_id: new ObjectId(o_id)},{$push :{comments:newComment}});
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
            throw 'Failed to add comment to the organization!';
        }
        return newComment.id.toString()
    },

    async deleteComment(o_id, comment_id) {
        //removes the given comment_id from the organization's comment list
        /*
        o_id: string,
        comment_id: string
        returns boolean indicating success (or potentially the deleted comment???)
        */
        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!comment_id) throw 'Comment id is not provided, please input ID!'

        o_id= await id_validation.checkOrganizationID(o_id);
        comment_id = await id_validation.checkID(comment_id,"Comment");

        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!'; 
        const updateResult  =  await organizationCollection.updateOne({_id: new ObjectId(o_id)},{$pull :{comments:{id:new ObjectId(comment_id)}}});
        if (!updateResult.acknowledged || !updateResult.modifiedCount === 0) {
            throw 'Failed to delete comment to the organization!';
        }
        return true;
    },

    async deleteCommentsByAccount(a_id) {
        // delete all reviews made by the account with the given a_id
        return 'IMPLEMENT ME';
    }
}

export default commentsFunctions;