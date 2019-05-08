const AccountManager = require('../model/Account').Model;
const Mongoose = require('mongoose');
const Account =  require('../model/Account').Model;
const getRandomString = require('../Helpers/StringGenerater').getRandomString;
const hash = require('../Helpers/StringGenerater').hash;

module.exports = class AuthRepository {

    constructor () {
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
    
    logIn () {
    }

    static async hasUsername (
        username = null,
    ) {
        const query = {
            username: username,
        };
        const projection = `username`;

        return !!(await AccountManager
            .findOne(query)
            .select(projection)
            .lean());
    }

    static async hashPasswordAndCreateSalt (
        userForRegister, 
        isCheckUsername = false) {
        let {
            username,
        } = userForRegister;

        if (!isCheckUsername){
            let hasUsername = 
                await AuthRepository.hasUsername(username);

            if(hasUsername) return null;
        }


        userForRegister.salt = getRandomString(20);

        userForRegister.password = hash(
            userForRegister.password,
            userForRegister.salt)

    }

    static async register (userForRegister) {

        let {
            username,
        } = userForRegister;

        let hasUsername = await AuthRepository.hasUsername(username);

        if(hasUsername) return null;

        await AuthRepository.hashPasswordAndCreateSalt(
            userForRegister,
            true,
        );



        let hasError = false;
        const UserToDB = new Account(userForRegister);
        await UserToDB.save((err,res)=>{
            console.log('err: '+ JSON.stringify(err))    
            if(!!err) hasError = true;
        });

        if(!hasError) return null;
        return {...UserToDB};

    }
}