const express = require('express')
const { check, validationResult } = require('express-validator')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
//var uniqueValidator = require('mongoose-unique-validator');

const auth_schema = require('../models/auth')



router.post("/signup", [

    check("email", "invalid email").isEmail(),
    check("passward", "invalid passward").isLength({
        min: 6
    }).isStrongPassword(),
    check("dob").isString(),
    check("Name").isAlpha()
], async (req, res, next) => {

    const { email, passward, Name, dob } = req.body;
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.json({
            errors: error.array()
        })
    }
    const hashedPassword = await bcrypt.hash(passward, 10);
    const auth = new auth_schema({

        email: email,
        passward: hashedPassword,
        name: Name,
        dob: dob

    })
  //  auth.plugin(uniqueValidator, { message: 'already exists!' });
    const data = await auth.save()
    console.log(data)
   


    const token = await JWT.sign({ email }, "nfb32iur32ibfqfvi3vf932bg932g932", { expiresIn: 360000 });
    return res.status(200).json({
        message: "user created",
        token: token
      });

    

})

router.post("/login", async (req, res) => {


    const user = await auth_schema.find({ email: req.body.email })
    console.log("hi")
    console.log(req.body.email, req.body.passward)
    if(user<1){
        return res.json({
            errors: [
                {
                    msg: "Invalid email",
                }
            ]
        })
    }
    else{

    let isMatch = await bcrypt.compare(req.body.passward, user[0].passward);
  
     if(!isMatch){
         return res.json({
             errors: [
                 {
                     msg: "Invalid passward" 
                 }
             ]
         })
     }
     else{
     const token = await JWT.sign({email : user[0].email}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000})
     console.log(token)

     return res.status(200).json({
        message: "Auth successful",
        token: token
      });
    }


    }
})

module.exports = router