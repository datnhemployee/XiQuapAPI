const ItemRepository = require('../repositories/ItemRepository');
const {Codes} = require('../dtos/Response');
const SessionRepository = require('../repositories/SessionRepository');
const AuthRepository = require('../repositories/AuthRepository');
const TypeRepository = require('../repositories/TypeRepository');
const UserRepository = require('../repositories/UserRepository');

module.exports = class ItemService {

    
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
                totalOwned,
            } = userFromRepo;

            request.owner = _id;
            request.point = point;

            let itemInsertResult = await ItemRepository.insert(request);

            // console.log(`itemInsertResult: ${JSON.stringify(itemInsertResult)}`)

            await UserRepository.updateAsync(
                _id,
                {
                    $set: {
                        totalOwned: totalOwned + 1,
                    },
                    $push: {
                        ownedItem: itemInsertResult._id,
                    }
                }
            );

            return {
                code: Codes.Success,
            }
        }


        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async getMyShop (pageToGet) {
        let {
            token,
            page,
        } = pageToGet;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem bài đăng khi chưa đăng nhập.`,
        }

        let {
            username,
        } = session;

        let getItemsResult = await UserRepository.getMyShopByPage(username,page);
        if(!getItemsResult){
            return {
                code: Codes.Exception,
                content: ` Không còn vật phẩm trao đổi. `,
            }
        }
        getItemsResult.ownedItem = getItemsResult.ownedItem.map((val)=>{
            return {
                ...val,
                isLike: getItemsResult.like.findIndex((likeEle) => likeEle.toString() == val._id) != -1,
            }
        })
        return {
            code: Codes.Success,
            content: getItemsResult.ownedItem,
        }
    }

    static async getWaitting (pageToGet) {
        let {
            token,
            page,
        } = pageToGet;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem bài đăng khi chưa đăng nhập.`,
        }

        let {
            username,
        } = session;

        let getItemsResult = await UserRepository.getWaittingItem(username,page);
        if(!getItemsResult){
            return {
                code: Codes.Exception,
                content: ` Không còn vật phẩm trao đổi. `,
            }
        }
        getItemsResult.waittingItem = getItemsResult.waittingItem.map((val)=>{
            return {
                ...val.item,
                isLike: getItemsResult.like.findIndex((likeEle) => likeEle.toString() == val.item._id) != -1,
            }
        })
        return {
            code: Codes.Success,
            content: getItemsResult.waittingItem,
        }
    }

    static async get (pageToGet) {
        let {
            token,
            page,
        } = pageToGet;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem bài đăng khi chưa đăng nhập.`,
        }

        let userFromDB = await AuthRepository.hasUsername(session.username);

        if(!userFromDB) return {
            code: Codes.Authorization,
            content: `Không tồn tại người dùng này.`,
        }

        let getItemsResult = await ItemRepository.getByPage(page);
        if(getItemsResult.length === 0){
            return {
                code: Codes.Exception,
                content: ` Không còn vật phẩm trao đổi. `,
            }
        }
        getItemsResult = getItemsResult.map((val) => {
            return {
                ...val,
                isLike: val.likeList.findIndex((val) => val.toString() == userFromDB._id.toString()) != -1,
            }
        })
        return {
            code: Codes.Success,
            content: getItemsResult,
        }
    }

    static async getItem (input) {
        let {
            token,
            _id,
            option,
        } = input;
        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể xem bài đăng khi chưa đăng nhập.`,
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

        let getItemsResult = await ItemRepository.findById(_id,option);
        if(!getItemsResult){
            return {
                code: Codes.Exception,
                content: ` Không tìm thấy bài viết tương ứng. `,
            }
        }

        getItemsResult = {
            ...getItemsResult,
            isLike: getItemsResult.likeList.findIndex((val) => {
                
                return val.toString() == userFromRepo._id.toString()}) != -1,
        }
        return {
            code: Codes.Success,
            content: getItemsResult,
        }
    }


    static async giveLike (input) {
        let {
            _id,
            token,
        } = input;

        let session = SessionRepository.findByToken(token);

        if(!session) return {
            code: Codes.Authorization,
            content: `Không thể thích bài viết khi chưa đăng nhập.`,
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

        let itemFromRepo = await ItemRepository.findById(_id);

        if (!itemFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại bài viết này.`,
            }
        }
        

        let likeIndex = itemFromRepo.likeList.findIndex((val) => {

            return val.toString() == userFromRepo._id.toString()
        });

        let isLike = true;
        
        let itemUpdate = {
            $set: {
                totalLike:  itemFromRepo.totalLike + 1,
            },
            $push: {
                likeList: userFromRepo._id,
            }
        }

        let userItemUpdate = {
            $push: {
                like: itemFromRepo._id,
            }
        }
        console.log(`likeIndex: ${JSON.stringify(likeIndex)}`)
        
        if(likeIndex != -1) {
            itemUpdate = {
                $set: {
                    totalLike:  itemFromRepo.totalLike - 1,
                },
                $pull: {
                    likeList:  userFromRepo._id,
                }
            }

            isLike = false;

            userItemUpdate = {
                $pull: {
                    like: itemFromRepo._id,
                }
            }
        } 
            console.log(`itemUpdate: ${JSON.stringify(itemUpdate)}`)
            console.log(`userItemUpdate: ${JSON.stringify(userItemUpdate)}`)

        try {
            await ItemRepository.updateAsync(
                _id,
                itemUpdate
            )
        } catch (updateItemException) {
            return {
                code: Codes.Error,
                content: `Không thể thực hiện cập nhật vật trao đổi vì ${JSON.stringify(updateItemException)}.`
            }
        }

        try {
            await UserRepository.updateAsync(
                userFromRepo._id,
                userItemUpdate
            )

            
        } catch (updateUserItemException) {
            return {
                code: Codes.Error,
                content: `Không thể thực hiện cập nhật chỗ người dùng vì ${JSON.stringify(updateUserItemException)}.`
            }
        }

        try {
            let itemFromRepo = await ItemRepository.findById(_id);
        
            return {
                code: Codes.Success,
                content: {
                    ...itemFromRepo,
                    isLike,
                }
            }
        } catch (finalResultException) {
            return {
                code: Codes.Error,
                content: ` Không thể thực hiện lấy bài viết tương ứng.`,
            }
            
        }

    }

    static async exchange (input) {
        let {
            token,
            _id,
            photoUrl,
            name,
            description
        } = input;

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

        let itemFromRepo = await ItemRepository.findById(_id);

        if (!itemFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại bài viết này.`,
            }
        }
        
        let itemUpdate = {
            $set: {
                totalItem: itemFromRepo.totalItem + 1,
            },
            $push: {
                itemList: {
                    name: name,
                    description: description,
                    photoUrl: photoUrl,
                    vendee: userFromRepo._id,
                }
            }
        }

        try {
            await ItemRepository.updateAsync(
                _id,
                itemUpdate
            );

        } catch (itemUpdateException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật bài viết vì ${JSON.stringify(itemUpdateException)}`
            }
        }

        let userItemUpdate = {
            $set: {
                totalWaitting: userFromRepo.totalWaitting + 1,
            },
            $push: {
                waittingItem: {
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
            itemFromRepo = await ItemRepository.findById(_id);
        } catch (itemGetException) {
            return {
                code: Codes.Error,
                content: ` Không thể lấy bài viết vì ${JSON.stringify(itemGetException)}`
            }
        }

        return {
            code: Codes.Success,
            content: itemFromRepo,
        }
    }

    static async approve (request) {
        let {
            token,
            _id,
            _idApproved,
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

        let itemFromRepo = await ItemRepository.findById(_id);

        if (!itemFromRepo) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại bài viết này.`,
            }
        }

        if (!!itemFromRepo.vendee) {
            return {
                code: Codes.Exception,
                content: `Đã chấp nhận trao đổi, không sửa dưới quyền người dùng.`,
            }
        }

        let approvedIndex = itemFromRepo.itemList.findIndex((val)=>val._id.toString()==_idApproved.toString());
        if (approvedIndex === -1) {
            return {
                code: Codes.Exception,
                content: `Không tồn tại vật trao đổi này.`,
            }
        }
        
        let itemUpdate = {
            $set: {
                vendee: userFromRepo._id,
            },
        }

        try {
            await ItemRepository.updateAsync(
                itemFromRepo._id,
                itemUpdate
            );

        } catch (itemUpdateException) {
            return {
                code: Codes.Error,
                content: ` Không thể cập nhật bài viết vì ${JSON.stringify(itemUpdateException)}`
            }
        }

        // let userItemUpdate = {
        //     $set: {
        //         totalAprroved: userFromRepo.totalAprroved + 1,
        //     },
        //     $push: {
        //         approvedItem: {
        //             item: _id,
        //             date: new Date(),
        //         },
        //     }
        // }

        // try {
        //     await UserRepository.updateAsync(
        //         userFromRepo._id,
        //         userItemUpdate
        //     );
        // } catch (userItemException) {
        //     return {
        //         code: Codes.Error,
        //         content: ` Không thể cập nhật người dùng vì ${JSON.stringify(userItemException)}`
        //     }
        // }

        try {
            itemFromRepo = await ItemRepository.findById(_id);
        } catch (itemGetException) {
            return {
                code: Codes.Error,
                content: ` Không thể lấy bài viết vì ${JSON.stringify(itemGetException)}`
            }
        }

        return {
            code: Codes.Success,
            content: itemFromRepo,
        }
    }


}