module.exports = class ActionResult {
    static get CODE () {
        return {
            OK: 0,
            ERROR: 1,
        }
    }

    static get EXCEPTION () {
        return {
            EMPTY_EXCEPTION: `Ngoại lệ rỗng.`,
        }
    }

    constructor (
        code = ActionResult.CODE.OK,
        value = ActionResult.EXCEPTION.EMPTY_EXCEPTION,
        error = false,
    ) {
        this.code = code;
        this.value = value;
        this.error = error;
    }
}