const jwt = require("jsonwebtoken");

const genToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.PRIVATE_KEY);

  return token;
};

const authAccess = (req, res, next) => {
  const cookieWithToken = req.cookies["paint"];
  if (!cookieWithToken) {
    res.status(401).send({ error: { message: "JWT token not found !" } });
    return;
  }

  try {
    const result = jwt.verify(cookieWithToken, process.env.PRIVATE_KEY);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: { message: "Authentication FAILED" } });
    return;
  }
};

const dataValidation = (req, res, next) => {
  // validates data fields for user register and login
  let { email, password, rePassword } = req.body;
  rePassword = rePassword || password;

  if (
    password !== rePassword ||
    !password.match(/^[A-Za-z0-9]{5,}$/) ||
    !email.match(
      /^([\w!#$%&'*+\-\/=?^_`{|\.]{3,64})@([\w\.]{3,253})\.([a-z]{2,3})$/
    )
  ) {
    res.status(400).send({ error: { message: "Data does not meet criteria" } }); // change code
    return;
  }

  next();
};

module.exports = { genToken, authAccess, dataValidation };
