const Role = require('./model/Role');
const Constant = require('./model/Constant').Model;
const Type = require('./model/Type').Model;

const userRole = new Role({name: 'user',});
const adminRole = new Role({name: 'admin',});

const books = new Type({name: 'Sách vở',point: 100});
const devices = new Type({name: 'Thiết bị',point: 200});
const cloth = new Type({name: 'quần áo',point: 150});
const lesson = new Type({name: 'khóa học',point: 200});
const other = new Type({name: 'khác',point: 50});


// Ngược với modified trong Constant nếu muốn seeding
const modified = true;

const constant = new Constant({
    Id: 0,
    // lastestPage: await PageService.getLastestPage(),
    lastestPage: 1,
    maxNumberItemsOfPage: 10,
    // lastestPageStock: await StockService.getLastestPageStock(),
    lastestPageStock: 1,
    maxNumberItemsOfStock: 10,
    modified: modified,
})

exports.modified = modified;
exports.seed = async function () {
    let temp = await Constant.findOneAndDelete({
        Id: 0
    }).lean();

    if(!!temp){
        if (temp.modified === modified) 
            return;
    }
    await Constant.findOneAndRemove({
        Id: 0
    })

    await userRole.save();
    await adminRole.save();

    await books.save();
    await devices.save();
    await cloth.save();
    await lesson.save();
    await other.save();

    await constant.save();
}