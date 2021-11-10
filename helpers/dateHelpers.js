const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
};

const createDate = (month, day, year) => {
  return new Date(`${month} ${day}, ${year} 00:00:00`);
};

module.exports = {
  getCurrentDate,
  createDate,
};
