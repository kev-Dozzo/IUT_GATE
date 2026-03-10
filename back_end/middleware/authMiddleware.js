const auth = (req, res, next) => {
  console.log("verification utilisateur");

  next();
};

module.exports = auth;
