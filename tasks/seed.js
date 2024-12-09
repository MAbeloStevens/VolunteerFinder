import { closeConnection, dbConnection } from "../config/mongoConnection.js";
import { accountData, commentData, knownTagsData, organizationData, reviewData } from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

//Intializing our known tags database
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
    const addTags= await knownTagsData.addToKnownTags(tags);
}catch(e){
    console.log(e);
}

// Create accounts we will be makring 4 different accounts for the groups members
let Mark, Larc, Kendell, Kush
try {
    Mark = await accountData.createAccount('Mark', 'Abelo', ' Mabelo_123', ['Animals', 'Children','Elderly','Community'], 'mabelo@stevens.edu', '1234567890');
} catch(e) {
    console.log(`Error creating Mark's Account:`, e);
}
try {
    Larc = await accountData.createAccount('Larc', 'Lim', 'Llim_123', ['Environment','Foreign Relief','Disaster Relief'], 'omorale2@stevens.edu', '2345678901');
} catch(e) {
    console.log(`Error creating Larc's Account:`, e);
}
try {
    Kendell = await accountData.createAccount('Kendell', 'Muldrow', 'Kmuldrow_123', ['Advocacy','Human Rights','LGBTQ+','Animals'], 'kmuldrow@stevens.edu', '3456789012');
} catch(e) {
    console.log(`Error creating Kendell's Account:`, e);
}
try {
    Kush = await accountData.createAccount('Kush', 'Parmar', 'Kparmar_123', ['Human Rights','LGBTQ+','Homeless','Community'], 'kparmar1@stevens.edu', '4567890123');
} catch(e) {
    console.log(`Error creating Kush's Account:`, e);
}

// Create organization
const catsOrg = {
    adminAccount:Mark,
    name: "Care For Cats",
    tags: [ 'Animals', 'Community'],
    description: 'Here at Care For Cats, we rescue and foster stray cats and cats in unsustainable housing.\n\
    We then find their forever homes with willing cat parents.\n\Join Care For Cats to help those sweet fur babies.',
    //bannerImg : '/public/images/careforcats.jpg', Still needs implementing
    contact: 'volunteers@care4cats.org\n228-228-2287',
    link: "https://www.care4cats.org/home",
}
const homelessOrg = {
    adminAccount: Kush,
    name: "Shelter & Pride",
    tags: ['LGBTQ+', 'Homeless', 'Human Rights', 'Community'],
    description: "Shelter & Pride is an organization dedicated to providing support and safe spaces for LGBTQ+ individuals facing homelessness. We focus on offering resources, advocacy, and community to ensure that every LGBTQ+ person has access to the support they deserve.",
    //bannerImg : '/public/images/shelterandpride.jpg', Still needs implementing
    contact: 'contact@shelterandpride.org\n(555) 678-9012',
    link: "https://www.shelterandpride.org",
}

//adding the organizations to the database
let insertOrgMark, insertOrgKush
try{
    insertOrgMark = await organizationData.createOrganziation(catsOrg);
}catch(e){
    console.log(`Error creating Mark's organization:`, e);
}
try{
    insertOrgKush = await organizationData.createOrganziation(homelessOrg);
}catch(e){
    console.log(`Error creating Kush's organization:`, e);
}

// TODO: We also need to make a data functions to add an organization to a user's account 

//updating orgs to add these accounts in their interested list
try{
    const addInterestedAccountMarkOrg1 = await organizationData.addInterestedAccount(insertOrgMark,Kendell)
}catch(e){
    console.log(`Error adding Kendell as an interested account to Mark's organization:`, e);
}
try{
    const addInterestedAccountMarkOrg2 = await organizationData.addInterestedAccount(insertOrgMark,Kush)
}catch(e){
    console.log(`Error adding Kush as an interested account to Mark's organization:`, e);
}
try{
    const addInterestedAccountKushOrg1 = await organizationData.addInterestedAccount(insertOrgKush,Larc)
}catch(e){
    console.log(`Error adding Larc as an interested account to Kush's organization:`, e);
}
try{
    const addInterestedAccountMarkOrg2 = await organizationData.addInterestedAccount(insertOrgKush,Mark)
}catch(e){
    console.log(`Error adding Mark as an interested account to Kush's organization:`, e);
}

//updating accounts to add these orgs in their interested List
try{
    const addInterestOrgMark = await accountData.updateAccount(Mark,undefined,undefined,undefined,undefined,[insertOrgKush],undefined,undefined)
}catch(e){
    console.log(`Error adding Kush's Org as an interested Org to Mark's Account:`, e);
}
try{
    const addInterestOrgLarc = await accountData.updateAccount(Larc,undefined,undefined,undefined,undefined,[insertOrgKush],undefined,undefined)
}catch(e){
    console.log(`Error adding Kush's Org as an interested Org to Larc's Account:`, e);
}
try{
    const addInterestOrgMark = await accountData.updateAccount(Kush,undefined,undefined,undefined,undefined,[insertOrgMark],undefined,undefined)
}catch(e){
    console.log(`Error adding Mark's Org as an interested Org to Kush's Account:`, e);
}
try{
    const addInterestOrgMark = await accountData.updateAccount(Kendell,undefined,undefined,undefined,undefined,[insertOrgMark],undefined,undefined)
}catch(e){
    console.log(`Error adding Mark's Org as an interested Org to Kendell's Account:`, e);
}

//add comments to the two organizations
try{
    const commentKendell = await commentData.createComment(insertOrgMark, Kendell, "I adopted a cat from Care For Cats and the process was so smooth. Thank you for helping me find my new best friend!!!")
}catch(e){
    console.log(`Error creating Kendell's comment:`, e);
}
try{
    const commentKush = await commentData.createComment(insertOrgMark, Kush, "As a cat lover, I can't thank you enough for your dedication to these precious animals. You are making a real difference!!!")
}catch(e){
    console.log(`Error creating Kush's comment:`, e);
}
try{
    const commentLarc = await commentData.createComment(insertOrgKush, Larc, "I’m so proud to support Shelter & Pride. The resources and advocacy they provide for LGBTQ+ individuals facing homelessness are invaluable.")
}catch(e){
    console.log(`Error creating Larc's comment:`, e);
}
try{
    const commentMark = await commentData.createComment(insertOrgKush, Mark, "Shelter & Pride is doing an incredible job, but they need more resources. The organization is doing great work with limited space and funds. More funding would help them provide more long-term housing solutions and better access to job training.")
}catch(e){
    console.log(`Error creating Marks's comment:`, e);
}

//add reviews to the two organizations
try{
    const reviewKendell= await reviewData.createReview(insertOrgMark, 9, Kendell, "The are an amazing organization, they do so much for stray cats. The adoption process was smooth, and I could tell the team genuinely cares about the cats' well-being. Would love to see more outreach in the community!")
}catch(e){
    console.log(`Error creating Kendell's review:`, e);
}
try{
    const reviewLarc= await reviewData.createReview(insertOrgKush, 8, Larc, "I am beyond impressed with Shelter & Pride’s work. They offer a real lifeline for LGBTQ+ individuals experiencing homelessness. The team truly listens and provides more than just shelter – they offer a path to a better, more stable life with their career advisors and partnerships with various companies. The only downside is their limited occupancy; there are so many people who need help, and I hope they can expand to accommodate more individuals.")
}catch(e){
    console.log(`Error creating Kendell's review:`, e);
}

//okay close this now
await closeConnection();
