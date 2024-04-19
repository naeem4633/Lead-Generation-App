const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../../serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nearby-search-program-frontend-default-rtdb.firebaseio.com"
});

// Middleware to validate Firebase token
const validateFirebaseToken = async (req, res, next) => {
    let idToken = req.headers.authorization; // Extract token from request headers

    // Check if idToken includes 'Bearer ' prefix
    if (idToken && idToken.startsWith('Bearer ')) {
        // Remove 'Bearer ' prefix
        idToken = idToken.slice(7);
    } else {
        console.error('No Firebase token provided');
        return res.status(401).json({ error: 'Unauthorized. No Firebase token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken); // Verify token
        req.user = decodedToken; // Attach decoded token data to request object
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ error: 'Unauthorized. Invalid Firebase token' }); // Unauthorized if token verification fails
    }
};

// Function to check user's role or permissions
const checkUserRole = async (req, res) => {
    try {
        let idToken = req.headers.authorization; // Extract token from request headers
  
        // Check if idToken includes 'Bearer ' prefix
        if (idToken && idToken.startsWith('Bearer ')) {
            // Remove 'Bearer ' prefix
            idToken = idToken.slice(7);
        } else {
            console.error('No Firebase token provided');
            return res.status(401).json({ error: 'Unauthorized. No Firebase token provided' });
        }
  
        // Decode the token to extract user information
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email } = decodedToken;
  
        // Check if the user is an owner of the Firebase project or an admin
        // For demonstration purposes, let's assume the user is an admin if their email matches a predefined admin email
        const isAdmin = email === 'ahmedn3700@gmail.com';
  
        // Respond with the user's role or permissions
        res.json(isAdmin ? 'admin' : 'user');
    } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    validateFirebaseToken,
    checkUserRole
};

