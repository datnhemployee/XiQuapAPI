const UserForRegister = {
    point: 0,
    username: null,
    password: null,
    salt: null,
    name: null,
    phone: null,
    email: null,
    address: null,
    token: null,
    avatar: '',
    intro: '',
    totalStar: 0,
    star: [],
    totalFollowers: 0,
    followers: [],
    role: 0,
    // Những bài viết mà người dùng like
    like: [],
    // Những bài viết của riêng người dùng đăng
    totalOwned: 0,
    ownedItem: [],
    // Những bài viết mà người dùng đang chờ trao đổi
    totalWaitting: 0,
    waittingItem: [],
    // Những bài viết mà người dùng được chấp nhận trao đổi 
    // totalAprroved: 0,
    // approvedItem: [],
    // Những món mà người dùng cho vào trong kho quà tặng
    totalStock:0,
    stockList: [],
    // Những món mà người dùng đổi từ kho quà tặng
    totalBought: 0,
    boughtList: [],
    chats: [],
}

module.exports = UserForRegister;