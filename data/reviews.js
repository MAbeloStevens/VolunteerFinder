import { ObjectId } from "mongodb";
import { organizations } from "../config/mongoCollections.js";
import id_validation from "../helpers/id_validation.js";
import validation from '../helpers/validation.js';
import accountsFunctions from "./accounts.js";
import organizationsFunctions from "./organizations.js";

const reviewFunctions = {

    async getReview(o_id, review_id){
        // return review info given o_id and review_id (calls organizations.getOrganizationCommentsReviews)
        if(!o_id) throw  'Organization id is not provided, please input ID!'
        o_id = await id_validation.checkOrganizationID(o_id);
        if(!review_id) throw 'Review id is not provided, please input ID!'
        review_id = await id_validation.checkID(review_id,"Review");

        // get organization reviews
        const organizationLists = await organizationsFunctions.getOrganizationCommentsReviews(o_id);
        // find and return review with matching id
        const reviewFound = organizationLists.reviews.find((r) => r.id === review_id);
        if (!reviewFound) throw 'No review with that ID';

        return reviewFound;
    },

    async createReview(o_id, rating, a_id, reviewBody) {
        //add a review to the organization's review list
        /*
        o_id: string
        rating: number (1-10)
        a_id: string
        reviewBody: string
        returns review_id: string
         */
        
        //do these even exist
        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!a_id) throw 'Account id is not provided, please input ID!'
        if(!rating) throw 'Rating number is not provided, please input rating!';
        if(!reviewBody) throw 'Review text is not provided, please input review!';

        o_id= await id_validation.checkOrganizationID(o_id);
        a_id = await id_validation.checkID(a_id,"Account");
        //to make sure the account exist
        const user= await accountsFunctions.getAccount(a_id);

        //checking other parameters
        rating =  await validation.checkPositiveNumber(rating)
        rating = await validation.validRating(rating);
        reviewBody= await validation.checkReview(reviewBody);
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!';
        const newReview={
            id: new ObjectId(),
            author:a_id,
            rating:rating,
            body:reviewBody,
        }
        //pushes the new review entry 
        const updateResult  =  await organizationCollection.updateOne({_id: new ObjectId(o_id)},{$push :{reviews:newReview}});
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
            throw 'Failed to add review to the organization!';
        }
        return newReview.id.toString()
    },

    async deleteReview(o_id, review_id) {
        //deletes the review with the given review_id from the organization's review list
        /*
        o_id: string
        review_id: string
         */
        if(!o_id) throw 'Organization id is not provided, please input ID!'
        if(!review_id) throw 'Review id is not provided, please input ID!'

        o_id= await id_validation.checkOrganizationID(o_id);
        review_id = await id_validation.checkID(review_id,"Review");

        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection'; 
        const updateResult  =  await organizationCollection.updateOne({_id: new ObjectId(o_id)},{$pull :{reviews:{id:new ObjectId(review_id)}}});
        if (!updateResult.acknowledged|| updateResult.modifiedCount === 0) {
            throw 'Failed to delete review on the organization.';
        }
        return true;
    },

    async deleteReviewsByAccount(a_id) {
        // delete all reviews made by the account with the given a_id
        if(!a_id) throw 'Account id is not provided, please input ID';
        a_id = await id_validation.checkID(a_id,"Account");
        const organizationCollection= await organizations();
        if(!organizationCollection) throw 'Failed to connect to organization collection!'; 
        const updateResult  =  await organizationCollection.updateMany(
            {},
            {$pull: {reviews:{author:a_id}}}
        );
        if (!updateResult.acknowledged || (updateResult.modifiedCount === 0)) {
            throw 'Failed to delete all reviews from account!';
        }
        return true;
    }

}

export default reviewFunctions;