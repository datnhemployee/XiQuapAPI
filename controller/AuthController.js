const Account = require('../model/Account');
const Secrect = require('../Secrect');
const Crypto = require('crypto');
const Functions = require('../constant/Message');
const AuthService = require('../services/AuthService');
const UserForRegister = require('../dtos/UserForRegister');
const {Default,Codes,Contents} = require('../dtos/Response');

class AuthController {
    constructor () {}

    static start (io) {
        io.on(Functions.CONNECTION, function (socket){
            console.log('Co nguoi ket noi', socket.id)

            socket.on(Functions.Register, async function(data){

                let userForRegister = {...data};

                let registerResult = await AuthController.register(userForRegister);
               
                socket.emit(Functions.Register,registerResult);
            })
        })
    }

    static async register (userForRegister = {
        ...UserForRegister}) { 
        
        userForRegister = {
            ...UserForRegister,
            ...userForRegister,
        }


        const noValue = !userForRegister.username 
            || !userForRegister.password 
            || !userForRegister.name

            let res = Default;
            if(noValue) {
                res.code = Codes.NotFound;
                res.content = Contents.NotFound;
                return res;
            }
            
            let resgisterResult = AuthService.register(userForRegister);

            if(!resgisterResult){
                res.code = Codes.NotFound;
                res.content = resgisterResult;
                return res;
            }
            res.code = Codes.Success;
            res.content = resgisterResult;
            return res;
        }

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

    static async logIn () {
        
        if(!username || !password)
            return 

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

    
}

module.exports = AuthController;