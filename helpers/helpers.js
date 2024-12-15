
// gets a cookie by name by parsing through document cookies 
import multer from "multer";
import path from "path";
import validation from "./validation.js";
import { knownTagsData } from '../data/index.js';

function getCookie(name) { /// SWITCHED TO EXPRESS-SESSION, DONT NEED THIS ANYMORE
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
}
// given an object containing field _id, returns the same object with that field renamed to a_id 
function a_idRenameField(obj) {
    const newObj = {};
    for (let k of Object.keys(obj)){
        if (k === '_id') newObj['a_id'] = obj[k];
        else newObj[k] = obj[k];

    }
    return newObj;
};

// given an object containing field _id, returns the same object with that field renamed to o_id 
function o_idRenameField(obj) {
    const newObj = {};
    for (let k of Object.keys(obj)){
        if (k === '_id') newObj['o_id'] = obj[k];
        else newObj[k] = obj[k];
    }
    return newObj;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //Save files to public/images directory
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        //generate unique filename using timestamp and random number
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: async (req, file, cb) => {
        try {
            await validation.checkImg(file);
            cb(null, true);
        } catch (e) {
            cb(new Error(e.message || e));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
})


// this tags in a list of tags and ensures that they are all valid known tags
async function allValidTags(tags){
    let knownTags = await knownTagsData.getKnownTags();
    for (let tag of tags){
        if (typeof tag !== 'string') throw 'Tags must only contain strings';
        if (!knownTags.includes(tag)) throw `${tag} is not a known tag`;
    }
    return true;
}

export { a_idRenameField, getCookie, o_idRenameField, upload , allValidTags};

