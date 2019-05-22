const Codes = {
    Error: 401,
    Success: 201,
    Exception: 404,
    Authorization: 403,

}

const Encodes = {
    [Codes.Error]: 'SystemError',
    [Codes.Success]: 'Success',
    [Codes.Exception]: 'Exception',
    [Codes.Authorization]: 'Forbiden',
}
const Contents = {
    notImplement: 'Chưa định nghĩa hàm này',
    Error: 'Lỗi hệ thống',
    Success: 'Thành công và trả về dữ liệu',
    NotFound: 'Không tìm thấy xử lý tương ứng',
    Authorization: 'Không có quyền truy xuất.',
}
exports.Contents = Contents;
exports.Codes = Codes;
exports.Encodes = Encodes;

exports.Default = {
    code: true,
    content: Contents.notImplement,
}