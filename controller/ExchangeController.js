const ExchangeService = require('../services/ExchangeService');
const ItemForAdd = require('../dtos/ItemForAdd');
const {Codes} = require('../dtos/Response');
const listen = require('./Controller');


const Methods = {
    addItem: 'exchange-add-item',
    getPage: 'exchange-get-page',
    getItem: 'exchange-get-item',
    likeItem: 'exchange-like',
    exchangeItem: 'exchange-item',
    approveExchange: 'exchange-approve',
};

class ExchangeController {
    constructor () {}

    static start (socket,SessionController) {

        listen(socket,Methods.Register,ExchangeController.addItem,SessionController);
        // listen(socket,Methods.getPage,SessionController);
        // listen(socket,Methods.getItem,SessionController);
        // listen(socket,Methods.likeItem,SessionController);
        // listen(socket,Methods.exchangeItem,SessionController);
        // listen(socket,Methods.approveExchange,SessionController);
        
    }

    //#region Implementation

    static async addItem (
        itemForAdd = {...ItemForAdd},
        sessionController,
        session,
    ){
        itemForAdd = {
            ...ItemForAdd,
            ...itemForAdd,
        }
        let {
            mainPicture,
            name,
            typeName,
        
            token,
        } = itemForAdd;

        const error = !mainPicture ?
            'Lỗi không thể đăng hình ảnh.':
                !name ?
            'Tên vật phẩm đã bị bỏ trống':
                !typeName ?
            'Chưa chọn loại vật phẩm':
                !token ?
            'Dữ liệu đính kèm yêu cầu chưa chính xác':
            undefined;

        if(!!error) 
            return {
                code: Codes.Exception,
                content: error,
            }
        
        let tokenIndex = sessionController
                .findIndex((val)=>
                    (val.token === token)
                    && (session === val.session));

        if(tokenIndex == -1){
            return {
                code: Codes.Authorization,
                content: 'Không có quyền thêm khi chưa đăng nhập.',
            }
        }

        return await ExchangeService.addItem(itemForAdd);
    }

    // #endregion
}

module.exports = ExchangeController;