import bodyParser from "body-parser";

export default (req, res, next) => {
  const contentType = req.headers["content-type"];

  if (contentType && contentType === "application/x-www-form-urlencoded") {
    return bodyParser.urlencoded({ extended: true })(req, res, next);
  }

  return bodyParser.json()(req, res, next);
};
