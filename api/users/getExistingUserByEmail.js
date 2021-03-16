/* eslint-disable consistent-return */

import Users from "./index";
import formatErrorString from "../../lib/formatErrorString";

const getUser = (emailAddress = "") => {
  try {
    return Users.findOne({ emailAddress });
  } catch (error) {
    throw new Error(formatErrorString("getExistingUserByEmail.getUser", error));
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.emailAddress)
      throw new Error("options.emailAddress is required.");
  } catch (error) {
    throw new Error(
      formatErrorString("getExistingUserByEmail.validateOptions", error)
    );
  }
};

const getExistingUserByEmail = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const user = await getUser(options.emailAddress);

    resolve(user);
  } catch (error) {
    throw new Error(formatErrorString("getExistingUserByEmail", error));
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    getExistingUserByEmail(options, { resolve, reject });
  });
