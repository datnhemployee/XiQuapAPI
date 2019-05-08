const Role = require('./model/Role');
const UserRole = require('./model/Role').USER;
const AdminRole = require('./model/Role').ADMIN;

exports.seed = async function () {
    let userRole = new Role.Model({...UserRole});
    let adminRole = new Role.Model({...AdminRole});

    await userRole.save();
    await adminRole.save();
}