const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmConstant = new schm({
    id: {
        type: Number,
        required: true,
        default: 0,
        unique: true,
    },
    modified: {
        type: Boolean,
        required: true,
        default: false,
    }   
    
    },
    {
      versionKey: 'v1',
    });

    exports.Schema = schmConstant;

    const conn = mongo.MONGOOSE_CONN;
  
    const account = conn.model('Constant', schmConstant );
  
    exports.Model = account;
  
    exports.toString = () => 'Constant'