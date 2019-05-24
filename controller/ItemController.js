const ItemService = require('../services/ItemService');
const ItemForInsert = require('../dtos/ItemForInsert');
const {Codes} = require('../dtos/Response');
const on_emit = require('./Controller').on_emit;
const on_emitAll = require('./Controller').on_emitAll;
const Document = require('../document/ItemDocument');
const getOption = require(`../document/ItemDocument`).getOption;

class ItemController {
    constructor () {}

    static start (io,socket) {

        on_emit(socket,Document.insertItem,ItemController.insert);
        on_emit(socket,Document.getItems,ItemController.getItems);
        on_emit(socket,Document.getItem,ItemController.getItem);
        on_emitAll(io,socket,Document.giveLike,ItemController.giveLike);
        on_emitAll(io,socket,Document.exchange,ItemController.exchange);
        // listen(socket,Methods.getPage,SessionController);
        // listen(socket,Methods.getItem,SessionController);
        // listen(socket,Methods.likeItem,SessionController);
        // listen(socket,Methods.ItemItem,SessionController);
        // listen(socket,Methods.approveItem,SessionController);
        
    }

    //#region Implementation

    static async insert (
        itemForInsert = {...ItemForInsert},
        socket,
    ) {
        itemForInsert = {
            ...ItemForInsert,
            ...itemForInsert,
        }
        let {
            mainPicture,
            ownerName,
            name,
            typeName,
        
            token,
        } = itemForInsert;

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
            return await ItemService.insert(itemForInsert);
        } catch (insertException) {
            return {
                code: Codes.Exception,
            }
        }
    }

    static async getItems (pageToGet) {
        let {
            token,
            page,
        } = pageToGet;

        console.log(`pageToGet: ${JSON.stringify(pageToGet)}`);

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
        
        let postsFromService = await ItemService.get(pageToGet);
        if(postsFromService.code === Codes.Success){
            return {
                code: Codes.Success,
                content: {
                    list: postsFromService.content,
                }
            }
        }
        return postsFromService;
    }

    static async exchange (input) {
        let {
            token,
            _id,
            photoUrl,
            name,
            description
        } = input;

        let constrainst = !token ?
            ` Không tìm thấy token. `:
            !_id ?
            ` Không tìm thấy Mã bài viết` :
            !name ? 
            ` Không tìm thấy tên của vật phẩm trao đổi`:
            undefined;

        if (!constrainst) {
            return await ItemService.exchange(input);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async getItem (input) {
        let {
            token,
            _id,
            option,
        } = input;

        let constrainst = !token ?
            ` Không tìm thấy token. `:
            !_id ?
            ` Không tìm thấy Mã bài viết` :
            undefined;
        
        option = !option ? 
            getOption.population.itemList:
            option;
        
        input = {
            ...input,
            option,
        }

        if (!constrainst) {
            return await ItemService.getItem(input);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async giveLike (input) {
        let {
            _id,
            token,
        } = input;

        console.log(`GiveLike ${JSON.stringify(input)}`)
        let constrainst = !_id ?
            `Không tìm thấy Mã bài viết.`:
            !token ?
            `Không tìm thấy token`:
            undefined;

        if(constrainst) {
            return {
                code: Codes.Exception,
                content: constrainst,
            }
        }

        return await ItemService.giveLike(input);
    } 

    // #endregion
}

module.exports = ItemController;