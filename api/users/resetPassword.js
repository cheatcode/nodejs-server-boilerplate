/* eslint-disable consistent-return */

import Users from "./index";
import hashString from "./hashString";
import encryptLoginToken from "./encryptLoginToken";

const addSessionToUser = (userId = null, session = null) => {
  try {
    return Users.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {
          sessions: session,
        },
      }
    );
  } catch (error) {
    throw new Error(formatErrorString("resetPassword.addSessionToUser", error));
  }
};

const setNewPasswordOnUser = async (userId = "", password = "") => {
  try {
    const hashedPassword = await hashString(password);

    await Users.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    return hashedPassword;
  } catch (exception) {
    throw new Error(`[actionName.setNewPasswordOnUser] ${exception.message}`);
  }
};

const getUserWithToken = (token = "") => {
  try {
    return Users.findOne({ "passwordResetTokens.token": token });
  } catch (exception) {
    throw new Error(`[resetPassword.getUserWithToken] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error("options object is required.");
    if (!options.token) throw new Error("options.token is required.");
    if (!options.newPassword)
      throw new Error("options.newPassword is required.");
    if (!options.repeatNewPassword)
      throw new Error("options.repeatNewPassword is required.");
  } catch (exception) {
    throw new Error(`[resetPassword.validateOptions] ${exception.message}`);
  }
};

const resetPassword = async (options, { resolve, reject }) => {
  try {
    validateOptions(options);

    const user = await getUserWithToken(options.token);

    if (!user) {
      throw new Error("Sorry, that token is invalid. Please try again.");
    }

    if (options.newPassword !== options.repeatNewPassword) {
      throw new Error(
        "Passwords must match. Please double-check your passwords match and try again."
      );
    }

    const hashedNewPassword = await setNewPasswordOnUser(
      user?._id,
      options.newPassword
    );

    const login = await encryptLoginToken({
      userId: user?._id,
      emailAddress: user?.emailAddress,
      password: hashedNewPassword,
    });

    await addSessionToUser(user?._id, login);

    resolve({
      user,
      ...login,
    });
  } catch (exception) {
    reject(`[resetPassword] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    resetPassword(options, { resolve, reject });
  });
