const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmRole = new schm({
        _id: {
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

exports.USER = 0
exports.ADMIN = 1