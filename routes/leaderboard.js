let leaderboardController = require('../controller/leaderboard')
const express = require('express')
const router = express.Router()

router.get('/', leaderboardController.leaderboard)

module.exports = router