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
        on_emit(socket,Document.getMyStock,StockController.getMyStock);
        on_emit(socket,Document.getMyBought,StockController.getMyBought);
        on_emit(socket,Document.getOne,StockController.getOne);
        on_emitAll(io,socket,Document.buy,StockController.buy);
        on_emitAll(io,socket,Document.approve,StockController.approve);
        
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

    static async getMyStock (request) {
        let {
            token,
            page,
        } = request;

        console.log(`getMyStock: ${JSON.stringify(request)}`);

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
        
        let stocksFromService = await StockService.getMyStock(request);
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

    static async getMyBought (request) {
        let {
            token,
            page,
        } = request;

        // console.log(`pageToGet: ${JSON.stringify(request)}`);

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
        
        let stocksFromService = await StockService.getMyBought(request);
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

    static async approve (input) {
        let {
            token,
            _id,
        } = input;

        let constrainst = !token ?
            ` Không tìm thấy token. `:
            !_id ?
            ` Không tìm thấy Mã bài viết` :
            undefined;

        if (!constrainst) {
            return await StockService.approve(input);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async buy (request) {
        let {
            token,
            _id,
        } = request;

        let constrainst = !token ?
            ` Không tìm thấy token. `:
            !_id ?
            ` Không tìm thấy Mã vật phẩm` :
            undefined;

        if (!constrainst) {
            return await StockService.buy(request);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async getOne (input) {
        let {
            token,
            _id,
        } = input;

        let constrainst = !token ?
            ` Không tìm thấy token. `:
            !_id ?
            ` Không tìm thấy Mã vật phẩm` :
            undefined;
        
        
        if (!constrainst) {
            return await StockService.getOne(input);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    // #endregion
}

module.exports = StockController;