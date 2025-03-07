const notFound = (req, res) =>
  res
    .status(404)
    .send(
      "<h1 style={{padding:10px; text-align:center;}}>Sorry, Route not Found </h1>"
    );

module.exports = notFound;
