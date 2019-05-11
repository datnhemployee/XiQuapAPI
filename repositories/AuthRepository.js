const AccountManager = require('../model/Account').Model;
const Account =  require('../model/Account').Model;
const getRandomString = require('../Helpers/StringGenerater').getRandomString;
const hash = require('../Helpers/StringGenerater').hash;
const {Codes} = require('../dtos/Response');

module.exports = class AuthRepository {
    static async logIn (userForLogIn) {
        let user = await AuthRepository.hasUsername(userForLogIn.username);

        if(!!user) {
            userForLogIn.password = AuthRepository.getHashPassword(
                userForLogIn,
                user.salt,
            );

            if(userForLogIn.password === user.password){

               let {
                    _id,
                    name,
                } = user;

                return {
                    code: Codes.Success,
                    content: {
                        id: _id,
                        name: name,
                    }
                }
            }
        }

        return {
            code: Codes.Exception,
            content: 'Tên tài khoản hoặc mật khẩu chưa chính xác.',
        }
    }

    static async hasToken (
        token,
    ) {
        return await AuthRepository
            .has('token',token);
    }

    static async hasEmail (
        email,
    ) {
        return await !!AuthRepository
            .has('email',email);
    }

    static async hasUsername (
        username
    ) {
        return await AuthRepository
            .has('username',username);
    }

    static async has(field,value) {
        const query = {
            [field]:value,
        };
        return await AccountManager
            .findOne(query)
            .lean();
    }

    static getHashPassword (
        user,
        salt) {

        
        

        return hash(
            user.password,
            salt
        )
    }

    static async register (userForRegister) {

        let {
            username,
            email,
        } = userForRegister;

        let hasEmail = await AuthRepository.hasEmail(email);
        
        if(hasEmail) return {
            code: Codes.Exception,
            content: 'Tên tài khoản đã tồn tại hoặc email đã tồn tại.'
        }

        let user = await AuthRepository.hasUsername(username);

        if(!!user) return {
            code: Codes.Exception,
            content: 'Tên tài khoản đã tồn tại hoặc email đã tồn tại.'
        }

        userForRegister.salt = getRandomString(20);
        let hashPasswword = AuthRepository.getHashPassword(
            userForRegister,
            userForRegister.salt,
        );
        console.log('hashPasswword: ' +JSON.stringify(hashPasswword));
        userForRegister.password = hashPasswword;


        let hasError = false;
        const UserToDB = new Account(userForRegister);
        await UserToDB.save((err)=>{
            console.log('err: '+ JSON.stringify(err))    
            if(!!err) hasError = true;
        });

        if(!hasError) return {
            code: Codes.Exception,
            content: 'Lỗi kết nối cơ sở dữ liệu.',
        };
        return {
            code: Codes.Success,
            content: UserToDB,
        };
    }

    static async logOut (userForLogOut) {
        let {
            token,
        } = userForLogOut;

        let user = await AccountManager.findOne({
            token: token,
        }).lean();

        if(!!user) {
            await AccountManager.findOneAndUpdate({
                token: token,
            }, {
                token: '',
            });

            return {
                code: Codes.Success,
                content: 'Đăng xuất thành công',
            }
        }

        return {
            code: Codes.Exception,
            content: 'Đăng xuất thất bại',
        }
    }
}
