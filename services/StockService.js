const StockRepository = require('../repositories/StockRepository');
const {Codes} = require('../dtos/Response');
const SessionRepository = require('../repositories/SessionRepository');
const AuthRepository = require('../repositories/AuthRepository');
const TypeRepository = require('../repositories/TypeRepository');
const UserRepository = require('../repositories/UserRepository');

module.exports = class StockService {

    static async insert (request) {

        let {
            name,
        } = request
        let constrainst = name.length < 8 ?
            'Tên vật phẩm phải trên 8 kí tự.':
            undefined;
        
        if(!constrainst){
            let {
                token,
                typeName,
            } = request;
            let session = SessionRepository.findByToken(token);

            if(!session) return {
                code: Codes.Authorization,
                content: `Không thể thực hiện đăng bài khi chưa đăng nhập.`,
            }
            // console.log(`insert Item ${JSON.stringify(itemForInsert)}`);

            const typeFromRepo = await TypeRepository.hasType(typeName);
            // console.log(`Loại vật phẩm tìm thấy ${JSON.stringify(typeFromRepo)}`);
            if(!typeFromRepo) { 
                return {
                    code: Codes.Exception,
                    content: `Không tồn tại loại vật phẩm này.`,
                }
            }

            let {
                point,
            } = typeFromRepo;

            let {
                username,
            } = session;

            let userFromRepo = await AuthRepository.hasUsername(username);
            delete request.token;

            let {
                _id,
                totalStock,
            } = userFromRepo;

            request.owner = _id;
            request.point = point;


            let itemInsertResult = await StockRepository.insert(request);

            console.log(` Đã chạy đến Stock InsertService: ${JSON.stringify(itemInsertResult)}`)

            // Người dùng sẽ không được cộng điểm cho đến khi được ban quản trị chấp nhận
            await UserRepository.updateAsync(
                _id,
                {
                    $set: {
                        totalStock: totalStock + 1,
                    },
                    $push: {
                        stockList: itemInsertResult._id,
                    }
                }
            );

            return {
                code: Codes.Success,
                content: ` Vừa có người thêm vật phẩm vào kho.`,
            }
        }


        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async get (request) {
        let {
            token,
            page,
        } = request;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem vật tặng phẩm đăng khi chưa đăng nhập.`,
        }

        let {
            username,
        } = session;

        let userFromRepo = await AuthRepository.hasUsername(username);

        let {
            role,
        } = userFromRepo;

        let getItemsResult = await StockRepository.getByPage(page,role === 1);
        if(getItemsResult.length === 0){
            return {
                code: Codes.Exception,
                content: ` Không còn vật phẩm trong kho. `,
            }
        }
        return {
            code: Codes.Success,
            content: getItemsResult,
        }
    }

    static async getOne (request) {
        let {
            token,
            _id,
        } = request;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem bài đăng khi chưa đăng nhập.`,
        }

        let getItemsResult = await StockRepository.findById(_id);
        if(!getItemsResult){
            return {
                code: Codes.Exception,
                content: ` Không tìm thấy bài viết tương ứng. `,
            }
        }
        return {
            code: Codes.Success,
            content: getItemsResult,
        }
    }

    static async buy (request) {
        let {
            token,
            _id,
        } = request;

        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể đăng trao đổi khi chưa đăng nhập.`,
        }

        let {
            username,
        } = session;

        let userFromRepo = await AuthRepository.hasUsername(username);
        
        if (!userFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại người dùng này.`,
            }
        }

        let stockFromRepo = await StockRepository.findById(_id);

        if (!stockFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại bài viết này.`,
            }
        }

        if (userFromRepo.point < stockFromRepo.point)
            return {
                code: Codes.Exception,
                content: ` Không đủ điểm để đổi phần quà này.`,
            }
        
        if (!!userFromRepo.vendee)
        return {
            code: Codes.Exception,
            content: ` Phần quà đã bị đổi.`,
        }
        let stockUpdate = {
            $set: {
                vendee: userFromRepo._id,
            },
        }

        try {
            await StockRepository.updateAsync(
                _id,
                stockUpdate
            );

        } catch (itemUpdateException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật vật phẩm vì ${JSON.stringify(itemUpdateException)}`
            }
        }

        let userItemUpdate = {
            $set: {
                point: userFromRepo.point - stockFromRepo.point,
                totalBought: userFromRepo.totalBought + 1,
            },
            $push: {
                boughtList: {
                    item: _id,
                    date: new Date(),
                }
            },
        }

        try {
            await UserRepository.updateAsync(
                userFromRepo._id,
                userItemUpdate
            );
        } catch (userItemException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật người dùng vì ${JSON.stringify(userItemException)}`
            }
        }

        try {
            stockFromRepo = await StockRepository.findById(_id);
        } catch (stockGetException) {
            return {
                code: Codes.Error,
                content: ` Không thể lấy vật phẩm vì ${JSON.stringify(stockGetException)}`
            }
        }

        return {
            code: Codes.Success,
            content: stockFromRepo,
        }
    }

    static async approve (request) {
        let {
            token,
            _id,
        } = request;

        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể đăng trao đổi khi chưa đăng nhập.`,
        }

        let {
            username,
        } = session;

        let userFromRepo = await AuthRepository.hasUsername(username);
        
        if (!userFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại người dùng này.`,
            }
        }

        if (userFromRepo.role !== 1 ){
            return {
                code: Codes.Exception,
                content: `Không phải admin.`,
            }
        }

        let stockFromRepo = await StockRepository.findById(_id);

        if (!stockFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại vật phẩm này.`,
            }
        }
        
        let stockUpdate = {
            $set: {
                approve: !stockFromRepo.approve,
            },
        }
        console.log(`\n`)
        console.log(`stock Update 1: ${stockUpdate}`)
        console.log(`stockFromRepo 1: ${stockFromRepo}`)
        console.log(`\n`)

        try {
            await StockRepository.updateAsync(
                _id,
                stockUpdate
            );

        } catch (stockUpdateException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật vật phẩm vì ${JSON.stringify(stockUpdateException)}`
            }
        }

        try {
            stockFromRepo = await StockRepository.findById(_id);
        } catch (itemGetException) {
            return {
                code: Codes.Error,
                content: ` Không thể lấy vật phẩm vì ${JSON.stringify(itemGetException)}`
            }
        }

        let userStockUpdate = {
            $set: {
                point: userFromRepo.point + stockFromRepo.point,
            },
        }
        

        if (!stockFromRepo.approve) {
            userStockUpdate = {
                $set: {
                    point: userFromRepo.point - stockFromRepo.point,
                    totalStock: userFromRepo.totalStock - 1,
                },
                $pull: {
                    stockList: stockFromRepo._id,
                }
            }
        }

        console.log(`\n`)
        console.log(`stock Update 2: ${stockFromRepo}`)
        console.log(`stockFromRepo 2: ${userStockUpdate}`)
        console.log(`\n`)
        try {
            await UserRepository.updateAsync(
                userFromRepo._id,
                userStockUpdate
            );
        } catch (userStockException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật người dùng vì ${JSON.stringify(userStockException)}`
            }
        }

        return {
            code: Codes.Success,
            content: stockFromRepo,
        }
    }


}