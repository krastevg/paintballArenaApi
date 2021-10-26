const jwt = require("jsonwebtoken");
// generates jwt token
const genToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.PRIVATE_KEY);

  return token;
};
// checks for authentication
const authAccess = (req, res, next) => {
  const cookieWithToken = req.cookies["paint"];
  const loggedinUser = req.query.userId;
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "JWT token not found !" } });
    return;
  }

  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY);
    console.log(result.id, loggedinUser);
    if (result.id === loggedinUser) {
      next();
    } else {
      throw "Impostor detected";
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
    return;
  }
};

module.exports = {
  genToken,
  authAccess,
};
