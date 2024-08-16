const  Roles = {
    admin: {
      can: ['create', 'read', 'update', 'delete']
    },
    user: {
      can: ['read', 'update']
    },
    guest: {
      can: ['read']
    }
  };
  export default Roles;