// authMiddleware.js
import prisma from "../config/db.config.js";
import Roles from "../utils/Roles.js";

function Permission(permission) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'Unauthorized' });
      }
      
      let userRole;
      if(user.is_admin == 1){
         userRole = "admin";
        
      }else if(user.is_admin == 0){
         userRole = "user";
      }else{
         userRole = "guest";
      }

      if (Roles[userRole] && Roles[userRole].can.includes(permission)) {
        return next();
      }

      res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
}
export default Permission;
