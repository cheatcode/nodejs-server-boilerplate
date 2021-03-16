import dayjs from "dayjs";

export default (res = null) => {
  if (!res) return null;

  res.cookie("app_login_token", null, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs().toDate(),
  });

  res.cookie("app_login_tokenExpiresAt", null, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs().toDate(),
  });

  return res;
};
