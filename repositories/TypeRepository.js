const {Codes} = require('../dtos/Response');
const Type = require('../model/Type').Model;

module.exports = class TypeRepository {
    static async hasType (name) {
        return await Type.findOne({
            name: name,
        }).lean();
    }

    static async getAll () {
        return await Type.find({}).lean();
    }
    

}
