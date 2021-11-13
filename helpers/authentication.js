const jwt = require("jsonwebtoken");
// generates jwt token
const genToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.PRIVATE_KEY);

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
  console.log(loggedIn, requestedFor);
  return loggedIn.id === requestedFor ? false : true;
};

module.exports = {
  genToken,
  authAccess,
  checkImpostor,
};
