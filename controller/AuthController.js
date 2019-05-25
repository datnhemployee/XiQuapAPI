const Account = require('../model/Account');
const AuthService = require('../services/AuthService');
const TokenService = require('../repositories/TokenRepository');
const UserForRegister = require('../dtos/UserForRegister');
const UserForLogIn = require('../dtos/UserForLogIn');
const UserForLogOut = require('../dtos/UserForLogOut');
const on_emit = require('./Controller').on_emit;
const {Codes} = require('../dtos/Response');
const Document = require('../document/AuthDocument');


class AuthController {
    constructor () {}

    static start (io,socket) {
        on_emit(socket,Document.Register,AuthController.register);
        on_emit(socket,Document.LogIn,AuthController.logIn);
        on_emit(socket,Document.Disconnect,AuthController.disconnect);
        on_emit(socket,Document.GetInfo,AuthController.getInfo);
        // listen(socket,Document.LogOut,AuthController.logOut);
        // listen(socket,Document.TokenLogIn,AuthController.tokenLogIn);
    }

    static async disconnect (
        request,
        socket,
    ) {
        socket.disconnect(true);
        socket.removeAllListeners(Document.Disconnect);
        return await AuthService.disconnect(socket.id);
    }

    // static tokenLogIn (
    //     tokenForLogIn = {
    //         token: null,
    //     }, 
    //     socket,
    // ) {
    //     let {
    //         token,
    //     } = tokenForLogIn;
    //     const error = !token ?
    //         `Không tìm thấy token hiện tại.`:
    //         undefined;

    //     if (!!error) {
    //         return {
    //             code: Codes.Exception,
    //             content: error,
    //         }
    //     }

    //     const logInWithTokenResult = await AuthService.logInWithToken(token);

    //     if (logInWithTokenResult.code === Codes.Success){
    //         let {
    //             name,
    //         } = logInWithTokenResult.content;
    //     }

    // }

    static async logIn (userForLogIn = {
        ...UserForLogIn,
    }, 
    socket) {
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
        
        const logInResult = await AuthService.logIn(userForLogIn,socket.id);

        // if(logInResult.code === Codes.Success){
        //     let {
        //         token,
        //         name,
        //     } = logInResult.content;

        //     return {
        //         code: Codes.Success,
        //         content: {
        //             token: token,
        //             name: name,
        //         }
        //     }
        // }
        
        return logInResult;
    }   

    static async register (
        userForRegister,
        socket
        ) {
        userForRegister = {
            ...UserForRegister,
            ...userForRegister
        };
        let {
            username,
            password,
            email,
            name,
            phone,
        } = userForRegister;

        console.log(`userForRegister ${JSON.stringify(userForRegister)}`)

        const error = !username ?
            'Rỗng tên tài khoản.' : 
            !password ?
            'Rỗng mật khẩu.' :
            !name ?
            'Tên người dùng chưa được điền':
            !email ?
            'Email chưa được điền':
            !phone ?
            'Phone chưa được điền':
            undefined;
        console.log(`err ${JSON.stringify(error)}`)

        if(!!error) 
            return {
                code: Codes.Exception,
                content: error,
            }

        const registerResult = await AuthService.register(userForRegister,socket.id);

        if(registerResult.code === Codes.Success){
            
            return {
                code: Codes.Success,
                content: {
                    name: registerResult.content.name,
                    token: registerResult.content.token,
                }
            }
        }
        
        return registerResult;
    }   

    static async getInfo (request) {
        let {
            token,
        } = request;

        const error = !token?
            ` Dữ liệu đính kèm không chính xác.`
            :undefined;

        if (!error) {
            try {
                return await AuthService.getInfo(request);
            } catch (responseError) {
                return {
                    code: Codes.Error,
                    content: ` Không thể lấy thông tin cá nhân vì ${responseError}`,
                }
            }
        }
        return {
            code: Codes.Exception,
            content: error,
        }
    }

    // static async logOut (userForLogOut = {
    //     ...UserForLogOut,
    // }, SessionController,
    // session) {
    //     let {
    //         token,
    //     } = userForLogOut;

    //     const error = !token ?
    //         'Dữ liệu đính kèm yêu cầu chưa chính xác':
    //         undefined;

    //     if(!!error) 
    //         return {
    //             code: Codes.Exception,
    //             content: error,
    //         }

    //     let logOutResult = await AuthService.logOut(userForLogOut);
        
    //     if(logOutResult.code === Codes.Success){
    //         SessionController.list = SessionController.list.filter(
    //             (val) => (val.token != token)
    //                 &&(val.session === session),
    //         );
    //         console.log(JSON.stringify(SessionController.list));
    //     }
        
    //     return logOutResult;
    // }   

    static async isExistedUsername (
        username = null,
    ) {
        return await Account.Model.findOne({
            username: username,
        }).lean();
    }

    
}

module.exports = AuthController;