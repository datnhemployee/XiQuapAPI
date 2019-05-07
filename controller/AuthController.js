const Account = require('../model/Account');
const Secrect = require('../Secrect');
const Crypto = require('crypto');
const User_Role = require('../model/Role').USER;
const ActionResult = require('../ActionResult');

class AuthController {
    constructor () {}

    static async getToken (
        username = null,
        name = null,
        role = null,
    ) {
        const header = Buffer.from(
            JSON.toString(Secrect))
            .toString();
        const hmac = Crypto.createHmac(
            'sha512',
            Buffer.from(
                JSON.toString(Secrect))
                .toString(),
        )
        const payload = Buffer.from(
            JSON.toString({
                username,
                name,
                role,
            }))
            .toString();;
        const secrect = hmac.digest('base64');

        return `${header}.${payload}.${secrect}`;
    }

    static async logIn (
        username = null,
        password = null,
    ) {
        let user = null;
        let rs = false;

        user = await AuthController.isExistedUsername(username);

        if(!user)
            return false;
        
        Crypto.pbkdf2(
            password,
            user.salt,
            1000,
            512,
            'sha512',
            (err,derivedKey) => {
                if(err) {
                    console.log(`ERROR: fn LogIn hashedPassword ${JSON.stringify(err)}`)
                    return;
                }
                rs = derivedKey === user.password;
            }
        )
        return rs;
    }   

    static async isExistedUsername (
        username = null,
    ) {
        return await Account.Model.findOne({
            username: username,
        }).lean();
    }

    static async register  (
        username = null,
        password = null,
        nickName = null,
        phone = null,
        email = null,
        address = null,
        role = User_Role,
        star = {
            total: 0,
            list: [],
        },
        friends = [],
    ) {
        let user = null;

        user = await AuthController.isExistedUsername(username);

        if(!user) return new ActionResult(
            ActionResult.CODE.ERROR,
            ActionResult.EXCEPTION.VALID_INVIDUAL_INFORMATION,
            true,
        )

        let rs = await Account.Model.insertMany([{
            username ,
            password ,
            nickName ,
            phone ,
            email,
            address,
            role,
            star,
            friends,
        }])

        if(!rs) return new ActionResult(
            ActionResult.CODE.ERROR,
            ActionResult.EXCEPTION.DB_NO_SERVE,
            true,
        )

        return new ActionResult(
            ActionResult.CODE.OK,
            user,
            true,
        );
    }
}

module.exports = AuthController;