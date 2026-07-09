const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_token_for_employee_management_portal', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Access Denied: Invalid or Expired Token' });
    }
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access Denied: User not authenticated' });
    }
    if (!allowedRoles.includes(req.user.roleName)) {
      return res.status(403).json({ message: `Access Denied: Requires one of roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
