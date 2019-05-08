const userRoleID = require('../model/Role').USER_INDEX;
const EMPTY_STRING = '';
const INTIAL_NUMBER = 0;

const UserForRegister = {
    username: EMPTY_STRING,
    password: EMPTY_STRING,
    salt: EMPTY_STRING,
    name: EMPTY_STRING,
    phone : EMPTY_STRING,
    email : EMPTY_STRING,
    address : EMPTY_STRING,
    role : [userRoleID],
    star : {
        total: 0,
        list: [],
    },
    friends : [],

}

module.exports = UserForRegister;