const mongoose = require('mongoose');
const mongo = require('../constant/Connection')
const USER_INDEX = require('../model/Role').USER_INDEX;

const schm = mongoose.Schema;

const schmAccount = new schm({
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

    // @picture = << url_of_user_picture >>
    picture: {
        type: {
            uri: {
                type: String,
                required: true,
            }
        },
        required: false,
    },
  
    intro: {
        type: String,
        required: false,
        default: '',
    },
  
    star: {
        type: {
            total: {
                type: Number,
                required: true,
                default: 0,
            },
            list: {
                type: [{
                    account: {
                        type: schm.Types.ObjectId,
                        ref: 'Account',
                        required: true,
                    },
                    post: {
                        type: Number,
                        required: true,
                    },
                    date: {
                        type: Date,
                        required: true,
                    }
                }]
            }
        },
        required: true,
        default: {
            total: 0,
            list: [],
        },
    },
  
    friends: {
        type:[{
            account: {
                type: schm.Types.ObjectId,
                ref: 'Account',
            },
            date: {
                type: Date,
                required: true,
            },
        }],
        required: false,
        default: [],
    },

    role: {
        type: [{
            type: Number,
        }],
        required: true,
        default: USER_INDEX,
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