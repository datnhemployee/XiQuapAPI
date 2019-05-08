const Codes = {
    Ok: 200,
    Success: 201,
    NotFound: 404,
    Authorization: 403,

}

const Encodes = {
    [Codes.Ok]: 'Ok',
    [Codes.Success]: 'Success',
    [Codes.NotFound]: 'NotFound',
    [Codes.Authorization]: 'Forbiden',
}
const Contents = {
    notImplement: 'Chưa định nghĩa hàm này',
    Ok: 'Đã xử lý',
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