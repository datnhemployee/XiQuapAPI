const express = require("express");

const app = express();

const server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
const AuthController = require('./controller/AuthController');
const ItemController = require('./controller/ItemController');
const StockController = require('./controller/StockController');

const multer = require('multer');
const cloudinary = require(`cloudinary`);

const seed = require('./Seed');

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './public');
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
  });

const upload = multer({ storage: Storage });

cloudinary.config({ 
    cloud_name: 'da3cax2k4', 
    api_key: '175413473697475', 
    api_secret: '5kuzZpNtqUfPlRDyHA0k0PAGr00' 
  });

async function main () {
    await seed.seed();
}

app.post('', upload.array(`photo`,3),(req,res) => {
        console.log(`yêu cầu là: `,JSON.stringify(req.files[0].filename))

        cloudinary.v2.uploader.upload(
            `./public/${req.files[0].filename}`,
            { tag: `xiquap`},
            function(err,img) {
                if (!err) {
                    res.jsonp(img).status(200);
                } else {
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

main()
    .catch((reason)=>{
        console.log(`Reason: ${JSON.stringify(reason)}`)
    })
    .then(()=>{
        io.on(`connection`, function (socket){
            console.log('Co nguoi ket noi', socket.id)
        
            AuthController.start(io,socket);
            ItemController.start(io,socket);
            StockController.start(io,socket);
        });
    });
