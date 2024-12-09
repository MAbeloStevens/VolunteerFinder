import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { accounts } from '../config/mongoCollections.js';
import id_validation from '../helpers/id_validation.js';
import validation from '../helpers/validation.js';
const saltRounds = 10;
const accountsFunctions = {

    async getAccountIdandPassword(email) {
        //given a string email, return the associated user's a_id and password
        if(!email) throw  'email is not provided, please input email!'
        email = await validation.checkEmail(email);
        const accounts = await accounts();
        if(!accounts) throw 'Failed to connect to accounts collection';
        const accountData = await accounts.findOne({email: email});
        if(!accountData) throw 'No account with that email'
        return {a_id: accountData._id, password: accountData.password};
    },

    async getAccount(a_id) {
        //given a user's a_id, return the associated user's profile elements
        if(!a_id) throw  'a_id is not provided, please input ID!'
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        return accountData;
    },

    async getAccountNames(a_ids) {
        //given a list of user's a_ids, return each associated user's a_id, first_name, and last_name
        if(!a_ids || a_ids.length===0) throw 'No account ids from the list exists!';
        //validates each a_id in the list
        a_ids = a_ids.map(async (id) => {
            id = await id_validation.checkID(id,"Account");
            return id;
        });
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        //search for each account for each a_id
        const accountData = await accountsInfo.find({_id: {$in: a_ids}}).toArray();
        if(accountData.length!== a_ids.length) throw 'Not all account ids exist!'
        return accountData.map((account) => ({a_id: account._id, first_name: account.first_name, last_name: account.last_name}));
    },

    async createAccount(first_name, last_name, password, tags, email, phone) {
        //makes a new account with the specified information
        /*
        first_name: string,
        last_name: string,
        password: string,
        tags: Array<string> (optional),
        interestedOrgs: Array<string> (empty),
        organizations: Array<string> (empty),
        email: string,
        phone: string (optional)
        */
        if(!first_name ||!last_name ||!password) throw 'First name, last name, and password are required!';
        first_name = await validation.checkName(first_name);
        last_name = await validation.checkName(last_name);
        password = await validation.checkPassword(password);
        password = await bcrypt.hash(password, saltRounds);

        if(tags && tags.length > 0)
        {
            tags = await validation.checkTags(tags)
            tags = validation.properCaseTags(tags)
        }

        const interestedOrgs = [];
        const organizations = [];

        email = await validation.checkEmail(email);

        if(phone){
            phone = await validation.checkPhone(phone);
        }

        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';

        //check if email is already used in another account in the collection
        const existingAccount = await accountsInfo.findOne({email: email});
        if(existingAccount && existingAccount._id.toString()!== a_id.toString()) throw 'Email already exists!';

        const result = await accountsInfo.insertOne({first_name, last_name, password, tags, interestedOrgs, organizations, email, phone});
        return result.insertedId.toString();
    },

    async updateAccount(a_id, a_first_name, a_last_name, a_password, a_tags, a_interestedOrgs, a_email, a_phone) {
        //updates the account with the specified information
        /*
        a_id: string,
        a_first_name: string (optional),
        a_last_name: string (optional),
        a_password: string (optional),
        a_tags: Array<string> (optional),
        a_interestedOrgs: Array<string> (optional),
        a_organizations: Array<string> (optional),
        a_email: string (optional),
        a_phone: string (optional)
        */
       //find the account to be updated (if it exists)
        if(!a_id) throw 'Account ID is required!';
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        //logging update information
        let updateDoc = {};

        if(a_first_name) 
        {
            //validated a_first_name
            a_first_name = await validation.checkName(a_first_name);
            updateDoc.first_name = a_first_name;
        }

        if(a_last_name)
        {
            //validated a_last_name
            a_last_name = await validation.checkName(a_last_name);
            updateDoc.last_name = a_last_name;
        } 

        if(a_password)
        {
            //validated a_password
            a_password = await validation.checkPassword(a_password);
            updateDoc.password = a_password;
        }

        if(a_tags && a_tags.length > 0)
        {
            //validated a_tags
            a_tags = await validation.checkTags(a_tags)
            a_tags = validation.properCaseTags(a_tags)
            updateDoc.tags = a_tags;
        }
        
        if(a_interestedOrgs && a_interestedOrgs.length > 0)
        {
            //validated a_interestedOrgs
            a_interestedOrgs =  await Promise.all(a_interestedOrgs.map(async (o_id) => {
                o_id = await id_validation.checkOrganizationID(o_id);
                return o_id;
            }));
            updateDoc.interestedOrgs = a_interestedOrgs;
        }

        if(a_email)
        {
            //validated a_email
            email = await validation.checkEmail(a_email);
            //check if email is already used in another account in the collection
            const existingAccount = await accountsInfo.findOne({email: a_email});
            if(existingAccount && existingAccount._id.toString()!== a_id.toString()) throw 'Email already exists!';
            updateDoc.email = a_email;
        }

        if(a_phone)
        {
            //validated a_phone
            phone = await validation.checkPhone(a_phone);
            updateDoc.phone = a_phone;
        }
        //setting the new updated information
        const result = await accountsInfo.updateOne({_id: new ObjectId(a_id)}, {$set: updateDoc});
        //checks for if the update was successful
        if(result.modifiedCount === 0) throw 'No account found with that ID!';
        return a_id;
    },

    async deleteAccount(a_id) {
        //deletes the account with the specified a_id
        //returns the id of the account that was deleted
        if(!a_id) throw 'Account ID is required!';
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const result = await accountsInfo.deleteOne({_id: new ObjectId(a_id)});
        //checks for if the delete was successful
        if(result.deletedCount === 0) throw 'No account found with that ID!';
        return a_id;
    },

    async getAccountDisplayData(a_id) {
        //given a_id, return account data {tage, interestedOrgs}
        if(!a_id) throw 'Account ID is required!';
        a_id = await id_validation.checkID(a_id,"Account");
        const accounts = await accounts();
        if(!accounts) throw 'Failed to connect to accounts collection';
        const accountData = await accounts.findOne({_id: a_id});
        if(!accountData) throw 'No account with that ID'
        return {tags: accountData.tags, interestedOrgs: accountData.interestedOrgs};
    }


}
export default accountsFunctions;