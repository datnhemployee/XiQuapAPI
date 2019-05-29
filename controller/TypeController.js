const {Codes} = require('../dtos/Response');
const on_emit = require('./Controller').on_emit;
const Document = require('../document/TypeDocument');
const TypeService = require('../services/TypeService');

class TypeController {
    constructor () {}

    static start (io,socket) {
        on_emit(socket,Document.getAll,TypeController.getAll);
    }

    //#region Implementation

    static async getAll () {
        const typeReturn = await TypeService.getAll();
        return {
            code: Codes.Success,
            content: {list: typeReturn}
        }
    }

    // #endregion
}

module.exports = TypeController;