import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";

class HomeController {

  static async index(req, res){

    try {
      
      return res.json("hello from homepage");

    } catch (error) {

      return res.status(401).json({ message: error.message }); 
    }
  }
}

export default HomeController;
