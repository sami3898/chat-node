const { createUser, loginUser, updateProfilePicture, getAllUsers } = require('./controller/UserController')
const { addMessage, getMessages } = require('./controller/MessageController')
const auth = require('./auth')

const router = require('express').Router();

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)
router.put('/updateProfilePicture/:id', updateProfilePicture)
router.get('/getAllUser', auth,getAllUsers)

router.post('/addMessage', auth,addMessage)
router.post('/getMessages', auth,getMessages)

module.exports = router;