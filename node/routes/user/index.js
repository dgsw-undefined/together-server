const router = require('express').Router()
const controller = require('./user.controller')

//file upload 사용
const MAX_FILE_SIZE = 5 * 1024 * 1024
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../img/');
    },
    filename: function (req, file, cb) {
      cb(null, req.decoded.id + "_" + new Date().valueOf() + path.extname(file.originalname));
    }
  })
const upload = multer({ storage: storage, limits: {fileSize: MAX_FILE_SIZE }})

router.patch('/able', controller.available)
router.get('/trusted/:user_id',controller.trusted_list)
router.get('/trusting/:user_id',controller.trusting_list)
router.post('/trust',controller.trust)
router.post('/untrust',controller.untrust)
// router.get('/:user_id',controller.detail)
router.put('/update',upload.single('profile'),controller.update)
router.get('/list/:mode',controller.userList)


module.exports = router
