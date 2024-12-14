
// gets a cookie by name by parsing through document cookies 
import multer from "multer";
import path from "path";
import validation from "./validation.js";
function getCookie(name) { /// SWITCHED TO EXPRESS-SESSION, DONT NEED THIS ANYMORE
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
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


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        //should save files to public/images
        cb(null, './public/images')
    },
    filename: (req, file, cb)=> {
        //random string of characters at the end to avoid issues with files of the same name 
        const unqiueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${unqiueSuffix}${ext}`)
    }
});

const upload= multer({storage:storage,
    fileFilter:async (req, file, cb)=>{
        try{
            await validation.checkImg(file);
            cb(null,true)
        }
        catch(e){
            cb(new Error(e.message||e))
        }
    },
    limits:{fileSize: 5* 1024 * 1024}
});

export { getCookie, upload };


// given an object containing field _id, returns the same object with that field renamed to o_id 
function o_idRenameField(obj) {
    const newObj = {};
    for (let k of Object.keys(obj)){
        if (k === '_id') newObj['o_id'] = obj[k];
        else newObj[k] = obj[k];
    }
    return newObj;
};

export { a_idRenameField, o_idRenameField };

