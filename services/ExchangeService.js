const ItemRepository = require('../repositories/ItemRepository');
const {Codes} = require('../dtos/Response');

module.exports = class ExchangeService {

    static async addItem (itemForAdd) {

        let constrainst = itemForAdd.name.length < 8 ?
            'Tên vật phẩm phải trên 8 kí tự.':
            undefined;
        
        if(!constrainst){
            return await ItemRepository.addItem(itemForAdd);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

}