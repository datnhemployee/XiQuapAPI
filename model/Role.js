const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmRole = new schm({
        Id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        }
},
{
    versionKey: 'v1',
});

exports.Schema = schmRole;

const conn = mongo.MONGOOSE_CONN;

const account = conn.model('Role', schmRole );

exports.Model = account;

exports.toString = () => 'Role'

exports.USER = {
    Id: 1,
    name: 'user',
}

exports.USER_INDEX = 1;
exports.ADMIN_INDEX = 2;

exports.ADMIN = {
    Id: 2,
    name: 'admin'
}