const crypto = require('crypto');

exports.getRandomString = (length = 10) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+-*/!@#$%^&";
  
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

exports.hash = (text, secrect) => {

    let rs = crypto.pbkdf2Sync(
        text,
        secrect,
        1000,
        512,
        'sha512'
    ).toString('hex').slice(1,20);;

    return rs;
}

exports.checkEmail = (email = '') => {
    let patt = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    return patt.test(email);
}

exports.checkPhone = (phone = '')=> {
    let patt = new RegExp(/^\d+$/);
    return !!phone && phone.length > 7 && patt.test(phone); 
}