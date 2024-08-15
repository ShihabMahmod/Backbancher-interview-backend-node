import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import Validator from '../validator/Validator.js';
import { slugify } from "../utils/SlugGanerator.js";

class ProductController {

  static async index(req, res){

    try {
      
      const setting = await prisma.Product.findMany({});
      return res.json(setting);

    } catch (error) {

      return res.status(401).json({ message: "Invalid credentials" }); 
    }
  }
  static async store(req, res) { 

    try {
      const { name,price,quantity,description } = req.body;
      
      const isValidate = await Validator.productValidation(req.body);
      if (isValidate.success != true) {
        return res.status(400).json({ errors: isValidate });
      }
      let slug = slugify(name);
      const isProductExist = await prisma.product.findFirst({
        where: {
          slug: slug,
        },
      });
      if(isProductExist){
        return res.status(403).json({ message: 'Product is already exist' });
      }

      await prisma.product.create({
       data : {
        name : name,
        slug : slug,
        price : parseFloat(price),
        quantity : parseInt(quantity),
        description : description,
       }
      });
      return res.status(200).json({message : 'Product Create successfully!!'})

    } catch (error) {
      return res.status(500).json({ message: 'Somthing went to wrong' });
      
    }
  }
  static async edit(req, res) { 
    try {
     
      const slug = req.params.slug
      const product = await prisma.product.findFirst({
          where: {
            slug: slug,
          },
      });
      if(!product){
        return res.status(403).json({ message: "Product not found"});
      }
      return res.json({
        product : product
      });
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
  static async update(req, res) { 

    try {
      const slug = req.params.slug;
      const { name,price,quantity,description } = req.body;
      const isValidate = await Validator.productValidation(req.body);
      if (isValidate.success != true) {
        return res.status(400).json({ errors: isValidate });
      }

      const findingProduct = await prisma.product.findFirst({
        where : {
          slug : slug
        }
      });
      if(!findingProduct){
        return res.status(403).json({ message: 'Product not found!!'});
      }

      const isProductExist = await prisma.product.findFirst({
        where: {
          slug: slugify(name),
        },
      });
      if(isProductExist){
        return res.status(403).json({ message: 'Same name product already exist!!'});
      }
      await prisma.product.update({
        where : {
          id : parseInt(isProductExist.id)
        },
        data : {
          name : name,
          slug : slugify(name),
          price : parseFloat(price),
          quantity : parseInt(quantity),
          description : description,
        }
      });
      return res.status(200).json({message : 'Product update successfully!!'})

    } catch (error) {
      return res.status(500).json({ message: 'Somthing went to wrong' });
      
    }
  }
  static async destroy(req, res) { 

    try {
        const slug = req.params.slug;
        const findingProduct = await prisma.product.findFirst({
          where : {
            slug : slug
          }
        });
        if(!findingProduct){
          return res.status(403).json({ message: 'Product not found!!'});
        }
       
        await prisma.product.delete({
            where: {
              id: parseInt(findingProduct.id),
            },
        });
        return res.status(200).json({ message : "Product delete successfully!!"});
     
      } catch (error) {
          return res.status(401).json({ message: "Something wents to wrong!!" });
      }
  }
}

export default ProductController;
