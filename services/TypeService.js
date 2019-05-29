const TypeRepository = require('../repositories/TypeRepository');

module.exports = class TypeService {
    static async getAll () {
        return await TypeRepository.getAll();
    }
}