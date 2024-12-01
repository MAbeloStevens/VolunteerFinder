import {organizations} from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';

const reviewFunctions = {

    async createReview(o_id, rating, a_id, reviewBody) {
        //add a review to the organization's review list
        /*
        o_id: string
        rating: number (1-10)
        a_id: string
        reviewBody: string
        returns review_id: string
         */
    },

    async deleteReview(o_id, review_id) {
        //deletes the review with the given review_id from the organization's review list
        /*
        o_id: string
        review_id: string
         */
    }

}

export default reviewFunctions;