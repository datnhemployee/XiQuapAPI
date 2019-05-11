const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmStock = new schm({
    
    owner: {
        type: String,
        required: true,
        unique: true,
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
        required: true,
    },
    vendeeName: {
        type: String,
        required: true,
    },
    vendeeTotalStar: {
        type: Number,
        required: true,
        default: 0,
    },
    vendeeGiveStar: {
        type: Boolean,
        required: true,
        default: false,
    },

    totalLike: {
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
    
    },
    {
      versionKey: 'v1',
    });

    exports.Schema = schmStock;

    const conn = mongo.MONGOOSE_CONN;
  
    const account = conn.model('Stock', schmStock );
  
    exports.Model = account;
  
    exports.toString = () => 'Stock'