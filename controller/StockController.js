const StockService = require('../services/StockService');
const StockForInsert = require('../dtos/StockForInsert');
const {Codes} = require('../dtos/Response');
const on_emit = require('./Controller').on_emit;
const on_emitAll = require('./Controller').on_emitAll;
const Document = require('../document/StockDocument');
const getOption = require(`../document/StockDocument`).getOption;

class StockController {
    constructor () {}

    static start (io,socket) {

        on_emitAll(io,socket,Document.insert,StockController.insert);
        on_emit(socket,Document.get,StockController.get);
        // on_emit(socket,Document.getItem,ItemController.getItem);
        // on_emitAll(io,socket,Document.giveLike,ItemController.giveLike);
        // on_emitAll(io,socket,Document.exchange,ItemController.exchange);
        // on_emitAll(io,socket,Document.approve,ItemController.approve);
        
        
    }

    //#region Implementation

    static async insert (
        request = {...StockForInsert},
        socket,
    ) {
        if (typeof request.approve !== 'undefined')
            return {
                code: Codes.Authorization,
                content: ` Bạn đã thay đổi mã nguồn. Đừng làm điều đó.`,
            }

        request = {
            ...StockForInsert,
            ...request,
        }
        let {
            mainPicture,
            ownerName,
            name,
            typeName,
        
            token,
        } = request;

        // const error = !mainPicture ?
        //     'Lỗi không thể đăng hình ảnh.':
        //         !name ?
        //     'Tên vật phẩm đã bị bỏ trống':
        //         !typeName ?
        //     'Chưa chọn loại vật phẩm':
        //         !token ?
        //     'Dữ liệu đính kèm yêu cầu chưa chính xác':
        //     undefined;

        const error = !name ?
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

        try {
            return await StockService.insert(request);
        } catch (insertException) {
            return {
                code: Codes.Error,
                content: `Lỗi hệ thống khi thêm vật phẩm vì ${insertException}`,
            }
        }
    }

    static async get (request) {
        let {
            token,
            page,
        } = request;

        console.log(`pageToGet: ${JSON.stringify(request)}`);

        let constrainst = !token ?
            `Không tìm thấy token.`:
            page === 0 ?
            undefined:
            !page ?
            `Không tìm thấy trang ở yêu cầu`:
            undefined;
        if(constrainst) {
            return {
                code: Codes.Exception,
                content: constrainst,
            }
        }
        
        let stocksFromService = await StockService.get(request);
        if(stocksFromService.code === Codes.Success){
            return {
                code: Codes.Success,
                content: {
                    list: stocksFromService.content,
                }
            }
        }
        return stocksFromService;
    }

    // static async exchange (input) {
    //     let {
    //         token,
    //         _id,
    //         photoUrl,
    //         name,
    //         description
    //     } = input;

    //     let constrainst = !token ?
    //         ` Không tìm thấy token. `:
    //         !_id ?
    //         ` Không tìm thấy Mã bài viết` :
    //         !name ? 
    //         ` Không tìm thấy tên của vật phẩm trao đổi`:
    //         undefined;

    //     if (!constrainst) {
    //         return await ItemService.exchange(input);
    //     }

    //     return {
    //         code: Codes.Exception,
    //         content: constrainst,
    //     }
    // }

    // static async approve (request) {
    //     let {
    //         token,
    //         _id,
    //         _idApproved,
    //     } = request;

    //     let constrainst = !token ?
    //         ` Không tìm thấy token. `:
    //         !_id ?
    //         ` Không tìm thấy Mã bài viết` :
    //         !_idApproved ? 
    //         ` Không tìm thấy mã chấp nhận`:
    //         undefined;

    //     if (!constrainst) {
    //         return await ItemService.approve(request);
    //     }

    //     return {
    //         code: Codes.Exception,
    //         content: constrainst,
    //     }
    // }

    // static async getItem (input) {
    //     let {
    //         token,
    //         _id,
    //         option,
    //     } = input;

    //     let constrainst = !token ?
    //         ` Không tìm thấy token. `:
    //         !_id ?
    //         ` Không tìm thấy Mã bài viết` :
    //         undefined;
        
    //     option = !option ? 
    //         getOption.population.itemList:
    //         option;
        
    //     input = {
    //         ...input,
    //         option,
    //     }

    //     if (!constrainst) {
    //         return await ItemService.getItem(input);
    //     }

    //     return {
    //         code: Codes.Exception,
    //         content: constrainst,
    //     }
    // }

    // static async giveLike (input) {
    //     let {
    //         _id,
    //         token,
    //     } = input;

    //     console.log(`GiveLike ${JSON.stringify(input)}`)
    //     let constrainst = !_id ?
    //         `Không tìm thấy Mã bài viết.`:
    //         !token ?
    //         `Không tìm thấy token`:
    //         undefined;

    //     if(constrainst) {
    //         return {
    //             code: Codes.Exception,
    //             content: constrainst,
    //         }
    //     }

    //     return await ItemService.giveLike(input);
    // } 

    // #endregion
}

module.exports = StockController;