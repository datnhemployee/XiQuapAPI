const multer = require('multer');
const cloudinary = require(`cloudinary`);
const configuration = require('../constant/CloudinaryConfig');

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './public');
    },
    filename(req, file, callback) {
      callback(null, `${file.originalname}`);
    //   callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: Storage });

cloudinary.config(configuration);

module.exports = {
    start (app) {
        app.post('/image', upload.array(`photo`,3),(req,res) => {
            console.log(`có người vừa kết nối` + req);

            cloudinary.v2.uploader.upload(
                `./public/${req.files[0].filename}`,
                { tag: `xiquap`},
                function(err,img) {
                    if (!err) {
                        console.log(`yêu cầu là: `,JSON.stringify(img))
                        res.send({url: img.url}).status(200);
                    } else {
                        res.send({error: err}).status(401);
                        console.log(`Lỗi khi truyền ảnh`,JSON.stringify(err));
                    }
                    const fs = require('fs');
                    fs.unlinkSync(`./public/${req.files[0].filename}`);
                }
            )
            // res.status(200);
        // console.log(` Vừa nhận được dữ liệu`);
        // console.log(` Vừa nhận được ${JSON.stringify(req)}`);
        })
    }
}