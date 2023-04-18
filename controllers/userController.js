const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../middleware/ErrorHandler');

// Email validator
const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
};

// Register new user with params
const registerNewUser = async (req, res, next) => {
    try {
        // Throws an error if email is not the right format
        if (!validateEmail(req.body.email)) {
            return next(new ErrorHandler(400, 'Invalid email format.'));
        }

        // Decrypts password for auth check
        let hashedPass = '';
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                // Pass error to ErrorHandler middleware
                return next(new ErrorHandler(500, 'Error hashing password'));
            }
            hashedPass = hash
            const newUser = new userModel({
                username: req.body.username,
                email: req.body.email,
                password: hashedPass,
            });

            // Saved newUser to db
            await newUser.save();
            console.log('User created:', newUser);
            res.status(201).json(
                {
                    message: 'User created successfully.!'
                }
            )
        })
    } catch (err) {
        console.log('Error creating user:', err.message);
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(400, err.message));
    }
}


// Login user
const loginUser = async (req, res, next) => {
    try {
        // Throws an error if email is not the right format
        if (!validateEmail(req.body.email)) {
            return next(new ErrorHandler(400, 'Invalid email format.'));
        }
        // Find user with email
        const user = await userModel.findOne({ email: req.body.email });

        // Checks password and generate JWT if email is valid
        if (user && await bcrypt.compare(req.body.password, user['password'])) {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user['username'],
                        email: user['email'],
                        id: user['id'],
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            // Saved JWT to cookie
            res.cookie('jwt', accessToken, {
                httpOnly: true, // Helps protect against XSS attacks
                secure: process.env.NODE_ENV === 'production', // Set to true in production (use HTTPS)
                maxAge: 60 * 60 * 1000, // Cookie expires after 1 hour (in milliseconds)
                sameSite: 'strict', // Helps protect against CSRF attacks
            });
            res.status(200).json({
                accessToken,
            });
        } else {
            // Pass error to ErrorHandler middleware
            next(new ErrorHandler(401, 'Email or password is not valid.'));
        }
    } catch (error) {
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};

// Get current user info
const getCurrentUser = async (req, res, next) => {
    try {
        // Verify the JWT and get the user ID
        const jwtTokenInfo = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
        const userId = jwtTokenInfo.user.id;

        // Find the user by ID
        const user = await userModel.findById(userId).select('-password');

        // Check if the user exists
        if (!user) {
            return next(new ErrorHandler(404, 'User not found.'));
        }

        // Send the user details in the response
        res.status(200).json({
            message: 'User fetched successfully.',
            data: user,
        });
    } catch (error) {
        // Pass error to ErrorHandler middleware
        next(new ErrorHandler(500, error.message));
    }
};

module.exports = {

    registerNewUser,
    loginUser,
    getCurrentUser

}