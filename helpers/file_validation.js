import fs from 'fs';

const file_validation = {
    async validateFile(imagePath){
        if(!fs.existsSync(imagePath)){
            throw "Image does not exist"
        }
        return imagePath
    }
};
export default file_validation;