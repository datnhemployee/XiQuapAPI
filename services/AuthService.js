const AuthRepository = require('../repositories/AuthRepository');
const {Codes} = require('../dtos/Response');
const checkEmail = require('../Helpers/StringGenerater').checkEmail;
const checkPhone = require('../Helpers/StringGenerater').checkPhone;
const TokenRepository = require('../repositories/TokenRepository');
const SessionRepository = require('../repositories/SessionRepository');

module.exports = class AuthService {

    static async disconnect (session) {
        let response = SessionRepository.findBySession(session);
        console.log(`disconnect ${response}`)
        if(!!response){
            response = await AuthRepository.updateToken(
                null,
                response.username,
            );

            if (response.code === Codes.Success){
                SessionRepository.removeBySession(session);
            }

            return response;
        }
        return {
            code: Codes.Exception,
            content: ` Người dùng không tồn tại.`
        }
    }

    static async logIn (userForLogIn,session) {
        let {
            username,
        } = userForLogIn;

        let userFromSession = SessionRepository.contain(username);
        if(userFromSession !== -1) {
            return {
                code: Codes.Authorization,
                content: `Hiện đang được đăng nhập tại máy khác.`,
            }
        }

        let userFromRepo =  await AuthRepository.logIn(userForLogIn);
        if(userFromRepo.code === Codes.Success){
           
            let {
                name,
            } = userFromRepo.content;
            let token = TokenRepository.getToken(
                username,
                name,
            );
            if(!token) {return {
                code: Codes.Exception,
                content: `Không tìm thấy token người dùng ở cơ sở dữ liệu`,
            }}
            let updateResult = await AuthRepository.updateToken(token,username);

            if(updateResult.code === Codes.Success){
                let sessionInsertResult = SessionRepository.insert(token,username,session);
                if(sessionInsertResult.code===Codes.Success)
                    return {
                        code: Codes.Success,
                        content: {
                            name: name,
                            token: token,
                        }
                    }
                
                return sessionInsertResult;
            }
            return {
                code: Codes.Exception,
                content: `Xuất hiện lỗi không thể cập nhật token.`
            }
        }
        return {
            code: Codes.Exception,
            content: `Không tồn tại người dùng này.`,
        }
    }

    static async register (userForRegister,session) {
        let {
            username,
            name,
        } = userForRegister;

        let userFromSession = SessionRepository.contain(username);
        if(userFromSession !== -1) {
            return {
                code: Codes.Authorization,
                content: `Hiện đang được đăng nhập tại máy khác.`,
            }
        }

        let constrainst =  userForRegister.username.length < 8 ? 
                'Tên tài khoản phải có độ dài trên 8 kí tự': 
                userForRegister.password.length < 8 ?
                'Mật khẩu phải có độ dài trên 8 kí tự': 
                userForRegister.name.length < 8 ?
                'Tên người dùng phải trên 8 kí tự':
            !checkEmail(userForRegister.email) ?
                'Email không hợp lệ.':
                undefined;
        // console.log(`constrainst ${JSON.stringify(constrainst)}`)
        
        if ( !constrainst ){
            userForRegister.token = TokenRepository.getToken(
                username,
                name,
            );
            
            let insetSessionresult = await SessionRepository.insert(
                userForRegister.token,
                userForRegister.username,
                session);
            
            if(insetSessionresult.code === Codes.Success)
                return await AuthRepository.register(userForRegister);
            
            return insetSessionresult;
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }

    static async logOut (userForLogOut) {
        let constrainst = undefined;
        
        if ( !constrainst ){
            return await AuthRepository.logOut(userForLogOut);
        }

        return {
            code: Codes.Exception,
            content: constrainst,
        }
    }
}