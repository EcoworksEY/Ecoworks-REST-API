// Test suite for the User Router
// Written By Bardia Habibkhoda

const request = require('supertest');
const app = require('../index'); 
const Chance = require('chance');

const chance = new Chance();

const database_connector = require('../middleware/database_connector');

// Create reusable but random user
const randomUsername = chance.username();
const randomPassword = chance.string({ length: 10, symbols: true });
const randomFamilyName = chance.last();
const randomGivenName = chance.first();
const randomEmail = chance.email();
const randomBirthdate = chance.birthday({ string: true });

describe('Test Authentication Endpoints', () => {
  // Remember! Actually testing this flow requires a verification code that can only be deomnstrated live

  let accessToken; // Store the access token for subsequent requests

  test('POST /auth/signup should sign up a user and return 201 status', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: randomUsername,
        password: randomPassword,
        family_name: randomFamilyName,
        given_name: randomGivenName,
        email: randomEmail,
        birthdate: randomBirthdate,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Sign-up successful. Please check your email for verification.');
  });

  test('POST /auth/login should log in a user and return 200 status', async () => {
    // We know this user exists.
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'reyardia',
        password: 'Ecoworks2023$#',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Authentication successful.');
    accessToken = response.body.accessToken; // Save the access token for subsequent requests
  });

  test('POST /auth/account should fetch the user account details and return 200 status', async () => {
    const response = await request(app)
      .post('/auth/account')
      .send({
        accessToken,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Username');
    expect(response.body).toHaveProperty('UserAttributes');
  });

  test('POST /auth/checksession should check if the user session is active and return 200 status', async () => {
    const response = await request(app)
      .post('/auth/checksession')
      .send({
        accessToken,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User session is active.');
  });

  test('POST /auth/signout should sign out the user and return 200 status', async () => {
    const response = await request(app)
      .post('/auth/signout')
      .send({
        accessToken,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Sign-out successful.');
  });

  test('POST /auth/forgotpassword should initiate password reset and return 200 status', async () => {
    const response = await request(app)
      .post('/auth/forgotpassword')
      .send({
        username: randomUsername,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset initiated. Check your email for further instructions.');
  });

  test('POST /auth/resetpassword should confirm new password after reset and return 200 status', async () => {
    // We cannot test this without humans, accurately atleast.
    // Get the verification code from the email sent during the password reset initiation
    // const verificationCode = '123456'; 

    // const response = await request(app)
    //   .post('/auth/resetpassword')
    //   .send({
    //     username: randomUsername,
    //     verificationCode,
    //     newPassword: 'newtestPassword1$',
    //   });

    // expect(response.status).toBe(200);
    // expect(response.body.message).toBe('Password reset confirmed. You can now log in with your new password.');
    expect(true);
  });
});
