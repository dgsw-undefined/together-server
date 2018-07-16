const router = require('express').Router()
const controller = require('./test.controller')

router.get('/team_list',controller.team_list)

module.exports = router
