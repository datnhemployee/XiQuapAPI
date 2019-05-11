const Account = require('../model/Account');
const AuthService = require('../services/AuthService');
const TokenService = require('../services/TokenService');
const UserForRegister = require('../dtos/UserForRegister');
const UserForLogIn = require('../dtos/UserForLogIn');
const UserForLogOut = require('../dtos/UserForLogOut');
const listen = require('./Controller');
const {Codes} = require('../dtos/Response');


const Methods = {
    LogIn: 'auth-logIn',
    Register: 'auth-register',
    LogOut: 'auth-logOut',
};

class AuthController {
    constructor () {}

    static start (socket,SessionController) {
        listen(socket,Methods.Register,AuthController.register,SessionController);
        listen(socket,Methods.LogIn,AuthController.logIn,SessionController);
        listen(socket,Methods.LogOut,AuthController.logOut,SessionController);
    }

    // Chưa trả về token để đăng nhập
    static async register (userForRegister = {
        ...UserForRegister},
        sessionController,
        session) { 
        
        userForRegister = {
            ...UserForRegister,
            ...userForRegister,
        }

        const exception = !userForRegister.username ?
                'Rỗng tên tài khoản.' : 
            !userForRegister.password ?
                'Rỗng mật khẩu.' :
            !userForRegister.name ?
                'Tên người dùng chưa được điền':
            !userForRegister.email ?
                'Email chưa được điền':
            undefined;

        if(!!exception) {
           return {
               code: Codes.Exception,
               content: exception,
           }
        }
        
        let registerResult = await AuthService.register(userForRegister);

        if(registerResult.code === Codes.Ok){
            registerResult.content = {
                ...registerResult.content,
                ...{
                    token: TokenService.getToken(
                        registerResult.content.username,
                        registerResult.content.name,
                    )
                }
            }
        }
        return registerResult;
    }

    static async logIn (userForLogIn = {
        ...UserForLogIn,
    }, SessionController,
    session) {
        let {
            username,
            password,
        } = userForLogIn;

        const error = !username ?
                    'Tên tài khoản rỗng.':
                !password ?
                    'Mật khẩu rỗng':
                    undefined;

        if(!!error) 
            return {
                code: Codes.Exception,
                content: error,
            }

        const logInResult = await AuthService.logIn(userForLogIn);

        if(logInResult.code === Codes.Success){
            let token = await TokenService.getToken(
                username,
                logInResult.content.name,
            );
            
            if(SessionController.list.findIndex(
                (val)=>val.token === token)
                != -1){
                console.log('Session Array:',SessionController.list);
                return {
                    code: Codes.Authorization,
                    content: 'Đã đăng nhập tại một máy khác',
                }
            }
            
            SessionController.list.push({session: session,token: token})
            
            return {
                code: Codes.Success,
                content: {
                    session: session,
                    name: logInResult.content.name,
                    token: token,
                }
            }
        }
        
        return logInResult;
    }   

    static async logOut (userForLogOut = {
        ...UserForLogOut,
    }, SessionController,
    session) {
        let {
            token,
        } = userForLogOut;

        const error = !token ?
            'Dữ liệu đính kèm yêu cầu chưa chính xác':
            undefined;

        if(!!error) 
            return {
                code: Codes.Exception,
                content: error,
            }

        let logOutResult = await AuthService.logOut(userForLogOut);
        
        if(logOutResult.code === Codes.Success){
            SessionController.list = SessionController.list.filter(
                (val) => (val.token != token)
                    &&(val.session === session),
            );
            console.log(JSON.stringify(SessionController.list));
        }
        
        return logOutResult;
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