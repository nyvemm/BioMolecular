import multer, { diskStorage } from 'multer';

export default multer({
  storage: diskStorage({
    destination(req, file, cb) {
      cb(null, 'src/public/uploads/image/');
    },
    filename(req, file, cb) {
      const data = new Date();
      cb(null, `${req.user.login}_${data.getTime()}_${file.originalname}`);
    },
  }),
});
