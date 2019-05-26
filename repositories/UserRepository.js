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
        .select(`-like -waittingItem -followers -ownedItem -stockList -boughtList -chats`)
    }

    static async getMyShopByPage (username, page) {
        return await UserManager
            .findOne({username:username})
            .select(`ownedItem`)
            .populate({
                path:  'ownedItem',
                model: 'Item',
                select: '-itemList', 
            })
            .populate({
                path:  'ownedItem.vendee',
                model: 'Account',
                select: '_id name avatar', 
            })
            .sort({_id: -1})
            .skip(page * 5)
            .limit(5);
    }

    static async getWaittingItem (username, page) {
        return await UserManager
            .findOne({username:username})
            .select(`waittingItem`)
            .populate({
                path:  'waittingItem.item',
                model: 'Item',
                select: '-itemList', 
                populate: {
                    path:  'owner',
                    model: 'Account',
                    select: '_id name avatar', 
                }
            })
            .sort({_id: -1})
            .skip(page * 5)
            .limit(5);
    }

    static async getMyStock (username, page) {
        return await UserManager
            .findOne({username:username})
            .select(`stockList -_id`)
            .populate({
                path:  'stockList',
                model: 'Stock',
            })
            .sort({_id: -1})
            .skip(page * 6)
            .limit(6);
    }

    static async getMyBought (username, page) {
        return await UserManager
            .findOne({username:username})
            .select(`boughtList`)
            .populate({
                path:  'boughtList.stock',
                model: 'Stock',
            })
            .sort({_id: -1})
            .skip(page * 6)
            .limit(6);
    }

}
