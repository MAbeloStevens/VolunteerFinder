import { closeConnection, dbConnection } from "../config/mongoConnection.js";
import { accountData, commentData, knownTagsData, organizationData, reviewData } from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

console.log('seeding database');

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
    Mark = await accountData.createAccount('Mark', 'Abelo', 'Mabelo_123', ['Animals', 'Children','Elderly','Community'], 'mabelo@stevens.edu', '1234567890');
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
    description: 'Here at Care For Cats, we rescue and foster stray cats and cats in unsustainable housing.\r\n\
    We then find their forever homes with willing cat parents.\r\nJoin Care For Cats to help those sweet fur babies.',
    bannerImg : '/public/images/careforcats.jpg',
    contact: 'volunteers@care4cats.org\r\n228-228-2287',
    link: "https://www.care4cats.org/home",
}
const homelessOrg = {
    adminAccount: Kush,
    name: "Shelter & Pride",
    tags: ['LGBTQ+', 'Homeless', 'Human Rights', 'Community'],
    description: "Shelter & Pride is an organization dedicated to providing support and safe spaces for LGBTQ+ individuals facing homelessness. We focus on offering resources, advocacy, and community to ensure that every LGBTQ+ person has access to the support they deserve.",
    bannerImg : '/public/images/shelterandpride.jpg',
    contact: 'contact@shelterandpride.org\r\n(555) 678-9012',
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

//add an organization to a user's account 
try{
    const addOrgToMark=await accountData.addOrganizationForAccount(Mark,insertOrgMark)
}catch(e){
    console.log(`Error adding Org to Mark's account:`, e);
}
try{
    const addOrgToKush = await accountData.addOrganizationForAccount(Kush,insertOrgKush);
}catch(e){
    console.log(`Error creating Kush's organization:`, e);
}

// updating orgs to add these accounts in their interested list, which also adds itself to the account, list
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
    const addInterestedAccountKushkOrg2 = await organizationData.addInterestedAccount(insertOrgKush,Mark)
}catch(e){
    console.log(`Error adding Mark as an interested account to Kush's organization:`, e);
}
try{
    const addInterestedAccountKushOrg3 = await organizationData.addInterestedAccount(insertOrgKush,Kendell)
}catch(e){
    console.log(`Error adding Mark as an interested account to Kush's organization:`, e);
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


// add 8 organizations for a single account
try {
    let Pill = await accountData.createAccount('Phill', 'Hatrick', 'Phat_123', ['Race & Ethnicity', 'Homeless', 'Race & Ethnicity'], 'phat@gmail.com', '1010011001');
    const agesOrg = {
        adminAccount:Pill,
        name: "Fun For All Ages",
        tags: [ 'Children', 'Elderly', 'Community'],
        description: 'At Fun For All Ages, we set up community events in local neighborhoods to foster community and connection between groups of large age disparity\r\n\
        Studies show that interactions between old and young individuals nurtures better understanding and reduces agism.\r\nCome connect!',
        contact: 'volunteers@funforallages.org\r\nkars-4kids',
        link: 'https://www.funforallages.org'
    };
    const cowsOrg = {
        adminAccount:Pill,
        name: "Church of Holy Cow",
        tags: [ 'Religious', 'Animals'],
        description: 'Come join the church of the Holy Cow.\r\nGo in moo.',
        contact: 'moo@moo.moo\r\n003-003-0003',
        link: 'https://www.google.com/search?client=opera-gx&q=cow&sourceid=opera&ie=UTF-8&oe=UTF-8'
    };
    const humanOrg = {
        adminAccount:Pill,
        name: "Human Rights Warriors",
        tags: [ 'Human Rights', 'Advocacy', 'Politics'],
        description: 'Living is a human experience. Know that your contributions help others.\r\n\
        Only you can make a change in your community.\r\nJoin us and help reach out to fight for your fellow man!',
        contact: 'warriors@humanrights.org\r\n109-158-8512',
        link: 'https://www.humanrights.org'
    };
    const planetOrg = {
        adminAccount:Pill,
        name: "Planet Saviors",
        tags: [ 'Enviornment', 'Disaster Relief'],
        description: 'With the changing world, the world fights back. We see it everywhere, in the news, on our streets.\r\n\
        Only you can fight against climate change and save the planet.',
        contact: 'iwantin@planetsaviors.org\r\n158-109-1285',
        link: 'https://www.planetsaviors.org'
    };
    const teachOrg = {
        adminAccount:Pill,
        name: "Teach the World",
        tags: [ 'Children', 'Community'],
        description: 'Remember when you were young and you had that teach that stuck up for you? You can be that teacher for someone else\r\n\
        Be a mentor. A leader. A guide.\r\nIt only takes one to teach many!',
        contact: 'beteachers@teachtheworld.org\r\n812-543-7128',
        link: 'https://www.teachtheworld.org'
    };
    const hungryOrg = {
        adminAccount:Pill,
        name: "F.E.E.D.",
        tags: [ 'Homeless', 'Foreign Relief'],
        description: 'For Every Entitie\'s Diet\r\n\
        Help those who can\'t help themselves. Be the change and don\'t let others go hungry\r\n\
        Help FEED the Hungry!',
        contact: 'helpFEED@FEED.org\r\n914-412-0811',
        link: 'https://www.FEED.org'
    };
    const treeOrg = {
        adminAccount:Pill,
        name: "Go Grow a Tree",
        tags: [ 'Environment', 'Animals'],
        description: 'Help plant more trees! Millions of trees are destroyed every year and push the environment closer to collapse\r\n\
        You can help! Donate for volunteer and help the land heal!',
        contact: 'volunteer@ggtree.org\r\n991-471-5913',
        link: 'https://www.ggtree.org'
    };
    const imigrantsOrg = {
        adminAccount:Pill,
        name: "Your Land My Land",
        tags: [ 'Advocacy', 'Human Rights', 'Foreign Relief'],
        description: 'People come to this country for many reasons. Help be the reason they can stay!\r\n\
        Join Your Land My Land Today!',
        contact: 'idliketohelp@yourlandmyland.org\r\n210-218-2105',
        link: 'https://www.yourlandmyland.org'
    };

    const inserted_agesOrg = await organizationData.createOrganziation(agesOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_agesOrg)

    const inserted_cowsOrg = await organizationData.createOrganziation(cowsOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_cowsOrg)
    
    const inserted_humanOrg = await organizationData.createOrganziation(humanOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_humanOrg)

    const inserted_planetOrg = await organizationData.createOrganziation(planetOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_planetOrg)

    const inserted_teachOrg = await organizationData.createOrganziation(teachOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_teachOrg)

    const inserted_hungryOrg = await organizationData.createOrganziation(hungryOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_hungryOrg)

    const inserted_treeOrg = await organizationData.createOrganziation(treeOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_treeOrg)

    const inserted_imigrantsOrg = await organizationData.createOrganziation(imigrantsOrg);
    await accountData.addOrganizationForAccount(Pill,inserted_imigrantsOrg)

} catch (e){
    console.log(`Error creating adding bulk organizations:`, e);
}

//okay close this now
await closeConnection();

console.log('done seeding database');
