const multer = require('multer')

module.exports = () => {

    /* Disk Storage */
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, '../../public/uploads/')
        },
        filename: function(req, file, cb) {
            const data = new Date();
            cb(null, `${data.getTime()}-${file.originalname}`)
        }
    })

    /* Multer */
    var upload = multer({
        storage: storage
    })
}