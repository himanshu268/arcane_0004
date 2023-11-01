const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const jwttoken = "notgonnadisclose";
var fetchuser = require('../middleware/fetchuser');
//const
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
// import {AsyncStorage} from 'react-native';
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();



//this is for email sending
// const transporter = nodemailer.createTransport({
//   service: 'your-email-service',
//   auth: {
//     user: 'your-email@example.com',
//     pass: 'your-email-password',
//   },
// });

// Configure nodemailer to send emails (you need to provide your email provider details)
// const transporter = nodemailer.createTransport({
//   service: 'your-email-service',
//   auth: {
//     user: 'your-email@example.com',
//     pass: 'your-email-password',
//   },
// });


// Simulated database for user data
const users = [];

// Endpoint for verifying the email
router.get('/verify-email', async(req, res) => {
  const token = req.query.token;

  // Verify the token and mark the user as verified
  
  try{
    const decoded = jwt.verify(token, jwttoken);
    const email=decoded.data.email
    const user=await User.findOne({email})
    console.log(email)
    x="True"
    if (user) {
      const tim = await User.findOneAndUpdate({ email: email },
        { verified: x },
        { new: true }
      );
      res.status(200).json({ message: 'Email verified' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
  catch(err) {
    return res.status(400).json({ message: 'Invalid token' });

  }
});



router.post('/signup', [
  body('email', 'enter a valid email address').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 3 }),
  body('desc').isLength({ min: 3 }),




],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      let name = await User.findOne({ username: req.body.username });
      if (user || name) {
        return res.status(400).json({ error: "email/username already exists" });
      }
      //creating a user account and encrypt pwd
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // console.log(req.body.username);
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        description: req.body.desc

        //   }).then(user => res.json(user))
        //   .catch(err =>{console.log(err) 
        //     res.json({error:"enter a unique email",message:err.message})
        // console.log(username);
      });
      // console.log(user)
      const data = {
        user: {
          id: user.id,
          email: user.email
        }
      }

      const expiresInHours = 3;
      const expirationTime = Math.floor(Date.now() / 1000) + 3600 * expiresInHours;
      const authtoken = jwt.sign({data,exp: expirationTime},jwttoken);
      const verificationLink = `http://localhost:5000/api/verify-email?token=${authtoken}`;
      console.log(verificationLink);
      res.json({ authtoken });
    }
    catch (error) {
      console.error(error.message);
      res.status(500).send(error)
    }
  }
);
//login
router.post('/signin', [
  body('email', 'enter a valid email address').isEmail(),
  body('password', 'password cannot be blank').exists(),

],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email);
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "enter correct credential" });
      }
      const password_compare = await bcrypt.compare(password, user.password);
      if (!password_compare) {
        return res.status(400).json({ error: "enter correct credential" });

      }
      const data = {
        user: {
          id: user.id,
        },
        username: user.username
      }
      const expiresInHours = 3;
      const expirationTime = Math.floor(Date.now() / 1000) + 3600 * expiresInHours;
      const authtoken = jwt.sign({data,exp: expirationTime},jwttoken);  
      // const token = await asyncLocalStorage.setItem('auth-token',authtoken);
     
        
      res.json({ authtoken })
      


    }
    catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");



    }
  })
//get userid after login using middleware no login required
router.post('/getuser',async (req, res) => {
  // const user=req.user;
  // console.log(user.id);
  try {
    // userId = req.user.id;
    const accessToken = localStorage.getItem('auth-token');
    // console.log(userId);
    // const user = await User.findById(userId).select("-password");
    res.send(accessToken)

  } catch (error) {
    res.status(500).send("internal error");

  }
})

router.delete('/logout', async (req, res) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send('access denied')
  }
  else {
    await jwtr.destroy(token);

    // console.log('hello')
    res.status(200).send('you are logged out')
  }

})

let otp = '';
let wrongAttempts = 0;
const maxWrongAttempts = 3;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function resetOTP() {
  otp = '';
  wrongAttempts = 0;
  return generateNewOTP();
}
function generateNewOTP() {
  return generateOTP();
  // console.log(otp)
}

// Generate an initial OTP
generateNewOTP();

// Generate a new OTP every 5 minutes
setInterval(generateNewOTP, 300000);
// const users=[]

// Endpoint to initiate the "forgot password" process
router.post('/forgot-password', async (req, res) => {
  const email = req.body;


  // Check if the user exists
  // const user = users.find((User) => User.email === email);
  let user = await User.findOne(email);
  console.log(user.otp)


  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate a new OTP and store it for the user
  const otp = generateNewOTP();
  // User.otp = otp;
  const result = await User.findOneAndUpdate(email,
    { otp: otp },
    { new: true }
  );

  console.log(otp)
  res.status(200).send(result)


  // Send the OTP to the user's email
  // const mailOptions = {
  //   from: 'your-email@example.com',
  //   to: email,
  //   subject: 'Forgot Password OTP',
  //   text: `Your OTP for password reset: ${otp}`,
  // };

  // transporter.sendMail(mailOptions, (error) => {
  //   if (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Failed to send OTP' });
  //   } else {
  //     res.status(200).json({ message: 'OTP sent successfully' });
  //   }
  // });
});

// Endpoint to verify the OTP and set a new password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // const =req.body;

  // Find the user in the database
  let userss = await User.findOne({ email });
  console.log(userss)

  if (!userss) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify the OTP
  console.log(otp)
  console.log(userss.otp)

  if (otp !== userss.otp) {
    wrongAttempts += 1;
    if (wrongAttempts >= maxWrongAttempts) {
      let otp = resetOTP();
      let results = await User.findOneAndUpdate({ email: email },
        { otp: otp },
        { new: true }
      );
      res.status(400).json({ message: 'Maximum wrong attempts reached. OTP has been reset.' });
    } else {
      res.status(400).json({ message: 'OTP is incorrect.' });
    }
  } else {

    console.log("this is running")
    // Update the user's password and clear the OTP
    // User.password = newPassword;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);
    const result = await User.findOneAndUpdate({ email: email },
      { password: secPass },
      { new: true }
    );
    let otpi = generateNewOTP();
    let results = await User.findOneAndUpdate({ email: email },
      { otp: otpi },
      { new: true }
    );


    res.status(200).json({ message: 'Password reset successfully' });
  }
});



module.exports = router