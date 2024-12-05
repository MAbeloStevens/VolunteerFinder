import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { accountData , organizationData, commentData, reviewData, knownTagsData} from "../data/index.js";

const db = await dbConnection();
await db.dropDatabase();

// Create accounts

try {
    const acnt_1 = await accountData.createAccount('John', 'Doe', '12345678', [], 'JohnDoe@gmail.com', '201-201-209');
} catch(e) {
    console.log(e);
}

console.log('Done seeding database');

await closeConnection();
