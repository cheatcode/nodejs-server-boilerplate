export default (user = null) => {
  if (!user) throw new Error("Sorry, you need to be logged in to do this.");
  return true;
};
