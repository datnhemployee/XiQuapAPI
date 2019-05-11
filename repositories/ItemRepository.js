const {Codes} = require('../dtos/Response');
const AuthRepository = require('./AuthRepository');
const Item = require('../model/Item').Model;


module.exports = class ItemRepository {
    static async addItem (itemForAdd) {
        let user = await AuthRepository.hasToken(itemForAdd.token);
        let type = await TypeRepository.hasName(itemForAdd.typeName);

        let error = !user ?
            'Không tìm thấy người dùng này.':
                !type ?
            'Không tìm thấy loại vật phẩm tương ứng.':
            undefined;

        if(!error) {
            itemForAdd = {
                ...itemForAdd,
                ownerAvatar: user.avatar,
                ownerId: user._id,
                typeName: type.name,
                point: type.point,
            }
            
            let temp = new Item(itemForAdd);
            let result = {
                code: Codes.Success,
            }
            await temp.save((err,res) => {
                if(!!err){
                    result = {
                        code:Codes.Exception,
                        content: err,
                    }
                    return;
                }
                result = {
                    code:Codes.Success,
                    content: res,
                }
            })

            return result;
        }

        return {
            code: Codes.Exception,
            content: error,
        }
    }

    

}
