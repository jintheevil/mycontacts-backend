const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('./ErrorHandler');

// Validates if JWT
const validateToken = (req, res, next) => {
    try {
        // Verify the JWT and get the user ID
        const jwtTokenInfo = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);

        // Add the user ID to the req object
        req.userId = jwtTokenInfo.user.id;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // Pass the error to the ErrorHandler middleware
        next(new ErrorHandler(401, 'Invalid or missing token.'));
    }
};

module.exports = validateToken;