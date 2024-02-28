const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const User = require("../models/User.js");
const { query, validationResult, body } = require('express-validator');
var jwt = require('jsonwebtoken');
const jwtSecretKey = "Aisha@917";
var fetchuser=require('../middleware/fetchUser')

//ROUTE 1: Create a user using "/api/auth/createuser"
router.post('/createuser', [body('email', 'Enter a valid email').isEmail(),
body('password', 'Enter a valid password of length 8').isLength({ min: 8 }),], async (req, res) => {

   // If there are errors,return Bad Request and the errors
   const result = validationResult(req);
   if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
   }
   //Check whether the user with this email exists already
   try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }
      const salt = await bcryptjs.genSalt(10);
      const secPass = await bcryptjs.hash(req.body.password, salt);
      user = await User.create({
         name: req.body.name,
         password: secPass,
         email: req.body.email
      })
      const data = {
         user: {
            id: user.id
         }
      }
      const authToken = jwt.sign(data, jwtSecretKey);
      // .then(user=>res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error:"Please Enter unique value for email"})})
      res.json({ authToken })
   }
   catch (error) {
      console.error(error.message);
      res.status(400).send("Internal Server Error");

   }

})

// ROUTE 2 : Authenticate a User using POST"/api/auth/login"No Login Required

router.get('/loginuser', [
   body('email').isEmail(),
   body('password', "Password cannot be blank").exists(),
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ errors: "Please try to login with correct credentials" });
      }
      const passwordCompare = bcryptjs.compare(password, user.password);
      if (!passwordCompare) {
         return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
      const payload = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(payload, jwtSecretKey);
      res.json({ authtoken })

   }
   catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
}
)

// ROUTE 3 :  Get loggedIn user details "/api/auth/getuser" LoggedIn Required
router.get('/getuser',fetchuser,async(req,res)=>{

   try{
      const userId= req.user.id;
      const user= await User.findById(userId).select("-password");
      res.status(200).send(user);
   }
   catch(error){
      console.error(error.message);
      res.status(500).send("Internel Server Error");
   }

})
module.exports = router;