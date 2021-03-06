const Codes = require('../dtos/Response').Codes;

let _list = [];
module.exports = class SessionRepository {

    static contain (
        username,
    ) {
        return SessionRepository.get().findIndex((val)=>val.username === username);
    }

    static get () {return _list};

    static removeBySession (session) {
        let index = SessionRepository.get().findIndex((val)=>val.session === session);
        if(index != -1){
            SessionRepository.get().splice(index,1);
            return {
                code: Codes.Success,
                content: SessionRepository.get(),
            }
        }
        return {
            code: Codes.Exception,
            content: `Hiện người dùng chưa tham gia vào mạng.`,
        }
    }

    static findBySession (session) {
        // console.log(`thêm người dùng online: ${JSON.stringify(SessionRepository.get())}`)
        return SessionRepository.get().find((val)=>val.session === session );
    }
    static findByToken (token) {
        // console.log(`thêm người dùng online: ${JSON.stringify(SessionRepository.get())}`)
        return SessionRepository.get().find((val)=>val.token === token );
    }

    static insert (
        token,
        username,
        session,
    ) {
        let index = SessionRepository.contain(username);
        if(index === -1){
            const result = {
                token: token,
                username: username,
                session: session,
            }
            SessionRepository.get().push(result);
            // console.log(`thêm người dùng online: ${JSON.stringify(SessionRepository.get())}`)
            return {
                code: Codes.Success,
                content: result,
            }
        }
        return {
            code: Codes.Exception,
            content: `Đã đăng nhập tại máy khác.`,
        }
    }

    static remove (
        username,
    ) {
        let index = SessionRepository.contain(username);
        if(index != -1){
            SessionRepository.get().splice(index,1);
            return {
                code: Codes.Success,
                content: SessionRepository.get(),
            }
        }
        return {
            code: Codes.Exception,
            content: `Hiện người dùng chưa tham gia vào mạng.`,
        }
    }
}