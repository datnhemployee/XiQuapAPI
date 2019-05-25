const UserManager = require('../model/Account').Model;
const User = require('../model/Account').Model;

module.exports = class UserRepository{
    static async get () {
        return await UserManager.find({}).lean();
    }

    static async getByID (id) {
        return await UserManager.findById(id).lean();
    }

    static async updateAsync (id,userForUpdate) {
        console.log(`userForUpdate: ${JSON.stringify(userForUpdate)}`)

        return await UserManager.updateOne({
            _id: id,
        },userForUpdate).lean();
    }

    static async getBriefInfo (username) {

        return await UserManager
        .findOne({username:username})
        .select(`point username name avatar phone email address intro totalStar totalFollowers`)
    }

}
