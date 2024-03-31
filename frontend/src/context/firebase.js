    import { createContext, useContext } from 'react';
    import { initializeApp } from 'firebase/app';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, linkWithCredential, EmailAuthProvider, linkWithPopup } from 'firebase/auth';
    import { getDatabase, set, ref } from 'firebase/database';
    import bcrypt from 'bcryptjs';

    const firebaseConfig = {
    apiKey: "AIzaSyCJYXxlCjALPA2by2XfAZKVXBhjJXzhmds",
    authDomain: "nearby-search-program-frontend.firebaseapp.com",
    projectId: "nearby-search-program-frontend",
    storageBucket: "nearby-search-program-frontend.appspot.com",
    messagingSenderId: "923638542147",
    appId: "1:923638542147:web:81535c964e7a6b130589f6",
    databaseURL: "https://nearby-search-program-frontend-default-rtdb.firebaseio.com",
    measurementId: "G-PF7KHS24Z9"
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(firebaseApp);
    const firebaseGoogleAuthProvider = new GoogleAuthProvider();
    const firebaseEmailAuthProvider = new EmailAuthProvider();
    const database = getDatabase(firebaseApp);

    const FirebaseContext = createContext(null);
    export const useFirebase = () => useContext(FirebaseContext);

    export const FirebaseProvider = (props) => {
        const getAuth = () => {
            return firebaseAuth;
        }
        const signupUserWithEmailAndPassword = (email, password, displayName) => {
            return createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const userId = userCredential.user.uid;
                const hashedPassword = bcrypt.hashSync(password, 10);
                const userData = {
                    uid: userId,
                    email: email,
                    hashedPassword: hashedPassword,
                    displayName: displayName || '',
                    photoURL: userCredential.user.photoURL || '', 
                    providerData: userCredential.user.providerData || [], 
                    emailVerified: userCredential.user.emailVerified || false 
                    // Add other relevant user data here
                };
                putData(`users/${userId}`, userData);
                return userCredential.user;
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                throw error;
            });
        };

        const signinWithGoogle = () => {
            return signInWithPopup(firebaseAuth, firebaseGoogleAuthProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
        
                // Accessing user information
                const uid = user.uid;
                const email = user.email;
                const displayName = user.displayName;
                const photoURL = user.photoURL;
                const providerData = user.providerData; // Array of provider data
                const emailVerified = user.emailVerified;
        
                // Store this information in your database
                const userData = {
                    uid: uid,
                    email: email,
                    displayName: displayName,
                    photoURL: photoURL,
                    providerData: providerData,
                    emailVerified: emailVerified
                    // Add other relevant user data here
                };
        
                // Example: Store user data in Firebase Realtime Database
                putData(`users/${uid}`, userData);
        
                return user;
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
                throw error;
            });
        };

        const signinUser = (email, password) => {
            return signInWithEmailAndPassword(firebaseAuth, email, password) // Use the provided signInWithEmailAndPassword method
                .then((userCredential) => {
                    return userCredential.user;
                })
                .catch((error) => {
                    console.error('Error signing in with email and password:', error);
                    throw error;
                });
        };

        // Function to sign in anonymously
        const signInAnonymous = () => {
            signInAnonymously(firebaseAuth)
            .then(() => {
                console.log( 'Successfully created a new anonymous account.', firebaseAuth.currentUser );
            })
            .catch((error) => {
                // Handle error
                console.error("Error signing in anonymously:", error);
            });
        };
        
        const convertAnonymousToPermanentEmailPassword = (email, password) => {
            const credential = EmailAuthProvider.credential(email, password);
            return linkWithCredential(firebaseAuth.currentUser, credential)
              .then((usercred) => {
                const user = usercred.user;
                console.log("Anonymous account successfully upgraded", user);
                return user;
              }).catch((error) => {
                console.log("Error upgrading anonymous account", error);
                throw error;
              });
          };

          const convertAnonymousToPermanentGoogle = async () => {
            try {
                const currentUser = firebaseAuth.currentUser;
                    const result = await signInWithPopup(firebaseAuth, firebaseGoogleAuthProvider);
                    const googleCredential = GoogleAuthProvider.credentialFromResult(result);
                    if (googleCredential) {
                        await linkWithCredential(currentUser, googleCredential);
                        console.log('Anonymous account successfully upgraded with Google');
                    } else {
                        throw new Error('Failed to get Google credential from result');
                    }
                }catch (error) {
                console.log('Error upgrading anonymous account with Google:', error);
            }
        };

        const getCurrentUser = () => {
            return firebaseAuth.currentUser;
        };

        const putData = (key, data) => set(ref(database, key), data);

    return (
        <FirebaseContext.Provider value={{signupUserWithEmailAndPassword, signinWithGoogle,  signinUser, signInAnonymous, convertAnonymousToPermanentEmailPassword, convertAnonymousToPermanentGoogle, getAuth, getCurrentUser }}>
          {props.children}
        </FirebaseContext.Provider>
    );
};