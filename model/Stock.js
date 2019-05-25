const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmStock = new schm({
    
    owner: {
        type: schm.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    mainPicture: {
        type: String,
        required: false, // true sau khi dùng cloudinary
    },
    otherPictureList: {
        type: [String],
        required: false,
    },
    name: {
        type: String,
        required: true,
        default: '',
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
    vendee: {
        type: schm.Types.ObjectId,
        ref: 'Account',
        required: false,
    },

    point: {
        type: Number,
        required: true,
        default: 50,
    },

    approve: {
        type: Boolean,
        required: true,
        default: false,
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