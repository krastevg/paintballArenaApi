const crypto = require("crypto");

const generatePassword = () => {
  return crypto.randomBytes(3).toString("hex");
};

module.exports = {
  generatePassword,
};
