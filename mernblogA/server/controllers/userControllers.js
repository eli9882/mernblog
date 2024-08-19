const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require("uuid")
const fs = require('fs')
const path = require('path')

const User = require('../models/userModel');
const HttpError = require('../models/errorModel');


const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        const newEmail = email.toLowerCase();
        
        const emailExists = await User.findOne({email: newEmail});
        if(emailExists) {
            return next(new HttpError("Email already exist", 422))
        }
        
        if((password.trim()).length < 6) {
            return next(new HttpError("Password should be at least 6 characters", 422))
        }

        if(password != password2) {
            return next(new HttpError("Passwords do not match.", 422))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        // don't send new user as response to frontend
        const newUser = await User.create({name, email: newEmail, password: hashedPass});
        res.status(201).json(`New user ${newUser.email} registered.`);
    } catch (error) {
        return next(new HttpError("User registration failed.", 422))
    }
}




// JWT generator
const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"});
    return token;
}




const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Rellene todos los campos.", 422))
        }

        const newEmail = email.toLowerCase()

        const user = await User.findOne({email: newEmail});
        if(!user) {
            return next(new HttpError("Credenciales invalidas.", 422))
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if(!comparePass) {
            return next(new HttpError("Credenciales invalidas.", 422))
        }

        const {_id: id, name} = user;
        const token = generateToken({id, name})
        
        res.status(200).json({token, id, name})
    } catch (error) {
        return next(new HttpError("Error al iniciar sesión. Por favor, compruebe sus credenciales.", 422))
    }
}





// for profile page
const getUser = async (req, res, next) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if(!user) {
            return next(new HttpError("Usuario no encontrado.", 404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}






const logoutUser = (req, res, next) => {
    res.cookie('token', '', {httpOnly: true, expires: new Date(0)})
    res.status(200).json('User Logged out')
}





// Change user profile picture
const changeAvatar = async (req, res, next) => {
    let fileName;
  
    try {
      if (!req.files || !req.files.avatar) {
        return next(new HttpError("No se ha cargado ningún archivo.", 422));
      }
  
      // Find user from database
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new HttpError("Usuario no encontrado.", 404));
      }
  
      // Delete old avatar if exists
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', 'uploads', user.avatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) {
            console.error('Error deleting old avatar:', err);
          } else {
            console.log(`Old avatar deleted: ${oldAvatarPath}`);
          }
        });
      }
  
      const { avatar } = req.files;
      // Check file size
      if (avatar.size > 500000) {
        return next(new HttpError("Profile picture too big. File size should be under 500kb", 422));
      }
  
      // Generate new filename
      fileName = avatar.name;
      const splittedFilename = fileName.split('.');
      const newFilename = `${splittedFilename[0]}-${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;
      
      const uploadPath = path.join(__dirname, '..', 'uploads', newFilename);
  
      // Move new avatar
      avatar.mv(uploadPath, async (err) => {
        if (err) {
          return next(new HttpError("Error moving the new avatar file", 500));
        }
  
        // Check if the file was saved successfully
        fs.access(uploadPath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error('File not found after moving:', uploadPath);
            return next(new HttpError("Error confirming the new avatar file", 500));
          } else {
            console.log(`New avatar successfully saved: ${uploadPath}`);
          }
        });
  
        // Update user avatar in database
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });
        if (!updatedUser) {
          return next(new HttpError("Avatar couldn't be changed.", 500));
        }
  
        res.status(200).json(updatedUser);
      });
  
    } catch (error) {
      return next(new HttpError("Something went wrong, please try again.", 500));
    }
  }
  







// function to update current user details fromm User Profile
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        // get user from database
        const user = await User.findById(req.user.id)
        if(!user) {
            return next(new HttpError("User not found.", 403))
        }

        // make sure new email doesn't already exist
        const emailExist = await User.findOne({email})
        if(emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exist.", 422))
        }

        // compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword) {
            return next(new HttpError("Invalid current password."))
        }

        // compare new passwords
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match.", 422))
        }

        // hash new password
        const newSalt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, newSalt)
        
        // update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: newHash}, {new: true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}










const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}




module.exports = {registerUser, loginUser, logoutUser, getUser, changeAvatar, editUser, getAuthors}