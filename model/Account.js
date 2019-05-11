const mongoose = require('mongoose');
const mongo = require('../constant/Connection')
const USER_INDEX = require('../model/Role').USER_INDEX;

const schm = mongoose.Schema;

const schmAccount = new schm({
    point: {
        type: Number,
        required: true,
        default: 0,
    },
    username: {
        type: String,
        required: true,
        unique: true,
      },
      //
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    address: {
        type: String,
        required: false,
    },
    token: {
        type: String,
        required: false,
        unique: true,
    },

    // @picture = << url_of_user_picture >>
    avatar: {
        type: String,
        required: false,
    },
  
    intro: {
        type: String,
        required: false,
        default: '',
    },

    totalStar: {
        type: Number,
        required: true,
        default: 0,
    },
  
    star: {
        type: [{
                account: {
                    type: schm.Types.ObjectId,
                    ref: 'Account',
                    required: true,
                },
                item: {
                    type: schm.Types.ObjectId,
                    ref: 'Item',
                    required: true,
                },
                date: {
                    type: Date,
                    required: true,
                }
            }],
        required: true,
        default: [],
    },

    totalFollowers: {
        type: Number,
        required: true,
        default: 0,
    },

    followers: {
        type:[{
            Id: {
                type: schm.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }],
        default: [],
    },

    role: {
        type: [{
            type: Number,
        }],
        required: true,
        default: USER_INDEX,
    },

    totalItem: {
        type: Number,
        required: true,
        default: 0,
    },
  
    item: {
        type: [{
            Id: {
                type: schm.Types.ObjectId,
                ref: 'Item',
                required: true,
            },
            info: {
                type: String,
                required: true,
                default: '',
            },
            mainPhoto: {
                type: String,
                required: true,
            },
            totalStar: {
                type: Number,
                required: true,
                default: 0,
            },
            totalExchange: {
                typeNumber: Number,
                required: true,
                default: 0,
            }
        }]
    }
    },
    {
      versionKey: 'v1',
});

    exports.Schema = schmAccount;

    const conn = mongo.MONGOOSE_CONN;
  
    const account = conn.model('Account', schmAccount );
  
    exports.Model = account;
  
    exports.toString = () => 'Account'