const jwt = require("jsonwebtoken");

const genToken = (id, username) => {
  const token = jwt.sign({ id, username }, process.env.PRIVATE_KEY);

  return token;
};

const authAccess = (req, res, next) => {
  const cookieWithToken = req.cookies["paint"];
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "JWT token not found !" } });
    return;
  }

  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY); // throws if fail
    console.log(result); //for  debugging
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
  }
};

module.exports = { genToken, authAccess };
