var express = require('express');
var router = express.Router();

const { registerNewUser, loginUser, getCurrentUser} = require('../controllers/userController')

//POST register new user api
    router.post('/register', registerNewUser);

//POST login user api
    router.post('/login', loginUser)

//GET current user api
    router.get('/', getCurrentUser)

module.exports = router;