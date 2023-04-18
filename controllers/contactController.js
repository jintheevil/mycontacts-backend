const contactModel = require('../models/contactModel');
const jwt = require('jsonwebtoken')
const {ErrorHandler} = require("../middleware/ErrorHandler");

// Get all contacts
const getAllContacts = async (req, res, next) => {
    try {
        //gets userID from saved req
        const userId = req.userId;

        const contacts = await contactModel.find({ user: userId });

        res.status(200).json({
            message: 'Contacts fetched successfully.',
            data: contacts,
        });
    } catch (error) {
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};

//Get contact with :id
const getContact = async (req, res, next) => {
    try {
        // Gets userID from saved req
        const userId = req.userId;
        const contactId = req.params.id;

        // Find the contact by ID and user ID
        const contact = await contactModel.findOne({ _id: contactId, user: userId });

        // Check if the contact exists and belongs to the user
        if (!contact) {
            return next(new ErrorHandler(404, 'Contact not found.'));
        }

        // Send the contact details in the response
        res.status(200).json({
            message: 'Contact fetched successfully.',
            data: contact,
        });
    } catch (error) {
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};

//Creates new contact with params
const createContact = async (req, res, next) => {
    try {
        const userId = req.userId;

        const newContact = new contactModel({
            user: userId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        });

        await newContact.save();
        console.log('Contact created:', newContact);
        res.status(201).json({
            'message' : 'New contact successfully created!'
        })
    } catch (err) {
        console.log('Error creating user:', err.message);
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(400, err.message));
    }
}

//Edits contact with new info
const editContactInfo = async (req, res, next) => {
    try {
        // Get user id from req and contact id from :id
        const userId = req.userId;
        const contactId = req.params.id;

        // Find and update corresponding contact's info
        const updatedContact = await contactModel.findOneAndUpdate(
            { _id: contactId, user: userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // Throws an error if contact can't be found
        if (!updatedContact) {
            // Pass error to ErrorHandler middleware
            return next(new ErrorHandler(404, 'Contact not found'));
        }

        res.status(200).json({
            message: 'Contact updated successfully.',
            data: updatedContact,
        });
    } catch (error) {
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};

//Deletes contact by :id
const deleteContact = async (req, res, next) => {
    try {
        // Get the user ID
        const userId = req.userId;

        // Find the contact by ID and user ID, then delete it
        const deletedContact = await contactModel.findOneAndDelete({ _id: req.params.id, user: userId });

        // Throws an error if contact isn't found or user is not authorised to delete contact
        if (!deletedContact) {
            return next(new ErrorHandler(404, 'Contact not found or not authorized to delete.'));
        }

        res.status(200).json({
            message: 'Contact deleted successfully.',
        });
    } catch (error) {
        // Pass the error to the ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};



module.exports = {

    getAllContacts,
    getContact,
    createContact,
    editContactInfo,
    deleteContact

}