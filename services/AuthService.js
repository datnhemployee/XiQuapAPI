const AuthRepository = require('../repositories/AuthRepository');
const {Codes} = require('../dtos/Response');
const checkEmail = require('../Helpers/StringGenerater').checkEmail;

module.exports = class AuthService {
    static validate_userForLogIn (userForLogIn) {
        return userForLogIn.username.length < 8 ? 
                    'Tên tài khoản phải có độ dài trên 8 kí tự': 
                userForLogIn.password.length < 8 ?
                    'Mật khẩu phải có độ dài trên 8 kí tự': 
                    undefined;
    }

    static async logIn (userForLogIn) {

        let constrainst = AuthService.validate_userForLogIn(userForLogIn) 
        
        if(!constrainst){
            return await AuthRepository.logIn(userForLogIn);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async register (userForRegister) {
        let constrainst = AuthService.validate_userForLogIn(userForRegister) 
        constrainst = !!constrainst ? 
                constrainst :
            userForRegister.name.length < 8 ?
                'Tên người dùng phải trên 8 kí tự':
            !checkEmail(userForRegister.email) ?
                'Email không hợp lệ.':
                undefined;
        
        if ( !constrainst ){
            return await AuthRepository.register(userForRegister);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async logOut (userForLogOut) {
        let constrainst = undefined;
        
        if ( !constrainst ){
            return await AuthRepository.logOut(userForRegister);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }
}