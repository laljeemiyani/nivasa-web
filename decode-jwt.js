const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJiZDc5OWM2MDJkNzYyOTUyM2Y4YjQiLCJpYXQiOjE3NTc3NzMzMTMsImV4cCI6MTc1ODM0MjExM30.btfp1M1rNCMJQp8VveClgPt3W0reWDHGH12TyhLRQ8s';
const secret = 'nivasa_jwt_secret_key_2024_change_this_in_production_with_strong_random_string';

try {
  const decoded = jwt.decode(token, { complete: true });
  console.log('Decoded header:', decoded.header);
  console.log('Decoded payload:', decoded.payload);
  console.log('Expires at:', new Date(decoded.payload.exp * 1000));
  console.log('Current time:', new Date());
  console.log('Token valid?', decoded.payload.exp * 1000 > Date.now());
} catch (e) {
  console.log('Error decoding:', e.message);
}
