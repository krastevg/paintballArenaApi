const crypto = require("crypto");

const generateRandomString = (numberOfBytes) => {
  return crypto.randomBytes(numberOfBytes).toString("hex");
};

module.exports = {
  generateRandomString,
};
