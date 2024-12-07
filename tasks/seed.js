import { closeConnection, dbConnection } from "../config/mongoConnection.js";
import { accountData, commentData, knownTagsData, organizationData, reviewData } from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

// Create accounts
let act_1=undefined
try {
    act_1 = await accountData.default.createAccount('John', 'Doe', '12345678', [], 'JohnDoe@gmail.com', '1234567890');
} catch(e) {
    console.log(e);
}

//add tags
const tags=
    [
        'Advocacy',
        'Human Rights',
        'LGBTQ+',
        'Environment',
        'Animals',
        'Children',
        'Elderly',
        'Homeless',
        'Race & Ethnicity',
        'Religious',
        'Community',
        'Politics',
        'Foreign Relief',
        'Disaster Relief'
    ];

try{
    const addTags= await knownTagsData.default.addToKnownTags(tags);
}catch(e){
    console.log(e);
}


// Create organization
const org_1 = {
    adminAccount:act_1,
    name: "We love puppies",
    tags: [ 'Animals', 'Community'],
    description: "We really love puppies!",
    contact: 'volunteers@care4cats.org\n228-228-2287',
    link: "https://www.care4cats.org/home",
}

let orgTest= undefined
try{
    orgTest = await organizationData.default.createOrganziation(org_1);
}catch(e){
    console.log(e);
}
// console.log(act_1)
//update account
let updated_acc_1 = undefined
try{
    updated_acc_1 = await accountData.default.updateAccount(act_1,undefined,undefined,undefined,["Politics"],undefined,undefined,undefined)
}catch(e){
    console.log(e);
}
let updateOrg = undefined;
try{
    updateOrg = await organizationData.default.updateOrganization(orgTest,"Cat", [ 'Animals', 'Community'], undefined, "We really love cats!",'volunteers@care4cats.org\n228-228-2287', "https://www.care4cats.org/home" )
}catch(e){
    console.log(e)
}

//add comment
let comment= undefined
try{
    comment = await commentData.default.createComment(orgTest, act_1, "I am not the owner of this org, but i sure do love cats!")
}catch(e){
    console.log(e)
}

//add review
let review = undefined
try{
    review= await reviewData.default.createReview(orgTest, 10, act_1, "I am not the owner of this org, but i sure do love cats!")
}catch(e){
    console.log(e)
}

console.log(comment);
//delete comment
let deleteComment = undefined
try{
    deleteComment= await commentData.default.deleteComment(orgTest,comment);
}catch(e){
    console.log(e)
}

//delete review
let deleteReview = undefined
try{
    deleteReview=await reviewData.default.deleteReview(orgTest,review);
}catch(e){
    console.log(e)
}
console.log('Done seeding database');

//delete account
try{
    const deleteAccount=await accountData.default.deleteAccount(act_1);
    console.log(deleteAccount)
}catch(e){
    console.log(e)
}
//delete org
try{
    const deleteOrg=await organizationData.default.deleteOrganization(orgTest)
    console.log(deleteOrg);    
}catch(e){
    console.log(e)
}
await closeConnection();
