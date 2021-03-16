/* eslint-disable consistent-return */

import Users from "./index";
import formatErrorString from "../../lib/formatErrorString";

const getUser = (emailAddress = "", password = "") => {
  try {
    return Users.findOne({ emailAddress, password });
  } catch (error) {
    throw new Error(
      formatErrorString("getExistingUserByEmailPassword.getUser", error)
    );
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.emailAddress)
      throw new Error("options.emailAddress is required.");
    if (!options.password) throw new Error("options.password is required.");
  } catch (error) {
    throw new Error(
      formatErrorString("getExistingUserByEmailPassword.validateOptions", error)
    );
  }
};

const getExistingUserByEmailPassword = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const user = await getUser(options.emailAddress, options.password);

    resolve(user);
  } catch (error) {
    throw new Error(formatErrorString("getExistingUserByEmailPassword", error));
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    getExistingUserByEmailPassword(options, { resolve, reject });
  });
