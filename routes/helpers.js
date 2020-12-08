const jwt = require("jsonwebtoken");

const genToken = (id, username) => {
  const token = jwt.sign({ id, username }, process.env.PRIVATE_KEY);

  return token;
};

module.exports = { genToken };
