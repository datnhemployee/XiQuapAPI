const Crypto = require('crypto');
const Hash = Crypto.createHash('sha512');

exports.getRandomString = (length = 10) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+-*/!@#$%^&";
  
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

exports.hash = (text, secrect) => {
    Hash.update(
        Buffer.from(
            JSON.toString(text + secrect))
            .toString(),
    );

    return Hash.digest('hex');
}