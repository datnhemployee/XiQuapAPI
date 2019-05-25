const Stock = require('../model/Stock').Model;
const StockManager = require('../model/Stock').Model;

module.exports = class StockRepository {
    static async insert (request) {
        
        let temp = new Stock(request);
        await temp.save()

        return temp;
    }

    static async getByPage (page,isAdmin = false) {
        
        return !isAdmin? await StockManager
            .find({
                vendee: null,
            })
            .populate({
                path:  'owner',
                model: 'Account',
                select: 'name _id totalStar avatar' 
            })
            .sort({_id: -1})
            .skip(page * 6)
            .limit(6)
            : await StockManager
            .find()
            .populate({
                path:  'owner',
                model: 'Account',
                select: 'name _id totalStar avatar' 
            })
            .sort({_id: -1})
            .skip(page * 6)
            .limit(6);
    }

    static get getOption () {
        return require(`../document/StockDocument`).getOption;
    }

    static async findById (id) {

        const query = {
            default: async function () {
                return await StockManager
                    .findById(id)
                    .populate({
                        path:  'owner',
                        model: 'Account',
                        select: 'name _id totalStar avatar' 
                    })
                    .lean();
            }
        }
        
        return await query.default();
    }

   

    static async updateAsync (id, itemUpdate) {
        return await StockManager.updateOne(
            {_id: id},
            itemUpdate
        );
    }

}
