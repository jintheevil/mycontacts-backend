var express = require('express');
var router = express.Router();
const validateToken = require('../middleware/ValidateTokenHandler');

const { getAllContacts, getContact, createContact, editContactInfo, deleteContact } = require('../controllers/contactController')

//get all contacts
    router.get('/', validateToken, getAllContacts)

//get contact by :id
    router.get('/:id', validateToken, getContact)

//create new contact
    router.post('/', validateToken, createContact)

//edit contact info
    router.put('/:id', validateToken, editContactInfo)

//delete contact according to :id
    router.delete('/:id', validateToken, deleteContact)

module.exports = router;