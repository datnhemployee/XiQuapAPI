// =========== URI of MongoDB ===========

const dbUsername = 'admin123';
const dbPassword = 'admin123';

const uri = `mongodb://${dbUsername}:${dbPassword}`
  + `@ds223756.mlab.com:23756/spense`;
  
exports.URI_MONGOOSE = uri;

// =========== connection of MongoDB ===========
const mongoose = require("mongoose");
const conn = 
  mongoose.createConnection(
    uri,
    { useNewUrlParser: true }
  );

exports.MONGOOSE_CONN = conn;

// =========== MongoDB convert ===========

const convert_Schema = (object) => new mongoose.Schema(object)

exports.PAGE_MAXIMUM_CONTENT = 5;