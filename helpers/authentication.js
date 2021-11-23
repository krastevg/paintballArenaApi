const jwt = require("jsonwebtoken");
// generates jwt token
const genToken = (id, email, role) => {
  const token = jwt.sign({ id, email, role }, process.env.PRIVATE_KEY, {
    expiresIn: "15m",
  });

  return token;
};
// checks for authentication
const authAccess = (req, res, next) => {
  const cookieWithToken = req.cookies["paint"];
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "JWT token not found !" } });
    return;
  }
  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY); // throws if failed is synchronous
    req.loggedIn = result;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
    return;
  }
};

const checkImpostor = (loggedIn, requestedFor) => {
  // checks if the user ID is the same as the one which the request is for
  return loggedIn.id === requestedFor ? false : true;
};

const checkAdmin = (req, res, next) => {
  // must be called after AuthAccess

  if (req.loggedIn.role === "admin") {
    next();
  } else {
    res.status(401).send({ error: { message: "Not an administrator" } });
    return;
  }
};

module.exports = {
  genToken,
  authAccess,
  checkImpostor,
  checkAdmin,
};
