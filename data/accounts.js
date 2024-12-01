import {accounts} from "../config/mongoCollections.js";
import validation from '../helpers/validation.js';

const accountsFunctions = {

    async getAccountIdandPassword(email) {
        //given a string email, return the associated user's a_id and password
    },

    async getAccount(a_id) {
        //given a user's a_id, return the associated user's profile elements
    },

    async getAccountNames(a_ids) {
        //given a list of user's a_ids, return the associated user's a_id, first_name, and last_name
    },

    async createAccount(first_name, last_name, password, tags, contactInformation) {
        //makes a new account with the specified information
        /*
        first_name: string,
        last_name: string,
        password: string,
        tags: Array<string> (optional),
        contactInformation: {
            email: string,
            phone_number: string
        }
        */
    },

    async updateAccount(a_id, a_name, a_password, a_tags, a_contactInformation) {
        //updates the account with the specified information
        /*
        a_id: string,
        a_name: string (optional),
        a_password: string (optional),
        a_tags: Array<string> (optional),
        a_contactInformation: {
            email: string (optional),
            phone_number: string (optional)
        }
        */
    },

    async deleteAccount(a_id) {
        //deletes the account with the specified a_id
        //returns the id of the account that was deleted
    }


}
export default accountsFunctions;