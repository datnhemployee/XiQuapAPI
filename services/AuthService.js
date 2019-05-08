const AuthRepository = require('../repositories/AuthRepository');
const UserToLogIn = require('../dtos/UserToLogIn');

module.exports = class AuthService {
    constructor () {}

    async logIn ({
        username,
        password,
    } = {...UserToLogIn}) {

        return await this._repo.logIn({
            username,
            password,
        });
    }

    static async register (userForRegister) {

        const constrainst = 
            userForRegister.username.length < 8 ? 
                'Tên tài khoản phải có độ dài trên 8 kí tự': 
            userForRegister.password.length < 8 ?
                'Mật khẩu phải có độ dài trên 8 kí tự': 
            userForRegister.name.length < 8 ?
                'Tên người dùng phải trên 8 kí tự':
                undefined;
        if ( !constrainst ){

            return await AuthRepository.register(userForRegister);
        }
        return constrainst;
    }
}