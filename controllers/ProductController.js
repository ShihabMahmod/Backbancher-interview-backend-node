import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import Validator from '../validator/Validator.js';

class AuthController {

  static async index(req, res){

    try {
      
      const setting = await prisma.setting.findFirst({
        select : {
          logo : true,
          loginpage_image : true,
        }
      });
  
      return res.json(setting);

    } catch (error) {

      return res.status(401).json({ message: "Invalid credentials" }); 
    }
  }
  static async login(req, res) { 

      const { email, password } = req.body;
      
      const isValidate = await Validator.loginValidation(req.body);
      if (isValidate.success != true) {
        return res.status(400).json({ errors: isValidate });
      }
      const user = await prisma.admin.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            return res.json({
                admin : {
                    name : user.name,
                    email : user.email,
                    image : user.image
                },
                token : token,
                message: "Logged in successfully!",
              });
        }

        return res.status(401).json({ message: "Password does not match!!" });
      }else{
        return res.status(401).json({ message: "Invalid credentials" });
      }
  }
  static async forgot_password_email(req, res) { 
    try {
      const { email } = req.body;
      var success = true;
      const isValidate = await Validator.resetemailValidation(req.body);
      if (isValidate.success != true) {
          return res.status(400).json({ errors: isValidate });
      }
      const user = await prisma.admin.findFirst({
          where: {
            email: email,
          },
      });
      if (user) {
        var verified_token = RandomNumber(100000,999999);
        const mail_credentials = await prisma.email.findFirst({});
        var transporter = send_mail();
        var mailOptions = {
          from: mail_credentials.email_from,
          to: email,
          subject: 'Forgot password otp',
          text: 'Your reset password otp is : '+ verified_token
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            success = false;
          } else {
            success = true
          }
        });
        
        if(success == false) {
          return res.status(500).json({ message: "Something went wrong." });
        }
        await prisma.admin.update({
            where : { 
                id: user.id,
            },
            data : {
            verified_token : verified_token
            }
        });

        return res.status(200).json({ message: "Send otp in your email!" });
      }else{
          return res.status(401).json({ message: "Email not found!" });
      }
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
  static async check_otp(req, res) { 

    try {
        const otp = parseInt(req.params.otp);
        var success = false;
        const user = await prisma.admin.findFirst({
            where: {
                verified_token : otp,
            },
        });
        if (!user) {
          return res.status(500).json({ 
            success : false,
            message: "Invalid token!" 
        });
        }
        return res.status(200).json({ 
            success: true,
            message : "found!"
         });
     
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
  static async reset_password(req, res) { 

    try {
        const otp = parseInt(req.params.otp);
        const { password,confirm_password } =req.body;
       
        const isValidate = await Validator.resetpasswordValidation(req.body);
        if (isValidate.success != true) {
            return res.status(400).json({ errors: isValidate });
        }
        if(!(password === confirm_password)) {
            return res.status(200).json({ message : "password does not match!" });
        }
        const hashPassword = bcrypt.hashSync(password, 15);
        const user = await prisma.admin.findFirst({
            where: {
                verified_token : otp,
            },
        });
        if(!user){
            return res.status(200).json({ message : "Otp not found"});
        }
        await prisma.admin.update({
            where: {
              id: user.id,
            },
            data: {
              password: hashPassword,
              verified_token: 0
            },
          });
        return res.status(200).json({ message : "Reset your password.Login now!"});
     
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }

  static async user(req, res) {
    const user = req.user;
    return res.status(200).json({ user: user });
  }
}

export default AuthController;
