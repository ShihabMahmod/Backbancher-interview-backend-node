import bcrypt from "bcrypt";
import prisma from "../../config/db.config.js";
import generateToken from "../../utils/GenerateToken.js";
import Validator from '../../validator/Validator.js';
import RandomNumber from "../../utils/RandomNumber.js";

class AuthController {

  static async login(req, res) { 

    
      const { email, password } = req.body;
      
      const isValidate = await Validator.loginValidation(req.body);
      if (isValidate.success != true) {
        return res.status(400).json({ errors: isValidate });
      }
      const user = await prisma.user.findUnique({
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
  static async user(req, res) {
    const user = req.user;
    return res.status(200).json({ user: user });
  }
}

export default AuthController;
