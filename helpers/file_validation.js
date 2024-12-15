import fs from 'fs';
import path from 'path';
const file_validation = {
    async validateFile(imagePath){
        imagePath= path.normalize(imagePath)
        imagePath = imagePath.replace(/^\\+/, '');
        if(!fs.existsSync(imagePath)){
            throw "Image does not exist"
        }
        return imagePath
    },
    async deleteFile(imagePath){
        imagePath= path.normalize(imagePath)
        imagePath = imagePath.replace(/^\\+/, '');
        try{
            fs.promises.unlink(imagePath)
            return true;
        }
        catch(e){
            throw `Error deleting bannerImg: ${e}`
        }

    }
};
export default file_validation;