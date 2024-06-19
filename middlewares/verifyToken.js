const jwt = require("jsonwebtoken");


// verify Token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else if (token === undefined) {
    res.status(401).json({ message: "no token provided" });
  }
}

module.exports = {
  verifyToken,
};
