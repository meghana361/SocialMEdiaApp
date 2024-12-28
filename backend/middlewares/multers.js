import multer from 'multer'
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
            cb(null,'uploads/')

    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"), false);
      } else {
        cb(null, true);
      }
    },
  });
export default upload