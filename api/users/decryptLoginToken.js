/* eslint-disable consistent-return */

import jwt from "jsonwebtoken";
import formatErrorString from "../../lib/formatErrorString";
import settings from "../../lib/settings";

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.token) throw new Error("options.token is required.");
  } catch (error) {
    throw new Error(
      formatErrorString("decryptLoginToken.validateOptions", error)
    );
  }
};

const decryptLoginToken = (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const decryptedLoginToken = jwt.verify(
      options.token,
      settings.authentication.token
    );

    resolve(decryptedLoginToken);
  } catch (error) {
    reject(formatErrorString("decryptLoginToken", error));
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    decryptLoginToken(options, { resolve, reject });
  });
