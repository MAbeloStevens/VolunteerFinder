import { ObjectId } from "mongodb";
import { organizations } from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';
import accountsFunctions from "./accounts.js";

const commentsFunctions = {

    // Function to create a new comment
    async createComment(o_id, a_id, comment) {
        //add a comment to the organization associated with the o_id
        /*
        o_id: string,
        comment: string
        //added a_id <- Kush 
        returns comment_id
        */

        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!a_id) throw 'Account id is not provided, please input ID!'
        if(!comment) throw 'No account was provided, please input comment!'

        o_id= await validation.checkOrganizationID(o_id);
        a_id = await validation.checkID(a_id,"Account");
        //to make sure the account exist
        const user= await accountsFunctions.getAccount(a_id);
        
        comment= await validation.checkString(comment,"Comment");
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!'; 
        const newComment={
            id: new ObjectId(),
            author: a_id,
            comment:comment
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

        o_id= await validation.checkOrganizationID(o_id);
        comment_id = await validation.checkID(comment_id,"Comment");

        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!'; 
        const updateResult  =  await organizationCollection.updateOne({_id: new ObjectId(o_id)},{$pull :{comments:{id:comment_id}}});
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
            throw 'Failed to delete comment to the organization!';
        }
        return true;
    }
}

export default commentsFunctions;