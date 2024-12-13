import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { accounts } from '../config/mongoCollections.js';
import { organizations } from '../config/mongoCollections.js';
import id_validation from '../helpers/id_validation.js';
import validation from '../helpers/validation.js';
const saltRounds = 10;
const accountsFunctions = {

    async getLogInInfo(email, password) {
        //given a string email and password, get the account asssociated with the email and bcrypt compare the hashed passwords
        //if cannot validate, throw error saying the email or password is invalid
        //if valid return {a_id, firstName, lastName}
        if(!email) throw  'email is not provided, please input email!'
        email = await validation.checkEmail(email);
        if(!password) throw  'password is not provided, please input password!'
        password = await validation.checkPassword(password);
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne(
            {email: email},
            {projection: {_id: 1, password: 1, firstName: 1, lastName: 1}}
        );
        // email not found
        if(!accountData) throw 'Either the email or password is invalid';
        // validate password
        const match = await bcrypt.compare(password, accountData.password);
        if (match){
            return {a_id: accountData._id, firstName: accountData.firstName, lastName: accountData.lastName};
        } else throw 'Either the email or password is invalid';
    },

    async getAccount(a_id) {
        //given a user's _id (referred as a_id), return the associated user's profile elements
        if(!a_id) throw  'a_id is not provided, please input ID!'
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'

        const returnData = {
            a_id: accountData._id,
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            tags: accountData.tags,
            interestedOrgs: accountData.interestedOrgs,
            organizations: accountData.organizations,
            email: accountData.email,
            phone: accountData.phone
        };
        return returnData;
    },

    async getAccountNames(a_ids) {
        //given a list of user's a_ids, return each associated user's a_id, firstName, and lastName
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
        return accountData.map((account) => ({a_id: account._id, firstName: account.firstName, lastName: account.lastName}));
    },

    async createAccount(firstName, lastName, password, tags, email, phone) {
        //makes a new account with the specified information
        /*
        firstName: string,
        lastName: string,
        password: string,
        tags: Array<string> (optional),
        interestedOrgs: Array<string> (empty),
        organizations: Array<string> (empty),
        email: string,
        phone: string (optional)
        */
        if(!firstName ||!lastName ||!password || !email) throw 'First name, last name, email, and password are required!';
        firstName = await validation.checkName(firstName);
        lastName = await validation.checkName(lastName);
        //password hashing
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
        if(existingAccount) throw 'Email already exists!';

        const result = await accountsInfo.insertOne({
            firstName: firstName, 
            lastName: lastName, 
            password: password, 
            tags: tags, 
            interestedOrgs: interestedOrgs, 
            organizations: organizations, 
            email: email, 
            phone: phone});
        return result.insertedId.toString();
    },

    async updateAccount(a_id, a_firstName, a_lastName, a_password, a_tags, a_interestedOrgs, a_organizations, a_email, a_phone) {
        //updates the account with the specified information
        /*
        a_id: string,
        a_firstName: string (optional),
        a_lastName: string (optional),
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

        if(a_firstName) 
        {
            //validated a_firstName
            a_firstName = await validation.checkName(a_firstName);
            updateDoc.firstName = a_firstName;
        }

        if(a_lastName)
        {
            //validated a_lastName
            a_lastName = await validation.checkName(a_lastName);
            updateDoc.lastName = a_lastName;
        } 

        if(a_password)
        {
            //validated a_password
            a_password = await validation.checkPassword(a_password);
            updateDoc.password = a_password;
        }

        if(a_tags)
        {
            //validated a_tags
            a_tags = await validation.checkTags(a_tags)
            a_tags = validation.properCaseTags(a_tags)
            updateDoc.tags = a_tags;
        }
        
        if(a_interestedOrgs)
        {
            //validated a_interestedOrgs
            a_interestedOrgs =  await Promise.all(a_interestedOrgs.map(async (o_id) => {
                o_id = await id_validation.checkOrganizationID(o_id);
                return o_id;
            }));
            updateDoc.interestedOrgs = a_interestedOrgs;
        }

        if(a_organizations)
        {
            //validated a_organizations
            a_organizations =  await Promise.all(a_organizations.map(async (o_id) => {
                o_id = await id_validation.checkOrganizationID(o_id);
                return o_id;
            }));
            updateDoc.organizations = a_organizations;
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
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        return {tags: accountData.tags, interestedOrgs: accountData.interestedOrgs};
    },

    async getAccountFullName(a_id) {
        //given a_id, return full name of the account
        if(!a_id) throw 'Account ID is required!';
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID';
        return {a_id: accountData._id.toString(), firstName: accountData.firstName, lastName: accountData.lastName}
    },

    async getAccountOrganizations(a_id) {
        //given a_id, return all organizations the account is associated with
        if(!a_id) throw 'Account ID is required!';
        a_id = await id_validation.checkID(a_id,"Account");
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        return accountData.organizations;
    },

    async addOrganizationForAccount(a_id, o_id) {
        //given a_id and o_id, push the o_id into the account's organizations list. Return {orgAdded: true} if successful, error otherwise.
        if(!a_id ||!o_id) throw 'Account ID and Organization ID are required!';
        a_id = await id_validation.checkID(a_id,"Account");
        o_id = await id_validation.checkOrganizationID(o_id);
        //check for the account's existance
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        //check if organization exists 
        const organizations = await organizations();
        if(!organizations) throw 'Failed to connect to organizations collection';
        const existingOrganization = await organizations.findOne({_id: new ObjectId(o_id)});
        if(!existingOrganization) throw 'No organization with that ID'
        //updating
        const updatedOrganizations = [...accountData.organizations, o_id];
        const result = await accountsInfo.updateOne({_id: new ObjectId(a_id)}, {$set: {organizations: updatedOrganizations}});
        //checks for if the update was successful
        if(result.modifiedCount === 0) throw 'Failed to add organization!';
        return {orgAdded: true};
    },

    async removeOrganizationForAccount(a_id, o_id){
        //given a_id and o_id, remove the o_id from the account's organizations list. Return {orgRemoved: true} if successful, error otherwise.
        if(!a_id ||!o_id) throw 'Account ID and Organization ID are required!';
        a_id = await id_validation.checkID(a_id,"Account");
        o_id = await id_validation.checkOrganizationID(o_id);
        //check for the account's existance
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        //check if organization exists 
        const organizations = await organizations();
        if(!organizations) throw 'Failed to connect to organizations collection';
        const existingOrganization = await organizations.findOne({_id: new ObjectId(o_id)});
        if(!existingOrganization) throw 'No organization with that ID'
        //removing (we'll filter the organization list to only keep orgs that o_id does not equal the given o_id since the org list is just a list of o_ids)
        const updatedOrganizations = accountData.organizations.filter(org => org.toString()!== o_id);
        const result = await accountsInfo.updateOne({_id: new ObjectId(a_id)}, {$set: {organizations: updatedOrganizations}});
        //checks for if the removal was successful
        if(result.modifiedCount === 0) throw 'Failed to remove organization!';
        return {orgRemoved: true};
        
    },

    async addInterestedOrg(a_id, o_id){
        // IMPORTANT NOTE: This is automatically called in organizations.removeInterestedAccount() and shouldn't be called seperately
        //given a_id and o_id, push the o_id into the account's interestedOrgs list. Return {orgAdded: true} if successful, error otherwise.
        a_id = await id_validation.checkID(a_id,"Account");
        o_id = await id_validation.checkOrganizationID(o_id);
        //check for the account's existance
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        //check if organization exists 
        const organizations = await organizations();
        if(!organizations) throw 'Failed to connect to organizations collection';
        const existingOrganization = await organizations.findOne({_id: new ObjectId(o_id)});
        if(!existingOrganization) throw 'No organization with that ID'
        //updating
        const updatedInterestedOrgs = [...accountData.interestedOrgs, o_id];
        const result = await accountsInfo.updateOne({_id: new ObjectId(a_id)}, {$set: {interestedOrgs: updatedInterestedOrgs}});
        //checks for if the update was successful
        if(result.modifiedCount === 0) throw 'Failed to add organization!';
        return {orgAdded: true};
    },

    async removeInterestedOrg(a_id, o_id){
        // IMPORTANT NOTE: This is automatically called in organizations.removeInterestedAccount() and shouldn't be called seperately
        //given a_id and o_id, remove the o_id from the account's interestedOrgs list. Return {orgRemoved: true} if successful, error otherwise.
        a_id = await id_validation.checkID(a_id,"Account");
        o_id = await id_validation.checkOrganizationID(o_id);
        //check for the account's existance
        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne({_id: new ObjectId(a_id)});
        if(!accountData) throw 'No account with that ID'
        //check if organization exists 
        const organizations = await organizations();
        if(!organizations) throw 'Failed to connect to organizations collection';
        const existingOrganization = await organizations.findOne({_id: new ObjectId(o_id)});
        if(!existingOrganization) throw 'No organization with that ID'
        //removing (same method as removeOrganization)
        const updatedInterestedOrgs = accountData.interestedOrgs.filter(org => org.toString()!== o_id);
        const result = await accountsInfo.updateOne({_id: new ObjectId(a_id)}, {$set: {interestedOrgs: updatedInterestedOrgs}});
        //checks for if the removal was successful
        if(result.modifiedCount === 0) throw 'Failed to remove organization!';
        return {orgRemoved: true};
    },

    async isAccountInterested(a_id, o_id) {
        // returns true if the o_id is in the account's interestedOrg list
        if(!a_id ||!o_id) throw 'Account ID and Organization ID are required!';
        a_id = await id_validation.checkID(a_id,"Account");
        o_id = await id_validation.checkOrganizationID(o_id);

        const accountsInfo = await accounts();
        if(!accountsInfo) throw 'Failed to connect to accounts collection';
        const accountData = await accountsInfo.findOne(
            {_id: new ObjectId(a_id)},
            {projection: {interestedOrgs: 1}}
        );
        if(!accountData) throw 'No account with that ID';

        return accountData.interestedOrgs.includes(o_id);
    }

}
export default accountsFunctions;