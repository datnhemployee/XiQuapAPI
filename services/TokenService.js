const getRandomString = require('../Helpers/StringGenerater').getRandomString;
const hash = require('../Helpers/StringGenerater').hash;
const Secrect = require('../Secrect');
module.exports = class TokenService { 
    static getToken (
        username = '',
        name = '',
        )  {
        const header = Buffer.from(
            JSON.toString(Secrect.headers))
            .toString('hex');
        const payload = Buffer.from(
            JSON.toString({
                username,
                name,
            }))
            .toString('hex');
        console.log('password',`${header}.${payload}`);
        const secrect = hash(
            `${header}.${payload}`,
            Buffer.from(
            JSON.toString(
                Secrect.signature
            ))
            .toString('hex'));

        return `${header}.${payload}.${secrect}`;
    }
}