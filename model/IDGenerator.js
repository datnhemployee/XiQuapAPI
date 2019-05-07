const mongoose = require('mongoose');
const mongo = require('../constant/Connection')

const schm = mongoose.Schema;

const schmID = new schm({
    Account: {
        type: schm.Types.ObjectId,
        ref: 'Account',
        required: true,
      },
    },
    {
      versionKey: 'v1',
    });
  
    exports.Schema = schmID;
  
    const account = conn.model('Account', schmID );
  
    exports.Model = account;
  
    exports.toString = () => 'Account'