/* eslint-disable consistent-return */

import crypto from "crypto-extra";
import Users from "./index";

const setTokenOnUser = (emailAddress = "", token = "") => {
  try {
    return Users.updateOne(
      {
        emailAddress,
      },
      {
        $addToSet: {
          passwordResetTokens: {
            token,
            requestedAt: new Date().toISOString(),
          },
        },
      }
    );
  } catch (exception) {
    throw new Error(
      `[generatePasswordResetToken.setTokenOnUser] ${exception.message}`
    );
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.emailAddress)
      throw new Error("options.emailAddress is required.");
  } catch (exception) {
    throw new Error(
      `[generatePasswordResetToken.validateOptions] ${exception.message}`
    );
  }
};

const generatePasswordResetToken = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const token = crypto.randomString(32);
    await setTokenOnUser(options.emailAddress, token);

    resolve(token);
  } catch (exception) {
    reject(`[generatePasswordResetToken] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    generatePasswordResetToken(options, { resolve, reject });
  });
