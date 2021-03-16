import bcrypt from "bcrypt";

export default (string) => bcrypt.hash(string, 10);
