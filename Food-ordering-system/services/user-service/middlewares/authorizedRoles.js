const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are unauthorized for this action." });
    }
    next();
  };
};

module.exports = authorizeRoles;
