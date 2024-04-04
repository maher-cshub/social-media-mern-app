const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/userModel');
const Token = require("../models/tokenModel")
const fs = require("fs")
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res,next) => {
  const formidable = require("formidable")
  let form = new formidable.IncomingForm({   "keepExtensions": true, "allowEmptyFiles": true, "minFileSize": 0})
  let [fields,files] = await form.parse(req)
  let { username, email, password } = fields;
  username = username[0]
  email = email[0]
  password = password[0]
  try {
    let user = await User.findOne({$or:[{ username: username} , {email: email }]});

    if (user) {
      return res.status(400).json({ msg: 'User already exists (username or email already used before!)' });
    }

    let filesize = files["file"][0]["size"]
    let newname = "default_profile_male_user.svg"

    if (filesize > 0){
      //upload the file
      let exct = files["file"][0]["newFilename"].split(".")[1]
      newname = `${username}_profile.${exct}`
      fs.copyFile(files["file"][0]["filepath"],`./uploads/${newname}`,(err)=>{
        console.log(err)
      })
    }


    // user added 
    user = new User({
      username,
      email,
      password,
      profilePicture:newname
    });
    
    req.payload = username
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  let formidable = require("formidable");
  let form = new formidable.IncomingForm({"keepExtensions": true, "allowEmptyFiles": true, "minFileSize": 0})
  let fields = await form.parse(req);
  const { email, password } = fields[0];
  try {
    let user = await User.findOne({ email: email[0] });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password[0], user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = {
      user: {
        id: user._id.toString()
      }
    };
    console.log(payload)
    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Optionally, you may want to invalidate the token or perform other actions on logout
    const token = new Token({
      token:req.header('x-auth-token'),
      user:req.user.id
    })
    console.log(token)
    await token.save();
    res.json({ msg: 'User logged out' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
