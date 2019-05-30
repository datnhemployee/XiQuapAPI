const AccountManager = require('../model/Account').Model;
const Account =  require('../model/Account').Model;
const getRandomString = require('../Helpers/StringGenerater').getRandomString;
const hash = require('../Helpers/StringGenerater').hash;
const {Codes} = require('../dtos/Response');
const Secrect = require('../Secrect');

module.exports = class AuthRepository {
    static async updateToken (
        token,
        username,
    ) {
        let user = await AuthRepository.hasUsername(username);

        if(!!user) {
            await AccountManager.updateOne({
                username: username
            }, {
                token: token,
            }).lean();

            return {
                code: Codes.Success,
                content: token,
            }
        }

        return {
            code: Codes.Exception,
            content: 'Không tồn tại người dùng này.',
        }
    }

    static async logIn (userForLogIn) {
        let user = await AuthRepository.hasUsername(userForLogIn.username);

        if(!!user) {
            userForLogIn.password = AuthRepository.getHashPassword(
                userForLogIn,
                user.salt,
            );

            if(userForLogIn.password === user.password){

                return {
                    code: Codes.Success,
                    content: user,
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
        return !!(await AuthRepository
            .has('email',email));
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
        console.log(`hasEmail ${JSON.stringify(hasEmail)}`)
        
        if(hasEmail) return {
            code: Codes.Exception,
            content: 'Đang kiểm duyệt.'
        }

        let user = await AuthRepository.hasUsername(username);
        console.log(`user ${JSON.stringify(user)}`)

        if(!!user) return {
            code: Codes.Exception,
            content: 'Đang kiểm duyệt.'
        }

        userForRegister.salt = getRandomString(20);
        let hashPasswword = AuthRepository.getHashPassword(
            userForRegister,
            userForRegister.salt,
        );
        console.log('hashPasswword: ' +JSON.stringify(hashPasswword));
        userForRegister.password = hashPasswword;


        const UserToDB = new Account(userForRegister);
        try {
            await UserToDB.save();
        } catch (err) {
            return {
                code: Codes.Exception,
                content: 'Đang kiểm duyệt.'
            }
        }
        console.log(`UserToDB ${JSON.stringify(UserToDB)}`)


        return {
            code: Codes.Success,
            content: {
                name: UserToDB.name,
                token: UserToDB.token,
                avatar: UserToDB.avatar,
                isAdmin: UserToDB.role === 1,
                point: UserToDB.point,
            }
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
