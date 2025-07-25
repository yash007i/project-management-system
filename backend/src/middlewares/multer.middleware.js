import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize : 1000 * 1000 * 1000,
    },
});