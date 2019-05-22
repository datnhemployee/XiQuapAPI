const getRandomString = require('../Helpers/StringGenerater').getRandomString;
const hash = require('../Helpers/StringGenerater').hash;
const Secrect = require('../Secrect');

module.exports = class TokenRepository { 
    static getToken (
        username = '',
        name = '',
        )  {
        const header = Buffer.from(
            JSON.toString(Secrect.headers))
            .toString('hex').slice(1,10);
        const payload = Buffer.from(
            JSON.toString({
                username,
                name,
            }))
            .toString('hex').slice(1,10);
        const secrect = hash(
            `${header}.${payload}`,
            JSON.toString(
                Secrect.signature
            )).slice(1,10);
        let token = `${header}.${payload}.${secrect}`;
        // console.log(`token: ${token}`);
        return token;
    }
}