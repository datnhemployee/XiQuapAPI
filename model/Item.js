const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmItem = new schm({
    ownerId: {
        type: schm.Types.ObjectId,
        required: true,
    },
    ownerAvatar: {
        type: String,
        required: true,
    },
    mainPicture: {
        type: String,
        required: true,
    },
    otherPictureList: {
        type: [String],
        required: false,
        default: [],
    },
    name: {
        type: String,
        required: true,
        default: ''
    },
    info: {
        type: String,
        required: false,
        default: '',
    },
    typeName: {
        type: String,
        required: true,
    },
    vendeeId: {
        type: schm.Types.ObjectId,
        ref: 'Account',
        required: false,
    },
    vendeeName: {
        type: String,
        required: false,
    },
    vendeeTotalStar: {
        type: Number,
        required: false,
        default: 0,
    },
    vendeeGiveStar: {
        type: Boolean,
        required: false,
        default: false,
    },

    totalLike: {
        type: Number,
        required: true,
        default: 0,
    },
    point: {
        type: Number,
        required: true,
        default: 0,
    },
    likeList: {
        type: [{
            id: {
                type: schm.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
            name: {
                type: String,
                required: true,
            }
        }]
    },

    exchangeType: {
        type: Number,
        required: true,
        default: 0,
    },

    totalExchange: {
        type: Number,
        required: true,
        default: 0,
    },
  
    exchangeList: {
        type: [{
            id: {
                type: schm.Types.ObjectId,
                ref: 'Item',
                required: true,
            },
            vendeeID: {
                type: schm.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
            vendeeName: {
                type: String,
                ref: 'Account',
                required: true,
            },
            vendeeStar: {
                type: Number,
                required: true,
            },
            info: {
                type: String,
                required: true,
                default: '',
            }
        }],
        default: [],
    }
    
    },
    {
      versionKey: 'v1',
    });

    exports.Schema = schmItem;

    const conn = mongo.MONGOOSE_CONN;
  
    const account = conn.model('Item', schmItem );
  
    exports.Model = account;
  
    exports.toString = () => 'Item'