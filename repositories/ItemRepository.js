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
            .find()
            .sort({_id: -1})
            .skip(page * 5)
            .limit(5);
    }

    static async findById (id) {
        return await ItemManager
            .findById(id)
            .lean();
    }

    static async updateAsync (id, itemUpdate) {
        return await ItemManager.updateOne(
            {_id: id},
            itemUpdate
        );
    }

}
