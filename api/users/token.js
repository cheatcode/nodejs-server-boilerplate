/* eslint-disable consistent-return */

import validateLoginToken from "./validateLoginToken";
import decryptLoginToken from "./decryptLoginToken";
import getExistingUserByEmailPassword from "./getExistingUserByEmailPassword";
import formatErrorString from "../../lib/formatErrorString";

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.token) throw new Error("options.token is required.");
  } catch (error) {
    throw new Error(formatErrorString("token.validateOptions", error));
  }
};

const token = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    await validateLoginToken({ token: options.token });

    const decryptedLoginToken = await decryptLoginToken({
      token: options.token,
    });

    const user = await getExistingUserByEmailPassword({
      emailAddress: decryptedLoginToken.emailAddress,
      password: decryptedLoginToken.password,
    });

    resolve(user);
  } catch (exception) {
    // NOTE: Special usage of resolve. We don't want to reject because Apollo Server
    // can't take in an error string, so we resolve with an object containing an error
    // which is anticipated in /api/graphql/server.
    resolve({ error: formatErrorString("token", exception) });
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    token(options, { resolve, reject });
  });
