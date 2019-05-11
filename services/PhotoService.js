const cloudinary = require('cloudinary').v2;
const Codes = require('../dtos/Response').Codes;

module.exports = class PhotoService {
    constructor () {}
    static async uploadPhoto (uri) {
        let rs = {
            code: Codes.Success,
        };
        await cloudinary.uploader.upload(uri,(err,res) => {
            if (!!err){
                rs = {
                    code: Codes.Exception,
                    content: err,
                }
                return;
            }
            rs = {
                ...rs,
                content: res.url,
            }
        });

        return rs;
    }
}