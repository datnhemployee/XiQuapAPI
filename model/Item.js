const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmItem = new schm({
    ownerId: {
        type: schm.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    ownerName: {
        type: String,
        required: true, 
    },
    ownerAvatar: {
        type: String,
        required: false, // sẽ yêu cầu trong việc sử dụng cloudinary
    },
    mainPicture: {
        type: String,
        required: false,// sẽ yêu cầu trong việc sử dụng cloudinary
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
    description: {
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
            Id: {
                type: schm.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
        }]
    },
    totalItem: {
        type: Number,
        required: true,
        default: 0,
    },
  
    itemList: {
        type: [{
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            photoUrl: {
                type: String,
                required: false,
            },
            vendeeId: {
                type: schm.Types.ObjectId,
                ref: 'Account',
                required: true,
            },
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