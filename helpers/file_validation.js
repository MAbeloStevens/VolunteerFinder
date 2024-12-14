import fs from 'fs';

const file_validation = {
    async validateFile(imagePath){
        if(!fs.existsSync(imagePath)){
            throw "Image does not exist"
        }
        return imagePath
    },
    async deleteFile(imagePath){
        fs.unlink(imagePath, (err)=>{
            if(err){
                throw "Error deleting bannerImg";
            }
        })
        return true;
    }
};
export default file_validation;