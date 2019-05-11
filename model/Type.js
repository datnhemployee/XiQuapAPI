const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmPage = new schm({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        point: {
            type: Number,
            required: true,
        },
    },
    {
      versionKey: 'v1',
    });

    exports.Schema = schmPage;

    const conn = mongo.MONGOOSE_CONN;
  
    const account = conn.model('Type', schmPage );
  
    exports.Model = account;
  
    exports.toString = () => 'Type'