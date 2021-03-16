import getBaseAuthenticationCookie from "./getBaseAuthenticationCookie";

export default (res = null, authentication = null) => {
  if (!res || !authentication) return null;

  res.cookie(
    "app_login_token",
    authentication.token,
    getBaseAuthenticationCookie(authentication.tokenExpiresAt)
  );

  res.cookie(
    "app_login_tokenExpiresAt",
    authentication.tokenExpiresAt,
    getBaseAuthenticationCookie(authentication.tokenExpiresAt)
  );

  return res;
};
