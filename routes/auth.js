const router = require ('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation');
const user = require('../models/user');

// /registration

router.post("/register", async(req, res) => {

    // validate the user input (name, email, password)
    const { error } = registerValidation(req.body);

    


    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    // check if the email is already registered 
    const emailExist = await user.findOne({ email: req.body.email});

    if (emailExist) {
        return res.status(400).json({ error: "Email already exists in the system"});
    }

    // Generate the hashed password 
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);


    //create a user object and save in the DB
    const userObject = new user({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try {
        const savedUser = await userObject.save();
        res.json({ error: null, data: savedUser._id });

    } catch (error) {
        res.status(400).json({ error })
    }  


    return res.status(200).json({msg: "Register route..."})
})




// /login
router.post("/login", async (req, res) => {

//validate user login information
const { error } = loginValidation(req.body);


if (error) {
    return res.status(400).json({ error: error.details[0].message});
}

//if login info is valid, get the user
if (error) {
    return res.status(400).json({ error: error.details[0].message});
}

//error if the email is not existing 
const userObject = await user.findOne({ email: req.body.email });

if (!userObject) {
    return res.status(400).json({ error: "This user is not registered in the system"});
}

//user exist - check for password correctness
const validPassword = await bcrypt.compare(req.body.password, userObject.password)

//error if the password not exist 
if (!validPassword) {
    return res.status(400).json({ error: "The password is not correct"});
}

//create authentication token
const token = jwt.sign(
    //payload
    {
        name: user.name,
        id: user._id
    },

    //Token_SECRET
    process.env.TOKEN_SECRET,
    //EXPIRATION TIME
    { expiresIn: process.env.JWT_EXPIRES_IN},

    
);

//attach authentication token to header
res.header("auth-token", token).json({
    error:null,
    data: { token }
});

});

module.exports = router;