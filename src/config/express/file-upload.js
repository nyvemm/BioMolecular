const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'src/public/uploads/image/');
    },
    filename(req, file, cb) {
      const data = new Date();
      cb(null, `${req.user.login}_${data.getTime()}_${file.originalname}`);
    },
  }),
});
