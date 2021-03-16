import getSlug from "speakingurl";

export default (string = "") => {
  return getSlug(string, {
    separator: "-",
    custom: { "'": "" },
  });
};
