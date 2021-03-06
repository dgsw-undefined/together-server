const router = require('express').Router()
const controller = require('./team.controller')

router.get('/super_list',controller.super_team_list)
router.get('/super_list/user/:user_id',controller.super_team_list_user_id)
router.get('/user/:user_id',controller.list)
router.post('/',controller.create)
router.post('/kickout',controller.kickout)
router.post('/join',controller.join)
router.get('/member/:team_id',controller.member_list)
router.delete('/destroy',controller.destroy)

module.exports = router
