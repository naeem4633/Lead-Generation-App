const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nearby-search-program-frontend-default-rtdb.firebaseio.com"
});

const validateFirebaseToken = async (req, res, next) => {
  let idToken = req.headers.authorization; // Extract token from request headers

  // Check if idToken includes 'Bearer ' prefix
  if (idToken && idToken.startsWith('Bearer ')) {
      // Remove 'Bearer ' prefix
      idToken = idToken.slice(7);
  }

  try {
      const decodedToken = await admin.auth().verifyIdToken(idToken); // Verify token
      req.user = decodedToken; // Attach decoded token data to request object
      next(); // Proceed to next middleware or route handler
  } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return res.status(401).json({ error: 'Unauthorized' }); // Unauthorized if token verification fails
  }
};

module.exports = {
  validateFirebaseToken
};


// // Apply middleware to routes that require authentication
// app.use('/api/protected-route', validateFirebaseToken, protectedRouteHandler);
