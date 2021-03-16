import cors from "cors";
import settings from "../lib/settings";

const urlsAllowedToAccess =
  Object.entries(settings.urls || {}).map(([key, value]) => value) || [];

export const configuration = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || urlsAllowedToAccess.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} not permitted by CORS policy.`));
    }
  },
};

export default (req, res, next) => {
  return cors(configuration)(req, res, next);
};
