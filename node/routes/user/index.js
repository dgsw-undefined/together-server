const router = require('express').Router()
const controller = require('./user.controller')

//file upload 사용
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
const upload = multer({ storage: storage, limits: {fileSize: 5 * 1024 * 1024 }})

router.patch('/able', controller.available)
router.get('/trust',controller.truster_list)
router.post('/trust',controller.trust)
router.post('/untrust',controller.untrust)
router.get('/:user_id',controller.detail)
router.put('/update',upload.single('profile'),controller.test)
router.get('/user/:mode',controller.userList)


module.exports = router
