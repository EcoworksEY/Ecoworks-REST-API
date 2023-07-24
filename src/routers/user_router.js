// user_Router for providing authorization and authentication of users
// Written by Bardia Habib Khoda

// Library injections
const express = require('express');
const user_router = express.Router();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const crypto = require('crypto');

// AWS Cognito credentials
const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID;
const cognitoClientId = process.env.COGNITO_CLIENT_ID;
const cognitoClientSecret = process.env.COGNITO_CLIENT_SECRET;

// Configure the AWS SDK
AWS.config.update({
  region: awsRegion,
});

// JUST FOR NOW
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;  // This will be updated when certificates are downloaded.

// Create an AWS Cognito service object
const cognito = new AWS.CognitoIdentityServiceProvider();

// Middleware to parse request bodies
user_router.use(bodyParser.urlencoded({ extended: false }));
user_router.use(bodyParser.json());

// POST route for authenticating users
user_router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const authParams = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: cognitoClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(username)
    },
  };

  // Try logging in
  cognito.initiateAuth(authParams, (err, data) => {
    if (err) {
      console.error('Authentication error:', err);
      res.status(401).json({ message: 'Authentication failed.' });
    } else {
      console.log('Authentication successful:', data);
      res.status(200).json({ message: 'Authentication successful.' });
    }
  });
});

// POST Route to sign customers up
user_router.post('/signup', (req, res) => {
    const { username, password, 
        family_name,
        given_name,
        email,
        birthdate } = req.body;

    // User Role will be enabled to 'A' and 'C', Admin and User, later on for forwarding to Admin portal functionality
    const params = {
      ClientId: cognitoClientId,
      Username: username,
      Password: password,
      SecretHash: generateSecretHash(username), // Include the SECRET_HASH
      UserAttributes: [
        { Name: 'family_name', Value: family_name },
        { Name: 'given_name', Value: given_name },
        { Name: 'email', Value: email },
        { Name: 'birthdate', Value: birthdate },
      ]
    };

    // Try signing up
    cognito.signUp(params, (err, data) => {
      if (err) {
        console.error('Sign-up error:', err);
        res.status(400).json({ message: 'Sign-up failed. Please check your input and try again. ', err });
      } else {
        console.log('Sign-up successful:', data);
        res.status(201).json({ message: 'Sign-up successful. Please check your email for verification.' });
      }
    });
});

// POST Route enabling verification input
user_router.post('/verification', (req, res) => {
    const { username, verificationCode } = req.body;

    const params = {
      ClientId: cognitoClientId,
      Username: username,
      ConfirmationCode: verificationCode,
      SecretHash: generateSecretHash(username), // Include the SECRET_HASH
    };
  
    cognito.confirmSignUp(params, (err, data) => {
      if (err) {
        console.error('Verification error:', err);
        res.status(400).json({ message: 'Verification failed. Please check your verification code and try again.' });
      } else {
        console.log('Verification successful:', data);
        res.status(200).json({ message: 'Email verification successful. You can now log in.' });
      }
    });
});

// POST route enabling logout
user_router.post('/signout', (req, res) => {
    // This requires sending back the JWT stored on client-side to revoke the session
    const { accessToken, refreshToken } = req.body;

    const params = {
      AccessToken: accessToken,
      RefreshToken: refreshToken,
    };
  
    cognito.globalSignOut(params, (err, data) => {
      if (err) {
        console.error('Sign-out error:', err);
        res.status(500).json({ message: 'Sign-out failed. Please try again.' });
      } else {
        console.log('Sign-out successful:', data);
        res.status(200).json({ message: 'Sign-out successful.' });
      }
    });
});

// POST get the user's details
user_router.post('/account', (req, res) => {
    // This also requires sending JWT stored client-side to enable this route
    const { accessToken } = req.body;

    const params = {
      AccessToken: accessToken,
    };
  
    cognito.getUser(params, (err, data) => {
      if (err) {
        console.error('Fetch account details error:', err);
        res.status(500).json({ message: 'Failed to fetch user account details. Please try again.' });
      } else {
        console.log('User account details:', data);
        res.status(200).json(data);
      }
    });
});

// POST check the user's session is still valid
user_router.post('/check-session', (req, res) => {
    // This also requires sending the Access Token to do stuff.
    const { accessToken } = req.body;

    const params = {
      AccessToken: accessToken,
    };
  
    cognito.getUser(params, (err, userData) => {
      if (err) {
        console.error('Check session error:', err);
        res.status(500).json({ message: 'Failed to check user session. Please try again.' });
      } else {
        // Get the user session
        cognito.getSession(params, (sessionErr, sessionData) => {
          if (sessionErr) {
            console.error('Check session error:', sessionErr);
            res.status(500).json({ message: 'Failed to check user session. Please try again.' });
          } else {
            // Check if the session is valid and active
            if (sessionData && sessionData.isValid()) {
              console.log('User session is active:', userData);
              res.status(200).json({ message: 'User session is active.', userData });
            } else {
              console.log('User session is not active:', userData);
              res.status(401).json({ message: 'User session is not active.' });
            }
          }
        });
      }
    });
});

// POST to initiate the user's forgot password flow
user_router.post('/forgot-password', (req, res) => {
    const { username } = req.body;

    const params = {
      ClientId: cognitoClientId,
      Username: username,
      SecretHash: generateSecretHash(username), // Include the SECRET_HASH
    };
  
    cognito.forgotPassword(params, (err, data) => {
      if (err) {
        console.error('Password reset initiation error:', err);
        res.status(500).json({ message: 'Failed to initiate password reset. Please try again.' });
      } else {
        console.log('Password reset initiated:', data);
        res.status(200).json({ message: 'Password reset initiated. Check your email for further instructions.' });
      }
    });
});

// POST to finalise the user's forgot password flow
user_router.post('/change-password', (req, res) => {
    // Bear in mind the verification code and the new password need to come from the same page
    const { username, verificationCode, newPassword } = req.body;

    const params = {
      ClientId: cognitoClientId,
      Username: username,
      ConfirmationCode: verificationCode,
      Password: newPassword,
      SecretHash: generateSecretHash(username), // Include the SECRET_HASH
    };
  
    cognito.confirmForgotPassword(params, (err, data) => {
      if (err) {
        console.error('Password reset confirmation error:', err);
        res.status(500).json({ message: 'Failed to confirm password reset. Please try again.' });
      } else {
        console.log('Password reset confirmed:', data);
        res.status(200).json({ message: 'Password reset confirmed. You can now log in with your new password.' });
      }
    });
});

function generateSecretHash(username) {
    const hmac = crypto.createHmac('sha256', cognitoClientSecret);
    hmac.update(username + cognitoClientId);
    return hmac.digest('base64');
  }

module.exports = user_router;
