const ItemRepository = require('../repositories/ItemRepository');
const {Codes} = require('../dtos/Response');
const SessionRepository = require('../repositories/SessionRepository');
const AuthRepository = require('../repositories/AuthRepository');
const TypeRepository = require('../repositories/TypeRepository');
const UserRepository = require('../repositories/UserRepository');

module.exports = class ItemService {

    static async insert (itemForInsert) {

        let {
            name,
        } = itemForInsert
        let constrainst = name.length < 8 ?
            'Tên vật phẩm phải trên 8 kí tự.':
            undefined;
        
        if(!constrainst){
            let {
                token,
                typeName,
            } = itemForInsert;
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
            delete itemForInsert.token;

            let {
                _id,
                avatar,
                totalItem,
            } = userFromRepo;

            itemForInsert.ownerId = _id;
            itemForInsert.ownerAvatar = avatar;
            itemForInsert.point = point;

            let itemInsertResult = await ItemRepository.insert(itemForInsert);

            // console.log(`itemInsertResult: ${JSON.stringify(itemInsertResult)}`)

            await UserRepository.updateAsync(
                _id,
                {
                    $set: {
                        totalItem: totalItem + 1,
                    },
                    $push: {
                        item: {
                            Id: itemInsertResult._id,
                        }
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

        let getItemsResult = await ItemRepository.getByPage(page);
        if(getItemsResult.length === 0){
            return {
                code: Codes.Exception,
                content: ` Không còn vật phẩm trao đổi. `,
            }
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

            return val.Id.toString() == userFromRepo._id.toString()
        });
        
        let itemUpdate = {
            $set: {
                totalLike:  itemFromRepo.totalLike + 1,
            },
            $push: {
                likeList: {
                    Id: userFromRepo._id,
                }
            }
        }

        let userItemUpdate = {
            $push: {
                like: {
                    Id: itemFromRepo._id,
                }
            }
        }
        console.log(`likeIndex: ${JSON.stringify(likeIndex)}`)
        
        if(likeIndex != -1) {
            itemUpdate = {
                $set: {
                    totalLike:  itemFromRepo.totalLike - 1,
                },
                $pull: {
                    likeList: {
                        Id: userFromRepo._id,
                    }
                }
            }

            userItemUpdate = {
                $pull: {
                    like: {
                        Id: itemFromRepo._id,
                    }
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
                content: itemFromRepo
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
        
        let itemUpdate = {
            $set: {
                totalItem: itemFromRepo.totalItem + 1,
            },
            $push: {
                itemList: {
                    name: name,
                    description: description,
                    photoUrl: photoUrl,
                    vendeeId: userFromRepo._id,
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