const multer = require('multer')

module.exports = {
    /* Multer */
    upload: multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `src/public/uploads/image/`)
            },
            filename: function (req, file, cb) {
                const data = new Date();
                cb(null, `${req.user.login}_${data.getTime()}_${file.originalname}`)
            }
        })
    })
}