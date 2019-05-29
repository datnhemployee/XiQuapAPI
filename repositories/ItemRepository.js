const {Codes} = require('../dtos/Response');
const Item = require('../model/Item').Model;
const ItemManager = require('../model/Item').Model;

module.exports = class ItemRepository {
    static async insert (itemForInsert) {
        
        let temp = new Item(itemForInsert);
        await temp.save()

        return temp;
    }

    static async getByPage (page) {
        return await ItemManager
            .find({
                vendee: null
            })
            .populate({
                path:  'owner',
                model: 'Account',
                select: 'name _id totalStar avatar' 
            })
            .sort({_id: -1})
            .skip(page * 5)
            .limit(5);
    }

    static get getOption () {
        return require(`../document/ItemDocument`).getOption;
    }

    static async findById (id,option) {

        const Options = ItemRepository.getOption;
        const query = {
            [Options.population.itemList]: async function () {
                return await ItemManager
                    .findById(id)
                    .populate({
                        path:  'itemList.vendee',
                        model: 'Account',
                        select: 'name _id totalStar' 
                    })
                    .populate({
                        path:  'owner',
                        model: 'Account',
                        select: 'name _id totalStar' 
                    })
                    .populate({
                        path:  'vendee',
                        model: 'Account',
                        select: 'name _id totalStar' 
                    })
                    .lean();
            },
            default: async function () {
                return await ItemManager
                    .findById(id)
                    .populate({
                        path:  'owner',
                        model: 'Account',
                        select: 'name _id totalStar' 
                    })
                    .populate({
                        path:  'vendee',
                        model: 'Account',
                        select: 'name _id totalStar avatar' 
                    })
                    .lean();
            }
        }
        
        if (!!query[option])
            return await query[option]();
        return await query.default();
    }

   

    static async updateAsync (id, itemUpdate) {
        return await ItemManager.updateOne(
            {_id: id},
            itemUpdate
        );
    }

}
