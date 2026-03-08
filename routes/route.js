const express= require("express");
const multer = require('multer');
const path = require('path');
const passportPhoto = require('./cropimage.js');
const imageprocess = require('../processimage.js');
const pdfkit = require('../print.js');


const router = express.Router();
var filename = '';
const storage = multer.diskStorage({
  destination: './uploads/', // Folder to save the files (create this folder in your project root)
  filename: function(req, file, cb){
      // Generate a unique filename using the current date/time and the original file extension
      filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      cb(null, filename);
  }
});
// Initialize Multer upload middleware
const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000}, // Limit file size to 100MB (optional)
  fileFilter: function(req, file, cb){ // Filter files (optional)
      checkFileType(file, cb);
  }
}).single('image'); // 'image' is the field name from the frontend form

// Check File Type function (optional)
function checkFileType(file, cb){
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
      return cb(null,true);
  } else {
      cb('Error: Images Only!');
  }
}
router.get("/", (req, res) => {
    // res.send("Hello World!");

    // res.render('index', data);
    res.render('index2');
    // res.render('index');
    // res.render('angular');
    // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  router.post("/upload",async (req,res)=>{
    upload(req, res, (err) => {
      if(err){
        console.log(err)
          res.send(err);
      } else {
          if(req.file == undefined){
              res.send('Error: No File Selected!');
          } else {
           passportPhoto.generatePassportPhoto('uploads/'+filename).then(image=>{
              res.send(image);
          });

              // res.send(image);
          }
      }
  });
  
  });
  
  
  

  router.post("/generate",async (req,res)=>{
    console.log(req.body);

    let image = req.body.image;
    let noof_copy = req.body.no_ofCopy;
    pdfkit.createA4Print(image,noof_copy).then(filename=>{
      res.send(filename);

    });

  });
  router.post("/change-background",async (req,res)=>{
    console.log(req.body);

    let image = req.body.image;
    let color = req.body.color;
    imageprocess.processImage(image,color).then(filename=>{
      res.send(filename);

    });

  });

module.exports= router;