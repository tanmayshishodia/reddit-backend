const feedController = require('../controller/feed')

router.get('/feed', feedController.getAllPosts)

module.exports = router